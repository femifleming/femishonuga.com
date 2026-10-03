#!/bin/sh
# Build the hand-authored site into dist/. Uses only macOS shell tools and Perl
# from the system installation; Python and third-party packages are not needed.
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd -P)
OUT="$ROOT/dist"
export ROOT OUT

if [ -d "$OUT" ]; then
    chmod -R u+w "$OUT"
fi
rm -rf "$OUT"
mkdir -p "$OUT"

# Copy the whole website, keeping source pages and media. Omit repository and
# build-only files; the generated dist/ directory is recreated on each run.
for item in "$ROOT"/* "$ROOT"/.[!.]* "$ROOT"/..?*; do
    [ -e "$item" ] || [ -L "$item" ] || continue
    name=${item##*/}
    case "$name" in
        .git|.github|.DS_Store|dist|build.sh|.gitignore|BUILDING.md|__pycache__)
            continue
            ;;
    esac
    cp -R "$item" "$OUT/"
done

LC_ALL=C perl - "$ROOT" "$OUT" <<'PERL'
use strict;
use warnings;
use File::Find;
use File::Spec;
use Cwd qw(abs_path);

my ($root, $out) = @ARGV;
my $wiki = File::Spec->catdir($root, 'wiki');
my $sitemap = File::Spec->catfile($wiki, 'sitemap.html');
my @nav = (
    ['audio', 'audio.html'], ['textiles', 'textiles.html'],
    ['architecture', 'arch.html'], ['visual', 'visual.html'],
    ['research', 'research.html'], ['internal', 'meta.html'],
);
my @wiki_pages;
find({ no_chdir => 1, wanted => sub {
    return unless -f $_ && /\.(?:html|htm)\z/i;
    push @wiki_pages, File::Spec->rel2abs($File::Find::name);
}}, $wiki);
@wiki_pages = sort { lc($a) cmp lc($b) } @wiki_pages;

sub read_file {
    my ($path) = @_;
    open my $fh, '<:raw', $path or die "Cannot read $path: $!\n";
    local $/;
    my $text = <$fh>;
    close $fh;
    return defined $text ? $text : '';
}

sub write_file {
    my ($path, $text) = @_;
    open my $fh, '>:raw', $path or die "Cannot write $path: $!\n";
    print {$fh} $text;
    close $fh or die "Cannot finish $path: $!\n";
}

sub esc {
    my ($text) = @_;
    $text //= '';
    $text =~ s/&/&amp;/g;
    $text =~ s/</&lt;/g;
    $text =~ s/>/&gt;/g;
    $text =~ s/"/&quot;/g;
    $text =~ s/'/&#39;/g;
    return $text;
}

sub plain_text {
    my ($text) = @_;
    $text =~ s/<[^>]*>/ /g;
    $text =~ s/&nbsp;/ /gi;
    $text =~ s/&#(?:160|x0*a0);/ /gi;
    $text =~ s/&amp;/&/gi;
    $text =~ s/&lt;/</gi;
    $text =~ s/&gt;/>/gi;
    $text =~ s/&quot;/"/gi;
    $text =~ s/&#39;/'/gi;
    $text =~ s/\s+/ /g;
    $text =~ s/^\s+|\s+$//g;
    return $text;
}

sub label_for {
    my ($page) = @_;
    my $source = read_file($page);
    while ($source =~ m{<(h[1-3])\b[^>]*>(.*?)</h[1-3]\s*>}gis) {
        my $value = plain_text($2);
        return $value if length $value;
    }
    my $title = $source =~ m{<title\b[^>]*>(.*?)</title\s*>}is ? plain_text($1) : '';
    return $title if length $title;
    my $base = $page;
    $base =~ s{.*/}{};
    $base =~ s/\.(?:html|htm)\z//i;
    $base =~ s/[_-]+/ /g;
    return $base;
}

