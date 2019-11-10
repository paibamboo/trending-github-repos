const ghpages = require('gh-pages');

ghpages.publish('gh-pages', {
  repo: 'https://' + process.env.GH_TOKEN + '@github.com/paibamboo/trending-github-repos.git',
  silent: true
});
