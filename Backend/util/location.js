// const axios = require("axios");
// const HttpError = require("../models/http-error");

// const API_KEY = process.env.GOOGLE_API_KEY;

async function getCoordsForAddress(address) {
  return {
    lat: 21.8372814,
    lng: 73.7184505,
  };

//   const response = await axios.get(
//     `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
//       address
//     )}&key=${API_KEY}`
//   );

//   const data = response.data;

//   if(!data || data.status === 'ZERO_RESULTS'){
//     return next(new HttpError("Could not Find Location for particular Location !", 422));
//   }

//   const coordinates = data.results[0].geometry.location;

//   return coordinates;
};

module.exports = getCoordsForAddress;
