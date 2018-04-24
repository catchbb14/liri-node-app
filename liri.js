var dotEnv = require("dotenv").config();
var request = require('request');
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');
var fs = require("fs");
var keys = require("./keys.js");

var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);
var omdbKey = keys.omdb.key;



const TWEETS = 'my-tweets';
const SPOTIFY_THIS_SONG = 'spotify-this-song';
const MOVIE_THIS = 'movie-this';
const DO_IT = 'do-what-it-says';

function getTweets() {
    var params = {screen_name: 'nodejs'};
    client.get('statuses/user_timeline', function(error, data, response) {
        if (!error) {
          var tweets = data;
          if(tweets.length > 20) {
              tweets.splice(20, tweets.length-20)
          }
          tweets.forEach(element => {
              console.log("Tweet text: " + element.text);
              console.log("Created at: " + element.created_at + "\n");
          });
        } else {
            console.log(error)
        }
      });
}

function getSong(song_title) {
    var title = song_title.join(" ");
    if(title === "") {
        title = "The Sign Ace of Base"
    }
    
    spotify.search({ type: 'track', query: title }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
    }
        var song_info = data.tracks.items[0];
        console.log("Artists: " + song_info.artists[0].name);
        console.log("Title: " + song_info.name);
        console.log("Preview: " + song_info.external_urls.spotify);
        console.log("Album: " + song_info.album.name); 
    
    });

}

function getMovie(movie_title) {
    var title = movie_title.join("+");
    if(title === "") {
        title = "Mr Nobody"
    }
    var queryURL = `https://www.omdbapi.com/?t=${title}&y=&plot=short&apikey=${omdbKey}`;

    
    request(queryURL, function(error, response, body) {
        
        if(!error && response.statusCode === 200) {
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Year released: " + JSON.parse(body).Year)
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating)
            console.log("Rotten Tomatoes Rating: " + (JSON.parse(body).Ratings).find( rating => rating.Source === 'Rotten Tomatoes').Value);
            console.log("Language: " + JSON.parse(body).Language)
            console.log("Plot: " + JSON.parse(body).Plot)
            console.log("Actors: " + JSON.parse(body).Actors)
        }
    
    })

}

function doIt() {
    fs.readFile("random.txt", "utf-8", function(error, data) {
        if(error) {
            console.log(error)
        }

        argumentHandler(data.split(','));
    })
}


function argumentHandler(args) {
    var arguments = args;
    
    switch(arguments[0]) {
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
            doIt();
            break;
        default:
            console.log("Sorry I don't know this command.");
    }
}


var arguments = process.argv
        .splice(2, process.argv.length -2)

argumentHandler(arguments);