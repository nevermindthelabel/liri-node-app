require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs")

// console.log(process.env.SPOTIFY_ID);
// console.log(process.env.SPOTIFY_SECRET);
// console.log(process.env.BANDS_IN_TOWN_API_KEY);
// console.log(process.env.OMDB_API_KEY);

var bands = keys.bandsintown.api_key;
var spotify = new Spotify(keys.spotify);
var omdb = keys.omdb.api_key;


// logic for taking the user input from the console

var firstUserInput = process.argv[2];
var secondUserInput = process.argv.slice(3).join(" ");
var logText = `\n${firstUserInput} ${secondUserInput}`

// logic for taking the user input and making sure it is correct, or outputting an error message if it is not.

if (firstUserInput === 'concert-this') {
    bandsInTown(secondUserInput);
} else if (firstUserInput === 'spotify-this-song') {
    spotifyThis(secondUserInput);
} else if (firstUserInput === 'movie-this') {
    movieThis(secondUserInput);
} else if (firstUserInput === 'do-what-it-says') {
    doThis(secondUserInput);
} else {
    return console.log('I\'m sorry, that is not a valid option. Please enter concert this, spotify-this-song, movie-this, or do-what-it-says.')
}

fs.appendFile('./log.txt', logText, function(error){
    if (error){
        console.log(error)
    } else{
        console.log('Search added to log!')
    }
})

// calls the Bands in Town API using Axios
function bandsInTown() {

    axios
        .get(
            "https://rest.bandsintown.com/artists/" + secondUserInput + "/events?app_id=" + bands)
        .then(function (response) {
            var artistName = response.data[0].lineup[0];
            var nameOfVenue = response.data[0].venue.name;
            var locationOfVenue = response.data[0].venue.city;
            // using momentjs to search for the time
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
// calls the spotify constructor.
function spotifyThis(searchTerm) {
    // sets a default song if the user doesn't enter one.
    if (!searchTerm) {
        searchTerm = 'The Sign', 'ace of base'
    }
    spotify
        .search({
            type: 'track',
            query: searchTerm
        }).then(function (response) {
            var data = response.tracks.items[0];
            var artist = data.artists[0].name;
            var preview = data.external_urls.spotify;
            var songName = data.name;
            var albumName = data.album.name;

            console.log(`The name of the Artist is: ${artist}`);
            console.log(`The Song title is : ${songName}`);
            console.log(`A preview of the song can be found here: ${preview}`);
            console.log(`The song came from the album named: ${albumName}`)
        })
        .catch(function (error) {
            console.log(error)
        })

}

// calls the omdb api to search for movies.
function movieThis(searchTerm) {
    // sets a default movie if the user doesn't search for one.
    if (!searchTerm) {
        return console.log("If you haven't watched Mr. Nobody, then you should: http://www.imdb.com/title/tt0485947/")
    }
    axios
        .get("https://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=" + omdb)
        .then(function (response) {
            console.log('                      ')
            console.log(`The title of your movie is ${response.data.Title}`);
            console.log('                      ')
            console.log('The movie came out in ' + response.data.Year);
            console.log('                      ');
            console.log('The IMDB rating is ' + response.data.Ratings[0].Value);
            console.log('                      ');
            console.log('The Rotten Tomatoes rating is ' + response.data.Ratings[1].Value);
            console.log('                      ');
            console.log('The movie was produced in ' + response.data.Country);
            console.log('                      ');
            console.log('The language of the movie is ' + response.data.Language);
            console.log('                      ');
            console.log('The movie\'s Plot is ' + response.data.Plot);
            console.log('                      ');
            console.log('The stars of the movie where ' + response.data.Actors);

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
// pulls the text from random.txt
function doThis() {
    fs.readFile('random.txt', 'utf8', function (error, data) {
        if (error) {
            return console.log(error)
        }
        console.log(data)
        var splitData = data.split(',')
       
        console.log('                            ')
        if (splitData[0] === 'spotify-this-song'){
            spotifyThis(splitData[1])
        } else if (splitData[0] === 'concert-this'){
            bandsInTown(splitData[1])
        } else if (splitData[0] === 'movie-this'){
            movieThis(splitData[1])
        } else {
            console.log('I\'m sorry, I do not know what you want')
        }
    })
}

