var dotEnv = require("dotenv").config();
var request = require('request');
var Twitter = require("twitter");
var keys = require("./keys.js");

var client = new Twitter(keys.twitter);

const TWEETS = 'my-tweets';
const SPOTIFY_THIS_SONG = 'spotify-this-song';
const MOVIE_THIS = 'movie this';
const DO_IT = 'do-what-it-says';

function getTweets() {
    var params = {screen_name: 'nodejs'};
    client.get('statuses/user_timeline', function(error, tweets, response) {
        if (!error) {
          console.log(JSON.stringify(tweets, null, 2));
        } else {
            console.log(error)
        }
      });
}


function argumentHandler() {
    var arguments = process.argv
        .splice(2, process.argv.length -2)

    switch(arguments) {
        case TWEETS:
            getTweets();
            break;
        case SPOTIFY_THIS_SONG:
            getSong(arguments.splice(1, arguments.length - 1));
            break;
        case MOVIE_THIS:
            getMovie(arguments.splice(1, arguments.length - 1));
            break;
        case DO_IT:
            randoFunction();
            break;
        default:
            console.log("Sorry I don't know this command.");
    }
}



argumentHandler();