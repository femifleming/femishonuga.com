# femishonuga.com
 website:re:birth

Editing the wiki: see [wiki/README.md](wiki/README.md). In short, edit `wiki/lexicon.txt`, run `python3 wiki/build.py`, then push.

## Folders

- Top level: the site's pages (`index.html`, `webring.html`, …) plus `favicon` and the webring badges, which other sites may link to directly.
- `images/`, `audio/`, `docs/` (PDFs), `fonts/`, `css/`, `js/`: files used by the top-level pages.
- `scripts/`: helper shell scripts. Run them from the site folder, e.g. `bash scripts/pics.sh`.
- `wiki/`: the wiki. Its pages sit in `wiki/`, with files in `wiki/links/`, `wiki/images/`, `wiki/files/` (PDFs, zips), `wiki/audio/` and `wiki/fonts/`.
- `archive/`: old pages and files nothing links to anymore, kept in their original folder layout (`archive/a.html` was `/a.html`). Still online at `femishonuga.com/archive/...`.
