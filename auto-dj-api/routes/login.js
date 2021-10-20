import express from 'express';
import querystring from 'querystring';
import configs from '../config.js';
//var querystring = require('querystring');
//var config = require('./config').configs;

//const router = express.Router();
function login(req, res) {
    var state = "blahblahstate";
    res.cookie(configs.stateKey, state);  
    // your application requests authorization
    var scope = 'user-read-private user-read-email '+
    'playlist-modify-public playlist-modify-private playlist-read-collaborative ' + 
    'user-read-playback-state user-modify-playback-state ' + 
    'user-read-currently-playing';

    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: configs.client_id,
        scope: scope,
        redirect_uri: configs.host_redirect_uri,
        state: state
      }));
};

export default login;