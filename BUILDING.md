# Building and publishing the site

The site remains hand-authored HTML, CSS, JavaScript, and media. `build.sh` copies those files into `dist/` and generates the wiki sitemap and link reports there. It does not rewrite source stylesheets or JavaScript, and it leaves incoming-link sections and existing footers alone except to refresh an existing “updated” date in the built copy. Clean pages use the date of their latest Git change; locally edited pages use their file modification date. The shell script uses the Perl included with macOS for HTML and link processing; Python and third-party packages are not needed.

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
