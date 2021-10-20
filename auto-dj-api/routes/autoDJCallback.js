import request from 'request';
import querystring from 'querystring';
import configs from '../config.js';
import {setToken} from '../tokens/tokenService.js';

async function autoDJCallback(req, res) {
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[configs.stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(configs.stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: configs.participant_redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(configs.client_id + ':' + configs.client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, async function (error, response, body) {
      if (!error && response.statusCode === 200) {
        await setToken("autoDJ_auth_token", body.access_token, body.expires_in, body.refresh_token);
        //setToken("autoDJ_refresh_token", body.refresh_token, body.expires_in);
        res.redirect('/');
      } else {
        await setToken("autoDJ_auth_token");
        //setToken("autoDJ_refresh_token");
        res.redirect('/#' +
          querystring.stringify({
            error: 'authorization_error'
          }));
      }
    });
  }
}

export default autoDJCallback;