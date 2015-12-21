#!/bin/bash

DATABASE_URL="$(heroku config | sed -n 's/^DATABASE_URL: \(postgres.*\)/\1/p')?ssl=true" $(npm bin)/db-migrate -e prod up

exit

npm run build

git add -f dist

git commit . -m 'deploy commit'
git push heroku master --force
git reset --soft HEAD~1

git reset HEAD dist
