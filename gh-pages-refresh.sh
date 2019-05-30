#!/bin/bash

exit 0

# checkout latest
git fetch
git checkout gh-pages
git pull
git checkout --orphan gh-pages-temp

# cleanup
rm -rf node_modules
rm -rf coverage
rm -rf packages
rm -rf test

# add
git add -A
git commit -am "refresh history"

# danger, force new
git branch -D gh-pages
git branch -m gh-pages
git push -f origin gh-pages
