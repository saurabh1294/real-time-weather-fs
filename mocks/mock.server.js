const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const NodeGeocoder = require('node-geocoder');

let originsWhitelist = [
    'http://localhost:4200'
	// add more whitelisted URLs here comma separated
];
let corsOptions = {
    origin: function(origin, callback) {
        let isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
    },
    credentials: true
}

const DARK_SKY_API_KEY = '<YOUR-DARK-SKY-API-KEY>';
const GOOGLE_MAPS_API_KEY = '<YOUR-GOOGLE-MAPS-API-KEY>';
const OPEN_CAGE_API_KEY = '<YOUR-OPEN-CAGE-API-KEY>';
const latLongBaseURL = 'https://api.opencagedata.com/geocode/v1/json';
const darkSkyBaseURL = 'https://api.darksky.net/forecast/';


let options = {
    provider: 'google',
    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: GOOGLE_MAPS_API_KEY, // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
  };
let geocoder = NodeGeocoder(options);


// whitelist domains for CORS/CORB
app.use(cors(corsOptions));

app.use((req, res, next) => {
    console.log('[mock] requested URL:', req.url);
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/getLatLong/', function(req, res) {
    // TODO implement service
    console.log('req', req.query);
    const location = req && req.query && req.query.q;
    const latLongURL = `${latLongBaseURL}?q=${location}&key=${OPEN_CAGE_API_KEY}&pretty=1&no_annotations=1`;

    makeRequest(latLongURL)
		.then((data) => res.send(data))
		.catch((err) => console.error(err));
});

app.post('/weather', function(req, res) {
    const data = req && req.body && req.body.latLong;
    const latLong = `${data.lat},${data.lng}`;
    const darkSkyURL = `${darkSkyBaseURL}${DARK_SKY_API_KEY}/${latLong}`;
    console.log(darkSkyURL, 'URL');
    makeRequest(darkSkyURL)
		.then((data) => res.send(data))
		.catch((err) => console.error(err));
});

app.post('/weather/:location', function(req, res) {
    console.log(req.body, req.path, 'location');
});

app.post('/weather/:location/:weekday', function(req, res) {
    console.log(req.body, req.path, 'weekday');
});

app.post('/weather/:location/today', function(req, res) {
    console.log(req.body, req.path, 'today');
});

const server = app.listen(3456, function() {
    console.log("[mock] mock server listening on port %s...", server.address().port);
});

const makeRequest = function(url) {
	// return new pending promise
	return new Promise((resolve, reject) => {
		// select http or https module, depending on reqested url
		const lib = url.startsWith('https') ? require('https') : require('http');
		const request = lib.get(url, (response) => {
			// handle http errors
			if (response.statusCode < 200 || response.statusCode > 299) {
				reject(new Error('Failed to load page, status code: ' + response.statusCode));
			}
			// temporary data holder
			const body = [];
			// on every content chunk, push it to the data array
			response.on('data', (chunk) => body.push(chunk));
			// we are done, resolve promise with those joined chunks
			response.on('end', () => resolve(body.join('')));
		});
		// handle connection errors of the request
		request.on('error', (err) => reject(err))
	})
};