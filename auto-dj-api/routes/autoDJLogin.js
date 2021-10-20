import querystring from 'querystring';
import configs from '../config.js';

function autoDJLogin(req, res) {
    var state = "blahblahstatAutoDJCallback";
    res.cookie(configs.stateKey, state);
  
    // your application requests authorization
    var scope = 'user-read-private user-read-email '+
    'playlist-modify-public playlist-modify-private playlist-read-collaborative ';

    console.log({
      response_type: 'code',
      client_id: configs.client_id,
      scope: scope,
      redirect_uri: configs.participant_redirect_uri,
      state: state
    });
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: configs.client_id,
        scope: scope,
        redirect_uri: configs.participant_redirect_uri,
        state: state
      }));
};

export default autoDJLogin;