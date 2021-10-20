import request from 'request';
import configs from '../config.js';
import {
    getToken, setToken, isExpired
} from '../tokens/tokenService.js';

var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
        grant_type: 'client_credentials'
    },
    headers: {
        'Authorization': 'Basic ' + (new Buffer(configs.client_id + ':' + configs.client_secret).toString('base64'))
    },
    json: true
};

async function clientCredentials(req, res, next) {

    if (await getToken("client_token") == null || await isExpired("client_token")) {
        request.post(authOptions, async function (error, response, body) {
            if (!error && response.statusCode === 200) {
                await setToken("client_token", body.access_token, body.expires_in);
            } else {
                await setToken("client_token");
                console.log(error);
            }
        });    
    }

    next();
}

export default clientCredentials;