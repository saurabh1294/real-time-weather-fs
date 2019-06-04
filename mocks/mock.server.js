const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const request = require('request-promise');

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

const DARK_SKY_API_KEY = 'YOUR-DARK-SKY-API-KEY';
const OPEN_CAGE_API_KEY = 'YOUR-OPEN-CAGE-API-KEY';
const latLongBaseURL = 'https://api.opencagedata.com/geocode/v1/json';
const darkSkyBaseURL = 'https://api.darksky.net/forecast/';


const weeks = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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

app.post('/weather/:location', function(req, res) {
    console.log(req.body, req.path, 'sending all week weather data for location');
    fireRequest(req, res);
});

app.post('/weather/:location/today', function(req, res) {
    console.log(req.body, req.path, 'sending weather data for today');
    fireRequest(req, res);
});

app.post('/weather/:location/:weekday', function(req, res) {
    console.log(req.body, req.path, 'sending weather data for weekday');
    fireRequest(req, res, true);
});

const server = app.listen(3456, function() {
    console.log("[mock] mock server listening on port %s...", server.address().port);
});

/**
 * @method			getObject
 * @description		[searches for a key recursively and returns it if it's value matches passed param value]
 * @param  			{object} JSON object to search
 * @param 			{string} key to search for in JSON by RegEx
 * @return 			{object} matched json value by key. NULL if key not found.
 */
const getObject = function(theObject, key) {
    var result = null;
    if (theObject instanceof Array) {
        for (var i = 0; i < theObject.length; i++) {
            result = getObject(theObject[i], key);
            if (result) {
                break;
            }
        }
    } else {
        for (var prop in theObject) {
            if (prop == key) {
                return theObject[prop];
            }
            if (theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
                result = getObject(theObject[prop], key);
                if (result) {
                    break;
                }
            }
        }
    }
    return result;
}

const fireRequest = function(req, res, weekday = null) {
    const data = req && req.body && req.body.latLong;
    const day = (weekday) ? req && req.body && req.body.day : 'Today';
    const darkSkyURL = `${darkSkyBaseURL}${DARK_SKY_API_KEY}/${data.latLong.lat},${data.latLong.lng}`;
    console.log(darkSkyURL, 'URL');
    // makeRequest(darkSkyURL)
    //     .then((data) => {
    //         res.send(data);
    //     })
    // 	.catch((err) => console.error(err));
    request.get({ url: darkSkyURL,
    gzip: true },
        function(error, response, body) {
        if (error) {
            res.send({error : error});
        }
        body = JSON.parse(body); // Now I'm a JSON object
        res.json(body.daily); // converts and sends JSON
    });
}

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