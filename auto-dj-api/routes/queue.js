import request from 'request';
import {getToken} from '../tokens/tokenService.js';
import querystring from 'querystring';
import { addToPlaylist, removeFromPlaylist } from '../services/queueService.js';
import { deleteFromEventTracks, insertEventTracksFromSpotify, sortEventTracks } from '../database/eventTracks.js';
import { getByCode, getEventByPlaylistID } from '../database/events.js';

export async function up(req, res) {
  var playlistId = req.params.playlistId;
  var trackPos = req.params.trackPos;
  var options = {
    url: 'https://api.spotify.com/v1/playlists/' + playlistId + '/tracks',
    headers: {
      'Authorization': 'Bearer ' + await getToken("auth_token"),
    },
    json: true,
    body: {
        "range_start": parseInt(trackPos),
        "insert_before": parseInt(trackPos) - 1,
        "range_length": 1
      }
  };

  // use the access token to access the Spotify Web API
  request.put(options, function (error, response, body) {
    if(!error && response.statusCode == 200){
        console.log("success!");
        res.json({});
    }
    else {
        console.log(response.statusCode, response.statusMessage);
        // res.redirect('/#' +
        // querystring.stringify({
        //   error: 'authorization_error'
        // }));
    }
  });
}

export async function down(req, res) {
    var playlistId = req.params.playlistId;
    var trackPos = req.params.trackPos;
    var options = {
      url: 'https://api.spotify.com/v1/playlists/' + playlistId + '/tracks',
      headers: {
        'Authorization': 'Bearer ' + await getToken("auth_token"),
      },
      json: true,
      body: {
          "range_start": parseInt(trackPos),
          "insert_before": parseInt(trackPos) + 2,
          "range_length": 1
        }
    };
  
    // use the access token to access the Spotify Web API
    request.put(options, function (error, response, body) {
      if(!error && response.statusCode == 200){
          console.log("success!");
          res.json({});
      }
      else {
          console.log(response.statusCode, response.statusMessage);
        //   res.redirect('/#' +
        //   querystring.stringify({
        //     error: 'authorization_error'
        //   }));
      }
    });
  }

  export async function add(req, res) {
    var playlistId = req.params.playlistId;
    var trackURI = req.params.trackURI;
    var result = await addToPlaylist(playlistId, trackURI, "autoDJ_auth_token");
    if(result == null) {
      var event = await getEventByPlaylistID(playlistId);
      if(event && event.eventCode) {
        await insertEventTracksFromSpotify(event.eventCode, playlistId);
      }
      res.json({});
    }
    else
      console.log(result);
  }

  export async function remove(req, res) {
    var playlistId = req.params.playlistId;
    var trackURI = req.params.trackURI;
    var result = await removeFromPlaylist(playlistId, trackURI, "autoDJ_auth_token");
    if(result == null) {
      var event = await getEventByPlaylistID(playlistId);
      if(event && event.eventCode) {
        await deleteFromEventTracks(event.eventCode, trackURI);
        await sortEventTracks(event.eventCode, playlistId);
      }
      res.json({});
    }
    else
      console.log(result);
  }