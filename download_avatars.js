var request = require('request');
var GITHUB_USER = "nanstey";
var GITHUB_TOKEN = "4718895ff83d86611ce77bf37daebd6f58792674";


console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {

  var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';

  console.log(requestURL);
  var error = '';
  var result = '';
  request.get(requestURL);
        // .on('error', function (err) {
        //   error = err;
        //   console.log(err);
        // })
        // .on('response', function (response){
        //   result = response;
        //   // console.log(response);
        // })
        // .on('end', function(){
        //   cb(error, result);
        // });

}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});
