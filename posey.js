require("dotenv").config();
const keys = require(`./keys`)
const inquirer = require("inquirer");
var request = require('request');
var Spotify = require('node-spotify-api');
const moment = require('moment');
const spotify = new Spotify(keys.spotify);

inquirer
    .prompt([
        {
            type: 'list',
            message: `\nWelcome, I'm Posey, What would you like to search?`,
            choices: ['Spotify', 'Concerts', 'Movies',],
            name: 'initChoice'
        }
    ])
    .then(function (initAPIResponse) {
        if (initAPIResponse.initChoice == 'Spotify') {
            SongSearch();
        }
        if (initAPIResponse.initChoice == 'Concerts') {
            ConcertSearch();
        }
        if (initAPIResponse.initChoice == 'Movies') {
            MovieSearch();
        }

    });

function MovieSearch() {
    inquirer
                .prompt([
                    {
                        type: "input",
                        message: 'What movie would you like to search?',
                        name: "movie"
                    },
                ])
                .then(function (MovieResponse) {
                    var queryURL = "https://www.omdbapi.com/?t=" + MovieResponse.movie + "&y=&plot=short&apikey=trilogy";
                    request(queryURL, function (err, response, body) {
                        if (err) {
                            return console.log(`Error occured: ${err}`);
                        }
                        if (MovieResponse.movie.length == '') {
                            var queryURL = "https://www.omdbapi.com/?t=Jaws&y=&plot=short&apikey=trilogy";
                        }
                        console.log(`\nTitle: ${JSON.parse(body).Title}\nReleased: ${JSON.parse(body).Released}\nIMDb Rating: ${JSON.parse(body).imdbRating}\nRotten Tomatoes: ${JSON.parse(body).Ratings[1].Value}\nCountry: ${JSON.parse(body).Country}\nLanguage: ${JSON.parse(body).Language}\nPlot: ${JSON.parse(body).Plot}\nMain Actors: ${JSON.parse(body).Actors}\n`)
                    });
                });
};
function ConcertSearch() {
    inquirer
                .prompt([
                    {
                        type: "input",
                        message: 'What Artist/Band would you like to search?',
                        name: "concert"
                    },
                ])
                .then(function (concertResponse) {
                    var queryURL = `https://rest.bandsintown.com/artists/${concertResponse.concert}/events?app_id=codingbootcamp`;
                    request(queryURL, function (err, response, body) {
                        if (err) {
                            return console.log(`Error occured: ${err}`);
                        }
                        const searchResponse = JSON.parse(body);
                        console.log(`Next Concert:\nName of Venue: ${searchResponse[0].venue.name}\nLocation: ${searchResponse[0].venue.city}, ${searchResponse[0].venue.region}\nCountry: ${searchResponse[0].venue.country}\nDate: ${moment(searchResponse[0].datetime).format('DD/MM/YYYY')}`)
                    });
                });
};
function SongSearch() {
    inquirer
                .prompt([
                    {
                        type: "input",
                        message: 'What song would you like to search?',
                        name: "song"
                    },
                ])
                .then(function (SongResponse) {
                    spotify.search({ type: 'track', query: `${SongResponse.song}` }, function(err, data) {
                        if (err) {
                            return console.log(`Error occured: ${err}`);
                        }
                        const spotifyResponse = data.tracks.items;
                        console.log(`\nTitle: ${spotifyResponse[0].name}\nArtist: ${spotifyResponse[0].artists[0].name}\nURL: ${spotifyResponse[0].preview_url}\nAlbum: ${spotifyResponse[0].album.name}\n`)
                    });
                });
};
