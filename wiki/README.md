# How the wiki works

The wiki pages are still plain HTML files that you edit by hand. Two things are
no longer typed by hand:

- the **sidebar** (the `<nav>` columns next to the logo), and
- the **page tree on `sitemap.html`**.

Both come from one file, **`wiki/lexicon.txt`**. A small script, **`wiki/build.py`**,
reads it and writes the sidebars and the sitemap into the HTML files for you.

The idea comes from [XXIIVV's oscean](https://github.com/XXIIVV/oscean): one list of
pages, where each page's place in the list decides its sidebar.

---

## The everyday routine

1. Edit your pages and/or `wiki/lexicon.txt`.
2. In Terminal:

   ```sh
   cd ~/Desktop/femishonuga.com
   python3 wiki/build.py
   ```

3. Look at the pages in your browser.
4. Commit and push like you always have:

   ```sh
   git add -A && git commit -m "update wiki" && git push
   ```

The script edits the HTML files themselves. There is no `dist/` folder, and GitHub
publishes exactly what you push. If you forget to run the script, nothing breaks:
the sidebars just stay the way they were last time.

---

## lexicon.txt

One line per page:

```
file.html  sidebar label | sitemap label
```

**Indent** a line (2 spaces) under another page to make it a sub-page:

```
../index.html  home
  index.html  wiki homepage
    audio.html  audio
      sadnoise.html  sadnoise
        shows.html  shows
    visual.html  visual
      pp.html  others portfolios
        mgb.html  Martin Baggarly
          anne.html  Anne Helm
```

Here `anne.html` is a sub-page of `mgb.html`, which is under `pp.html`, which is
under the `visual` category.

- **Labels.** The text after the file name is what shows in the sidebar. If you add
  `| a longer name`, the longer name is used on the sitemap only. That keeps the
  sidebar short:

  ```
  sfm.html  spaces for mediation | Spaces for Mediation, April 2023
  ```

- **Categories.** The pages directly under `index.html` are the top row of every
  sidebar (audio, textiles, architecture, visual, research, internal). Change their
  order in the file to change the order on the site.
- **Order.** Pages appear in the sidebar and sitemap in the order they are listed.
- **Headings.** A line starting with `:` puts a small heading on the sitemap only:

  ```
  : Thesis
  ```

- **Notes.** Lines starting with `#` are ignored.
- **Same page in two places.** List it normally where it belongs. In the other
  place, start the line with `= `. The page's own sidebar follows the normal line,
  and the `=` line just adds a link:

  ```
  research.html  research
    thesis.html  undergrad thesis
  arch.html  architecture
    = thesis.html  thesis research
  ```

- **Paths** are relative to the `wiki/` folder. Use `../` for pages on the main site
  (`../speakers.html`) and `folder/page.html` for pages in a subfolder. Anchors
  (`places.html#sac`) and other files (`oya.pdf`) are fine too. They show up as
  links, and the script doesn't edit them.

---

## Adding a new wiki page

1. Copy `wiki/_template.html` and rename it, for example `wiki/newthing.html`.
2. Fill in the title and content. Leave `<nav></nav>` empty; the script fills it in.
3. Add one line to `lexicon.txt`, indented under its parent:

   ```
       mgb.html  Martin Baggarly
         anne.html  Anne Helm
         newthing.html  new thing
   ```

4. Run `python3 wiki/build.py`.

The new page gets its sidebar. Martin Baggarly's sidebar and its sibling pages'
sidebars now link to it, and it shows up on the sitemap. You never open those
other files.

**Moving a page** means changing its indentation or moving its line. **Removing a
page** from the wiki means deleting its line. Then run the script.

---

## What the script checks

Each time it runs, the script prints:

- **Updated N page(s):** which files it changed. Running it twice in a row changes nothing.
- **Broken links:** any link on a wiki page to a file that doesn't exist.
- **Wiki pages not in lexicon.txt:** pages that get no sidebar and aren't on
  the sitemap. Some of these are on purpose, like old pages and saved copies of
  other sites. Add a line for any you want in the wiki.
- **WARNING ... listed twice:** a page listed twice without `=`.

If a line in `lexicon.txt` points to a file that doesn't exist, or it can't make
sense of a line, the script stops with an **ERROR** and changes nothing. Fix the
line it names and run it again.

`python3 wiki/build.py -v` also lists the pages that are in the lexicon but have
no `<nav>`.

---

## Rules the script follows (so nothing surprises you)

- It only replaces a plain `<nav>...</nav>` block, and only on pages that use
  `main.css`. A `<nav class="...">` is treated as the page's own menu and left
  alone. For example, `instsh.html` keeps its Sound Work / Shows jump links.
- Pages with no `<nav>` at all are left alone. Those are the pages with their own
  custom design, like `c.html` and `he.html`. They still appear in their parent's
  sidebar and on the sitemap.
- On `sitemap.html`, it only replaces what sits between
  `<!-- sitemap: generated by build.py ... -->` and `<!-- /sitemap -->`. Everything
  else on that page you can edit normally.
- **Don't hand-edit the sidebars or the sitemap tree.** The next run overwrites
  those edits. Change `lexicon.txt` instead.

### How the sidebar columns are chosen

- **First column:** always the categories. The one you're in is in *italics*.
- **If the page has sub-pages:** the page and its siblings (the page in
  *italics*), then its sub-pages.
- **If the page has no sub-pages:** its parent's level (the parent in
  *italics*), then the page and its siblings.

These match the hand-made sidebars the wiki already had.

---

## Requirements

Python 3, which is already on your Mac (`python3 --version` to check). The script
uses nothing else: no packages, no installs.
