// ================================== //
//      Download Github Avatars       //
// ================================== //

// USAGE:
//    'node download_avatars.js <Owner> <Repo>'
//    Where <Owner> is a GitHub username, and <Repo> is an existing public repository
//
// EXPECTED RESULT:
//    There should be a folder called 'avatars' in the working directory
//    It will be populated with avatars for all contributors to the repo

// ================================== //
//        CONSTANTS & MODULES         //
// ================================== //

// require `dotenv` for security, `request` for http, `fs` (filesystem), & `mkdirp` for creating directory
require('dotenv').config();
var request = require('request');
var fs = require('fs');
var mkdirp = require('mkdirp');

// GitHub username, token & application User-Agent
var GITHUB_USER = process.env.GH_USR;
var GITHUB_TOKEN = process.env.GH_TOK;
var USR_AGENT = "Avatar Downloader";

// ================================== //
//              FUNCTIONS             //
// ================================== //

// getRepoContributors()
//    Requests contributors endpoint from GitHub API
//    Gets response body and passes data into callback

function getRepoContributors(repoOwner, repoName, cb) {
  // Create Request URL and Request Options
  var requestURL = 'https://' + GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  var options = {
    'url': requestURL,
    'headers': {
      'User-Agent': USR_AGENT
    }
  };

  // GET request
  request.get(options, function(err, response, body) {
    if (err){
      throw err;
    }
    // Log request and respnse status
    console.log('Requesting /repos/' + repoOwner + '/' + repoName + '/contributors ...');
    console.log('Response Status Code:', response.statusCode, '\n');

    // Check status code
    if (response.statusCode === 200){
      // Response OK!
      var data = JSON.parse(body);
      // Callback with data
      cb(data);
    } else {
      // Response NOT OK :(
      console.log('Something went wrong ... check that your arguments are valid.');
    }
  });
}

// downloadImageByURL()
//    Creates GET request for a given image url
//    Saves image into given filepath

function downloadImageByURL(url, filePath) {
  var type = '';

  request.get(url)
        .on('error', function (err) {
          throw err;
        })
        .on('response', function (response) {
          // Log response code + filepath & get image type
          console.log('Response Status Code: ' + response.statusCode + ' ' + filePath );
          type = response.headers['content-type'].replace('/image\//', '');
        })
        .pipe( fs.createWriteStream(filePath + type) )
        .on('finish', function() {
          // Log when download complete
          console.log('Download complete: ' + filePath);
        });
}

// downloadContributorImages()
//    Traverses contributors JSON data
//    Downloads each image into avatars/ directory

function downloadContributorImages(data) {
  // Create avatars directory if it doesn't exist
  mkdirp('avatars/', function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log('Created avatars/ directory ...');
    }
  });

  for (var i in data){
    downloadImageByURL( data[i]['avatar_url'], 'avatars/' + data[i]['login'] );
  }
}

// ================================== //
//         PROGRAM INVOCATION         //
// ================================== //

var owner = process.argv[2];
var repo = process.argv[3];

if (owner && repo){
  getRepoContributors(owner, repo, downloadContributorImages);
} else {
  console.log('Please provide arguments: <owner> <repo>');
}