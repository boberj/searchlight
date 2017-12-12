#!/bin/bash
set -euo pipefail

git checkout gh-pages
git reset --hard master
npm run build
git add -f dist/
git commit -m "Site"
git push -f origin $(git subtree split --prefix dist):gh-pages
