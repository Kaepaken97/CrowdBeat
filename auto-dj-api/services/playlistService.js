import request from 'request';
import {getToken} from '../tokens/tokenService.js';
import { getAllVotesByCode } from '../database/eventParticipantVoting.js';
import configs from '../config.js';
import { getAllEventTracks } from '../database/eventTracks.js';

export async function createPlaylist(playlistName) {
  var optionsPlaylists = {
    url: 'https://api.spotify.com/v1/users/' + configs.autoDJ_spotify_id + '/playlists',
    headers: {
      'Authorization': 'Bearer ' + await getToken("autoDJ_auth_token"),
    },
    json: true,
    body: {
      "name": playlistName,
      "description": "This playlist is created by Auto DJ for the event: " + playlistName
      }
  };
  var promise = new Promise(function(resolve, reject) {
      let callback = function (error, response, body) {
          if(error || (response.statusCode != 200 && response.statusCode != 201)) {
            if(error)
              reject(error);
            else
              reject(response.body);
          } else {
              resolve(body.id);
          }
      }
      request.post(optionsPlaylists, callback);
  });

  return await promise.catch(err => console.log(err));
}

export async function copyFromXToY(from, to) {
  var tracksToAdd = await getTracksFromSpotify(from);
  var tracksToAddURIs = tracksToAdd.map(x => x.uri);
  var optionsPlaylists = {
    url: 'https://api.spotify.com/v1/playlists/' + to + '/tracks',
    headers: {
      'Authorization': 'Bearer ' + await getToken("autoDJ_auth_token"),
    },
    json: true,
    body: {
      uris: tracksToAddURIs
    }
  };
  var promise = new Promise(function(resolve, reject) {
      let callback = function (error, response, body) {
          if(error || response.statusCode != 201) {
              reject(null);
          } else {
              resolve({});
          }
      }
      request.post(optionsPlaylists, callback);
  });

  return await promise;
}

export async function getPlaylists() {
  var optionsPlaylists = {
    url: 'https://api.spotify.com/v1/me/playlists',
    headers: {
      'Authorization': 'Bearer ' + await getToken("auth_token"),
    },
    json: true
  };
  var promise = new Promise(function(resolve, reject) {
      let callback = function (error, response, body) {
          if(error) {
              reject(null);
          } else {
            var data = body.items;
            var playlists = [];
            if(data && data.length > 0)
              data.forEach(y => {
                var p = {
                  href: y.href,
                  id: y.id,
                  images: y.images,
                  name: y.name,
                  tracks_link: y.tracks.href,
                  songs: []
                };
                playlists.push(p);
              });
            resolve(playlists);
          }
      }
      request.get(optionsPlaylists, callback);
  });

  return await promise;
}

export async function getPlaylistByID(id) {
  var optionsPlaylists = {
    url: 'https://api.spotify.com/v1/playlists/' + id,
    headers: {
      'Authorization': 'Bearer ' + await getToken("client_token"),
    },
    json: true
  };
  var promise = new Promise(function(resolve, reject) {
      let callback = function (error, response, body) {
          if(error) {
              reject(null);
          } else {
            var playlist = {
              href: body.href,
              id: body.id,
              images: body.images,
              name: body.name,
              tracks_link: body.tracks ? body.tracks.href : "",
              songs: []
            };
            resolve(playlist);
          }
      };
      request.get(optionsPlaylists, callback);
  });

  return await promise.catch(err => console.log(err));
}

export async function getTracks(eventCode, playlistID) {
  return await getAllEventTracks(eventCode);
}

export async function getTracksFromSpotify(id) {
  var optionsTracks = {
    url: 'https://api.spotify.com/v1/playlists/' + id + '/tracks',
    headers: {
      'Authorization': 'Bearer ' + await getToken("client_token"),
    },
    json: true
  };
  var promise = new Promise(function(resolve, reject) {
      let callback = function (error, response, body) {
          if(error || response.statusCode != 200) {
              reject(null);
          } else {
            var tracks = [];
            var data = body.items;
            var i = 0;
            if(data && data.length > 0)
              data.forEach(y => {
                var track = {
                  uri: y.track.uri,
                  trackNumber: i,
                  title: y.track.name,
                  artist: y.track.artists[0].name
              };
              i++;
              tracks.push(track);
            });
            resolve(tracks);
          }
      };
      request.get(optionsTracks, callback);
  });

  return await promise;
}