sub hrefs {
    my ($text, $main_only, $ignore_incoming) = @_;
    if ($main_only && $text =~ m{<main\b[^>]*>(.*?)</main\s*>}is) {
        $text = $1;
    } elsif ($main_only) {
        return ();
    }
    if ($ignore_incoming) {
        $text =~ s{<p\b(?=[^>]*\bclass\s*=\s*["'][^"']*\bincoming\b[^"']*["'])[^>]*>.*?</p\s*>}{}gis;
    }
    my @result;
    while ($text =~ m{<a\b([^>]*)>}gis) {
        my $attrs = $1;
        push @result, $1 if $attrs =~ m{\bhref\s*=\s*["']([^"']*)["']}is;
    }
    return @result;
}

sub local_target {
    my ($source, $href) = @_;
    $href =~ s/^\s+|\s+$//g;
    return if !length($href) || $href =~ m{^(?:[a-z][a-z0-9+.-]*:|//)}i;
    my $path = $href;
    $path =~ s/[?#].*\z//s;
    $path =~ s/%([0-9a-f]{2})/chr(hex($1))/egi;
    if (!length $path) {
        return abs_path($source) || File::Spec->rel2abs($source);
    }
    my $candidate = $path =~ m{^/}
        ? File::Spec->catfile($root, substr($path, 1))
        : File::Spec->catfile((File::Spec->splitpath($source))[1], $path);
    if (-d $candidate) {
        for my $index (qw(index.html index.htm)) {
            my $test = File::Spec->catfile($candidate, $index);
            if (-f $test) { $candidate = $test; last }
        }
    }
    return abs_path($candidate) if -f $candidate;
    return;
}

sub rel_url {
    my ($from, $to) = @_;
    my $rel = File::Spec->abs2rel($to, (File::Spec->splitpath($from))[1]);
    $rel =~ s{\\}{/}g;
    return $rel;
}

sub link_html {
    my ($from, $to, $label) = @_;
    return '<a href="' . esc(rel_url($from, $to)) . '">' . esc($label) . '</a>';
}

my %page_set = map { (abs_path($_) || $_) => 1 } @wiki_pages;
my %labels = map { $_ => label_for($_) } @wiki_pages;
my (%outgoing, %incoming);
for my $page (@wiki_pages) {
    next if $page eq $sitemap; # generated sitemap isn't an editorial link source
    my $source = read_file($page);
    for my $href (hrefs($source, 1, 1)) {
        my $target = local_target($page, $href);
        next unless $target && $page_set{$target} && $target ne $page;
        $outgoing{$page}{$target} = 1;
        $incoming{$target}{$page} = 1;
    }
}

sub wiki_style_pages {
    my @styled;
    for my $page (@wiki_pages) {
        my $source = read_file($page);
        my $is_style = 0;
        while ($source =~ m{<link\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>}gis) {
            my $target = local_target($page, $1);
            if ($target && -f $target && $target =~ m{/main\.css\z}i) {
                $is_style = 1;
                last;
            }
        }
        push @styled, $page if $is_style;
    }
    return @styled;
}

sub shared_nav {
    my ($page, $text) = @_;
    my $nav_html = $text =~ m{(<nav\b[^>]*>.*?</nav\s*>)}is ? $1 : '';
    my %have;
    for my $href (hrefs($nav_html, 0, 0)) {
        my $target = local_target($page, $href);
        $have{$target} = 1 if $target;
    }
    my @missing;
    for my $item (@nav) {
        my $target = File::Spec->catfile($wiki, $item->[1]);
        push @missing, $item unless $have{abs_path($target) || $target};
    }
    return $text unless @missing;
    my $list = "\n<ul class=\"wiki-primary-nav\">\n";
    for my $item (@missing) {
        my $target = File::Spec->catfile($wiki, $item->[1]);
        $list .= '<li>' . link_html($page, $target, $item->[0]) . "</li>\n";
    }
    $list .= "</ul>\n";
    if ($text =~ m{<nav\b[^>]*>}i) {
        $text =~ s{(<nav\b[^>]*>)}{$1$list}i;
    } elsif ($text =~ m{</header\s*>}i) {
        $text =~ s{(</header\s*>)}{$1\n<nav aria-label="Wiki">$list</nav>}i;
    } elsif ($text =~ m{<main\b}i) {
        $text =~ s{(<main\b)}{<nav aria-label="Wiki">$list</nav>\n$1}i;
    }
    return $text;
}

sub add_incoming {
    my ($page, $text) = @_;
    my @sources = sort { lc($labels{$a}) cmp lc($labels{$b}) } keys %{ $incoming{$page} || {} };
    my $links = @sources
        ? join(' ', map { link_html($page, $_, $labels{$_}) } @sources)
        : '<span>none</span>';
    my $block = "\n<p class=\"incoming\"><b>incoming links</b> $links</p>\n";
    if ($text =~ m{</main\s*>}i) {
        $text =~ s{(</main\s*>)}{$block$1}i;
    }
    return $text;
}

sub add_footer {
    my ($page, $text) = @_;
    my $wiki_home = File::Spec->catfile($wiki, 'index.html');
    my $map = File::Spec->catfile($wiki, 'sitemap.html');
    my $reports = File::Spec->catfile($out, 'reports', 'index.html');
    my $extra = '<span class="wiki-build-links">' .
        link_html($page, $wiki_home, 'wiki home') . ' · ' .
        link_html($page, $map, 'sitemap') . ' · ' .
        link_html($page, $reports, 'site reports') .
        ' · <a href="mailto:femi.fleming@gmail.com">femi.fleming@gmail.com</a></span>';
    if ($text =~ m{</footer\s*>}i) {
        $text =~ s{(</footer\s*>)}{ · $extra$1}i;
    } elsif ($text =~ m{</body\s*>}i) {
        $text =~ s{(</body\s*>)}{<footer>$extra</footer>\n$1}i;
    }
    return $text;
}

sub report_listing {
    my ($title, $description, @items) = @_;
    my $text = "# $title\n\n$description\n\n";
    if (!@items) { return $text . "No pages found.\n" }
    for my $page (@items) {
        my $relative = File::Spec->abs2rel($page, $root);
        $relative =~ s{\\}{/}g;
        $text .= '- [`' . $labels{$page} . '`](../' . $relative . ")\n";
    }
    return $text;
}

my $reports_dir = File::Spec->catdir($out, 'reports');
mkdir $reports_dir unless -d $reports_dir;
my $home = File::Spec->catfile($wiki, 'index.html');
my %home_targets;
if (-f $home) {
    for my $href (hrefs(read_file($home), 0, 1)) {
        my $target = local_target($home, $href);
        $home_targets{$target} = 1 if $target && $page_set{$target};
    }
}
my @not_home = grep { $_ ne $home && !$home_targets{$_} } @wiki_pages;
my @orphans = grep { $_ ne $sitemap && !keys(%{ $incoming{$_} || {} }) } @wiki_pages;
my @dead_ends = grep { !keys(%{ $outgoing{$_} || {} }) } @wiki_pages;
write_file(File::Spec->catfile($reports_dir, 'not-linked-from-wiki-home.md'),
    report_listing('Wiki pages not linked from the wiki home',
        'These pages have no direct link anywhere on `wiki/index.html`, including its category navigation.', @not_home));
write_file(File::Spec->catfile($reports_dir, 'orphan-pages.md'),
    report_listing('Orphaned wiki pages',
        'Pages with no incoming link from another wiki page main section. The generated sitemap is excluded.', @orphans));
write_file(File::Spec->catfile($reports_dir, 'dead-end-pages.md'),
    report_listing('Wiki pages with no outgoing wiki links',
        'Pages with no outgoing links to another wiki page from their main section.', @dead_ends));

my $backlinks = "# Pages linking to each wiki page\n\n";
for my $page (@wiki_pages) {
    $backlinks .= '## ' . $labels{$page} . ' (`' . File::Spec->abs2rel($page, $root) . "`)\n\n";
    my @sources = sort { lc($labels{$a}) cmp lc($labels{$b}) } keys %{ $incoming{$page} || {} };
    if (!@sources) { $backlinks .= "- No incoming wiki-page links.\n\n"; next }
    for my $source (@sources) {
        my $rel = File::Spec->abs2rel($source, $root); $rel =~ s{\\}{/}g;
        $backlinks .= '- [`' . $labels{$source} . '`](../' . $rel . ")\n";
    }
    $backlinks .= "\n";
}
write_file(File::Spec->catfile($reports_dir, 'backlinks.md'), $backlinks);

my @all_html;
find({ no_chdir => 1, wanted => sub {
    return unless -f $_ && /\.(?:html|htm)\z/i;
    return if index($File::Find::name, $out . '/') == 0;
    push @all_html, File::Spec->rel2abs($File::Find::name);
}}, $root);
my @broken;
for my $source (@all_html) {
    next if $source eq $sitemap;
    for my $href (hrefs(read_file($source), 0, 0)) {
        next if $href =~ m{^(?:[a-z][a-z0-9+.-]*:|//)}i;
        my $target = local_target($source, $href);
        next if $target;
        my $relative = File::Spec->abs2rel($source, $root); $relative =~ s{\\}{/}g;
        push @broken, '- `' . $relative . '` → `' . $href . '` (file not found)';
    }
}
my $broken_text = "# Broken local links\n\n" . (@broken ? join("\n", @broken) . "\n" : "No broken local links found.\n");
write_file(File::Spec->catfile($reports_dir, 'broken-links.md'), $broken_text);

my @report_entries = (
    ['Broken local links', 'broken-links.md'],
    ['Pages linking to each wiki page', 'backlinks.md'],
    ['Orphaned wiki pages', 'orphan-pages.md'],
    ['Wiki pages with no outgoing links', 'dead-end-pages.md'],
    ['Pages not linked from the wiki home', 'not-linked-from-wiki-home.md'],
);
my $index = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Site build reports</title></head><body><main><h1>Site build reports</h1><ul>';
for my $entry (@report_entries) {
    $index .= '<li><a href="' . esc($entry->[1]) . '">' . esc($entry->[0]) . '</a></li>';
}
$index .= '</ul><p><a href="../wiki/index.html">Wiki home</a></p></main></body></html>';
write_file(File::Spec->catfile($reports_dir, 'index.html'), $index);

my @styled;
for my $page (wiki_style_pages()) {
    my $relative = File::Spec->abs2rel($page, $root);
    my $output_page = File::Spec->catfile($out, $relative);
    my $text = read_file($output_page);
    $text = shared_nav($page, $text);
    $text = add_incoming($page, $text);
    $text = add_footer($page, $text);
    write_file($output_page, $text);
    push @styled, $page;
}

if (-f $sitemap) {
    my $text = read_file($sitemap);
    my %groups;
    for my $page (@wiki_pages) {
        my $relative = File::Spec->abs2rel($page, $wiki); $relative =~ s{\\}{/}g;
        my ($group) = split m{/}, $relative;
        $group = 'Wiki pages' if $group eq $relative;
        push @{ $groups{$group} }, $page;
    }
    my $main = '<main><h2>&nbsp;</h2><h1>Wiki sitemap</h1><p>' . scalar(@wiki_pages) . ' hand-authored wiki pages, grouped by folder.</p>';
    for my $group (sort { ($a eq 'Wiki pages' ? 0 : 1) <=> ($b eq 'Wiki pages' ? 0 : 1) || lc($a) cmp lc($b) } keys %groups) {
        $main .= '<h2>' . esc($group) . '</h2><ul>';
        for my $page (@{ $groups{$group} }) {
            $main .= '<li>' . link_html($sitemap, $page, $labels{$page}) . '</li>';
        }
        $main .= '</ul>';
    }
    $main .= '<p><a href="../reports/index.html">site build reports</a></p></main>';
    if ($text =~ m{<main\b[^>]*>.*?</main\s*>}is) {
        $text =~ s{<main\b[^>]*>.*?</main\s*>}{$main}is;
    }
    $text = shared_nav($sitemap, $text);
    $text = add_footer($sitemap, $text);
    write_file(File::Spec->catfile($out, 'wiki', 'sitemap.html'), $text);
}

my $size = 0;
find({ no_chdir => 1, wanted => sub { $size += -s $_ if -f $_ } }, $out);
sub human_size {
    my ($n) = @_;
    for my $unit (qw(B KB MB GB TB)) {
        return sprintf('%.1f %s', $n, $unit) if $n < 1000 || $unit eq 'TB';
        $n /= 1000;
    }
}
print 'Generated ', scalar(@styled), ' wiki-style pages, sitemap, and reports in dist/.', "\n";
print 'Wiki pages: ', scalar(@wiki_pages), '. Reports: ', scalar(@broken), ' broken links, ', scalar(@orphans), ' orphans, ', scalar(@dead_ends), ' dead ends, ', scalar(@not_home), ' not linked from the wiki home.', "\n";
print 'Output size: ', human_size($size), ".\n";
PERL
