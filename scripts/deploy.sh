#!/bin/bash

npm run build

git add -f dist

git commit . -m 'deploy commit'
git push heroku master --force
git reset --soft HEAD~1

git reset HEAD dist
