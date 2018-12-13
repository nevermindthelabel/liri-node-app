console.log("this is loaded");

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

exports.bandsintown = {
  api_key: process.env.BANDS_IN_TOWN_API_KEY
}

exports.omdb = {
  api_key: process.env.OMDB_API_KEY
}
