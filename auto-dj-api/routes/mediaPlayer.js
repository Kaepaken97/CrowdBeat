import request from 'request';
import { isTrackInEventTracks, updateCurrentlyPlaying } from '../database/eventTracks.js';
import {getToken} from '../tokens/tokenService.js';

export async function getDevices(req, res) {
  var options = {
    url: 'https://api.spotify.com/v1/me/player/devices',
    headers: {
      'Authorization': 'Bearer ' + await getToken("auth_token"),
    },
    json: true,
  };

  // use the access token to access the Spotify Web API
  request.get(options, function (error, response, body) {
    if(!error && response.statusCode == 200){
        console.log("success!");
        console.log(body);
        res.json(body.devices);
    }
    else {
        console.log(response.statusCode, response.statusMessage);
    }
  });
}

export async function transferPlayback(req, res) {
    var options = {
      url: 'https://api.spotify.com/v1/me/player',
      headers: {
        'Authorization': 'Bearer ' + await getToken("auth_token"),
      },
      json: true,
      body: {
        device_ids:[req.params.id],
        play: true
      }
    };
  
    // use the access token to access the Spotify Web API
    request.put(options, function (error, response, body) {
      if(!error && (response.statusCode == 200 || response.statusCode == 204)){
          console.log("transferPlayback success!", options);
          res.sendStatus(200);
      }
      else {
          console.log(response.statusCode, response.statusMessage);
          res.sendStatus(response.statusCode);
      }
    });
  }

  export async function play(req, res) {
    var body = {};
    if(req.params.id != undefined && req.params.id != null) {
      body = {
        "context_uri": "spotify:user:spotify:playlist:" + req.params.id,
        "offset": {
          "position": 0
        },
        "position_ms": 0
      };
    }

    var options = {
      url: 'https://api.spotify.com/v1/me/player/play',
      headers: {
        'Authorization': 'Bearer ' + await getToken("auth_token"),
      },
      json: true,
      body: body
    };
  
    // use the access token to access the Spotify Web API
    request.put(options, function (error, response, body) {
      if(!error && (response.statusCode == 200 || response.statusCode == 204)){
          console.log("play success!", options);
          res.sendStatus(200);
      }
      else {
          console.log(response.statusCode, response.statusMessage);
          res.sendStatus(response.statusCode);
      }
    });
  }

  export async function pause(req, res) {
    var options = {
      url: 'https://api.spotify.com/v1/me/player/pause',
      headers: {
        'Authorization': 'Bearer ' + await getToken("auth_token"),
      },
      json: true
    };
  
    // use the access token to access the Spotify Web API
    request.put(options, function (error, response, body) {
      if(!error && (response.statusCode == 200 || response.statusCode == 204)){
          console.log("pause success!", options);
          res.sendStatus(200);
      }
      else {
          console.log(response.statusCode, response.statusMessage);
          res.sendStatus(response.statusCode);
      }
    });
  }

  export async function updateVolume(req, res) {
    var options = {
      url: 'https://api.spotify.com/v1/me/player/volume?volume_percent=' + req.params.volume,
      headers: {
        'Authorization': 'Bearer ' + await getToken("auth_token"),
      },
      json: true
    };
  
    // use the access token to access the Spotify Web API
    request.put(options, function (error, response, body) {
      if(!error && (response.statusCode == 200 || response.statusCode == 204)){
          console.log("volume success!", options);
          res.sendStatus(200);
      }
      else {
          console.log(response.statusCode, response.statusMessage);
          res.sendStatus(response.statusCode);
      }
    });
  }

  export async function nextTrack(req, res) {
    var options = {
      url: 'https://api.spotify.com/v1/me/player/next',
      headers: {
        'Authorization': 'Bearer ' + await getToken("auth_token"),
      },
      json: true
    };
  
    // use the access token to access the Spotify Web API
    request.post(options, function (error, response, body) {
      if(!error && (response.statusCode == 200 || response.statusCode == 204)){
          console.log("next track success!", options);
          res.sendStatus(200);
      }
      else {
          console.log(response.statusCode, response.statusMessage);
          res.sendStatus(response.statusCode);
      }
    });
  }

  export async function previousTrack(req, res) {
    var options = {
      url: 'https://api.spotify.com/v1/me/player/previous',
      headers: {
        'Authorization': 'Bearer ' + await getToken("auth_token"),
      },
      json: true
    };
  
    // use the access token to access the Spotify Web API
    request.post(options, function (error, response, body) {
      if(!error && (response.statusCode == 200 || response.statusCode == 204)){
          console.log("next track success!", options);
          res.sendStatus(200);
      }
      else {
          console.log(response.statusCode, response.statusMessage);
          res.sendStatus(response.statusCode);
      }
    });
  }

  export async function getCurrentlyPlayingTrack(req, res) {
    var eventCode = req.params.eventCode;
    var options = {
      url: 'https://api.spotify.com/v1/me/player/currently-playing',
      headers: {
        'Authorization': 'Bearer ' + await getToken("auth_token"),
      },
      json: true,
    };
  
    // use the access token to access the Spotify Web API
    request.get(options, async function (error, response, body) {
      if(!error && response.statusCode == 200){
          console.log("get current track success!");
          console.log(body);
          var isTrackInEvent = await isTrackInEventTracks(eventCode, body.item.uri);
          if(isTrackInEvent) {
            await updateCurrentlyPlaying(eventCode, body.item.uri);
            res.json({
              uri: body.item.uri,
              title: body.item.name,
              artist: body.item.artists[0].name,
              isPlaying: body.is_playing,
              images: body.item.album.images,
              durationMS: body.item.duration_ms,
              progressMS: body.progress_ms
            });
          }
      }
      else {
          console.log(response.statusCode, response.statusMessage);
      }
    });
  }