# liri-node-app
liri-node-app for Full Stack Web Development Boot Camp Homework

Use [https://nodejs.org](node.js) to write a CLI app that takes in user input on a concert (using the bands in town API), song (using the node-spotify-api), movie (using the OMDB API) or text from a file using the built-in node FS module.

There are defaults set for a song and movie if the user doesn't input a value in the search term part of the command line, and an error message that displays if they do not search for one of the correct terms.

The log.txt file records the searches of previous users from the command line.

To use the app, enter the following in the command line: node liri.js + movie-this || concert-this || spotify-this-song || do-what-it-says, followed by a movie, band or song title. The app will use the API's to pull down data to match your search and display it in the console. The do-what-it-says option will use the random.txt file to do a predetermined search for the user.