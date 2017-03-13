var request = require('request');
var GITHUB_USER = "nanstey";
var GITHUB_TOKEN = "4718895ff83d86611ce77bf37daebd6f58792674";
var USR_AGENT = "Avatar Downloader";

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {

  var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';

  console.log(requestURL);

  var options = {
    'url': requestURL,
    'headers': {
      'User-Agent': USR_AGENT
    }
  }
  request.get(options, function(err, response, body) {
    if (err) throw err;
    console.log('Response Status Code:', response.statusCode);
    var data = JSON.parse(body);

    for (var i in data){
      console.log( data[i]['avatar_url']);
    }
  });

}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});
