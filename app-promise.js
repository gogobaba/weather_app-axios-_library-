const yargs = require('yargs');
const axios = require('axios');

const argv = yargs.options({
      address:{
        demand:true,
        alias:'a',
        describe:'Address to fetch weather for',
        string:true
      }
}).default('address',"jaipur").help().alias('help','h').argv;


var encodedAddress = encodeURIComponent(argv.address) ;
var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyAdjebcTACxYhtQfCuruboR3cDN9tOq-T8` ;

axios.get(geocodeUrl).then((response)=>{
  if(response.data.status ==='ZERO_RESULTS'){
    throw new Error('Unable to find that address');
  }
  var lat = response.data.results[0].geometry.location.lat;
  var lng =  response.data.results[0].geometry.location.lat;
  var weatherUrl = `https://api.darksky.net/forecast/5a0141e31cb8b6008cf836cf1059fc89/${lat},${lng}` ;
     console.log(response.data.results[0].formatted_address);
    return axios.get(weatherUrl);
}).then((response)=>{
      var temperature = response.data.currently.temperature;
      var apparentTemperature = response.data.currently.apparentTemperature ;
      console.log(`summary:${response.data.currently.summary}`);
      console.log(`Its currently ${temperature}.It feels like ${apparentTemperature}`)
}).catch((e)=>{
  if(e.code === 'ENOTFOUND'){
    console.log('Unable to connect to API servers.');
  }else {
    console.log(e.message);
  }
});
