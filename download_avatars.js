var request = require('request');
var fs = require('fs');

var GITHUB_USER = "nanstey";
var GITHUB_TOKEN = "4718895ff83d86611ce77bf37daebd6f58792674";
var USR_AGENT = "Avatar Downloader";

function getRepoContributors(repoOwner, repoName, cb) {

  var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  console.log(requestURL);

  var options = {
    'url': requestURL,
    'headers': {
      'User-Agent': USR_AGENT
    }
  };
  request.get(options, function(err, response, body) {
    if (err) throw err;
    console.log('Response Status Code:', response.statusCode);
    var data = JSON.parse(body);

    for (var i in data){
      cb( data[i]['avatar_url'], 'avatars/' + data[i]['login'] );
    }
  });

}

function downloadImageByURL(url, filePath) {

  var type = '';
  request.get(url)
        .on('error', function (err) {
          throw err;
        })
        .on('response', function (response) {
          console.log('Response Status Code: ' + response.statusCode + ' ' + filePath );
          type = response.headers['content-type'].replace('/image\//', '');
        })
        .pipe(fs.createWriteStream(filePath + type))
        .on('finish', function() {
          console.log('Download complete: ' + filePath);
        });
}

var owner = process.argv[2];
var repo = process.argv[3];

if (owner && repo){
  getRepoContributors(owner, repo, downloadImageByURL);
} else {
  console.log('Please provide arguments: <owner> <repo>');
}
