require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs")

console.log(process.env.SPOTIFY_ID);
console.log(process.env.SPOTIFY_SECRET);
console.log(process.env.BANDS_IN_TOWN_API_KEY);
console.log(process.env.OMDB_API_KEY);

var bands = keys.bandsintown.api_key;
var spotify = new Spotify(keys.spotify);
var omdb = keys.omdb.api_key;

var firstUserInput = process.argv[2];
var secondUserInput = process.argv.slice(3).join(" ");
console.log(secondUserInput)
// var join = secondUserInput.join(' ')

if (firstUserInput === 'concert-this') {
    bandsInTown(secondUserInput);
} else if (firstUserInput === 'spotify-this-song') {
    spotifyThis(secondUserInput);
} else if (firstUserInput === 'movie-this') {
    movieThis(secondUserInput);
} else if (firstUserInput === 'do-what-it-says') {
    doThis(secondUserInput);
}else {
    return console.log('I\'m sorry, that is not a valid option')
}



function bandsInTown() {

    axios
        .get(
            "https://rest.bandsintown.com/artists/" + secondUserInput +"/events?app_id=" + bands)
        .then(function (response) {
            var artistName = response.data[0].lineup[0];
            var nameOfVenue = response.data[0].venue.name;
            var locationOfVenue = response.data[0].venue.city;
            var eventDate = moment(response.data[0].datetime).format('MM/DD/YYYY hh:mm a');
            console.log('Name of the artist: ' + artistName);
            console.log('                        ');
            console.log('The name of the venue is: ' + nameOfVenue);
            console.log('                         ');
            console.log('The venue is located at: ' + locationOfVenue);
            console.log('                         ');
            console.log('The date of the the event is: ' + eventDate);

        })
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
            else if (error.request); {
                console.log(error.request);
            }
           
        })
    
}

function spotifyThis () {
   spotify
    .search({
        type: 'track',
        query: secondUserInput
    }).then(function(response){
        // console.log(response.tracks.items[0]);
        var data = response.tracks.items[0];
        var artist = data.artists[0].name;
        var preview = data.external_urls.spotify;
        var songName =  data.name;
        var albumName = data.album.name;
        // console.log(albumName)
        console.log(`The name of the Artist is: ${artist}`);
        console.log(`The Song title is : ${songName}`);
        console.log(`A preview of the song can be found here: ${preview}`);
        console.log(`The song came from the album named: ${albumName}`)
    })
   .catch(function(error){
       console.log(error)
   })
   
}
function movieThis(){
    axios
        .get("https://www.omdbapi.com/?t=" + secondUserInput + "&y=&plot=short&apikey=" + omdb)
        .then(function (response) {
            // console.log(response.data)
            console.log(response.data.Title);
            console.log('                      ')
            console.log(response.data.Year);
            console.log('                      ');
            console.log(response.data.Ratings[0].Value);
            console.log('                      ');
            console.log(response.data.Ratings[1].Value);
            console.log('                      ');
            console.log(response.data.Country);
            console.log('                      ');
            console.log(response.data.Language);
            console.log('                      ');
            console.log(response.data.Plot);
            console.log('                      ');
            console.log(response.data.Actors);
            if (secondUserInput === undefined && secondUserInput !== ''){
                console.log("If you haven't watched Mr. Nobody, then you should: http://www.imdb.com/title/tt0485947/")
            }
        })
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
            else if (error.request); {
                console.log(error.request);
            }
           
        })
    }
    
    