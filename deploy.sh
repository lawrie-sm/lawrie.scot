JEKYLL_ENV=production bundle exec jekyll build
rsync -azP --delete _site/ lawrie.scot:lawrie.scot
