# Building and publishing the site

The site remains hand-authored HTML, CSS, JavaScript, and media. `build.sh` copies those files into `dist/` and generates link reports there. It preserves the hand-edited nested sitemap. For every built HTML page, it refreshes existing “updated” dates in footers from that file’s last change date; gallery-template `{LAST_UPDATE}` placeholders are preserved. Clean pages use the date of their latest Git change, while locally edited or untracked pages use their file modification date. Source stylesheets, JavaScript, incoming-link sections, and other footer content are left alone. The shell script uses the Perl included with macOS; Python and third-party packages are not needed.

## Build and preview on a Mac

Open Terminal and move into the site folder, then run:

```sh
cd ~/Desktop/femishonuga.com
sh build.sh
open dist/index.html
```

The build prints the output size. The generated reports are in `dist/reports/`; open `dist/reports/index.html` to browse them. The generated wiki sitemap is `dist/wiki/sitemap.html`.

The `dist/` folder is generated output and is excluded from Git. Edit the hand-made source pages and assets outside `dist/`, then run the build again.

## Publish with GitHub Pages

After reviewing the changes, use your usual commands to stage, commit, and push:

```sh
git status --short
git add . && git commit -am "Update site" && git push
```

Pushing to `main` starts the GitHub Actions workflow. It runs `sh build.sh` and deploys `dist/`; the build does not filter files or stop based on an estimated size. `/dist/` is ignored by Git, so `git add .` stages your sources and build files without staging the generated copy.
