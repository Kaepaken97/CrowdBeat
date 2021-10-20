import request from 'request';
import {getToken} from '../tokens/tokenService.js';

export async function addToPlaylist(playlistId, trackURI, tokenName) {
    var options = {
      url: 'https://api.spotify.com/v1/playlists/' + playlistId + '/tracks?uris='+trackURI,
      headers: {
        'Authorization': 'Bearer ' + await getToken(tokenName),
      },
      json: true
    };
    var promise = new Promise(function(resolve, reject) {
        let callback = function (error, response, body) {
            if(error || (response.statusCode != 201 && response.statusCode != 200)) {
                reject(error);
            } else {
                resolve(null);
            }
        }
        request.post(options, callback);
    });
  
    return await promise;
  }

  export async function removeFromPlaylist(playlistId, trackURI, tokenName) {
    var options = {
      url: 'https://api.spotify.com/v1/playlists/' + playlistId + '/tracks',
      headers: {
        'Authorization': 'Bearer ' + await getToken(tokenName),
      },
      json: true,
      body:{
        tracks: [{uri: trackURI}]
      }
    };
    var promise = new Promise(function(resolve, reject) {
        let callback = function (error, response, body) {
            if(error || response.statusCode != 200) {
                reject(error);
            } else {
                resolve(null);
            }
        }
        request.delete(options, callback);
    });
  
    return await promise;
  }

  export async function moveTrack(playlistId, tokenName, rangeStart, insertBefore) {
    var options = {
      url: 'https://api.spotify.com/v1/playlists/' + playlistId + '/tracks',
      headers: {
          'Authorization': 'Bearer ' + await getToken(tokenName),
      },
      json: true,
      body: {
          "range_start": parseInt(rangeStart),
          "insert_before": parseInt(insertBefore),
          "range_length": 1
          }
      };
      console.log(options);
    var promise = new Promise(function(resolve, reject) {
        let callback = function (error, response, body) {
          if(!error && response.statusCode == 200){
            resolve(null);
          }
          else {
            reject(response.statusCode + ": " + response.statusMessage);
          }
        }
        request.put(options, callback);
    });
  
    return await promise.catch(reason => {
      console.log(reason);
    });
  }

  export async function replaceTracks(playlistId, uris, rangeStart) {
    var formattedURIs = uris.map(x => x.trackURI);
    console.log(formattedURIs);
    var options = {
      url: 'https://api.spotify.com/v1/playlists/' + playlistId + '/tracks?uris=' + formattedURIs,
      headers: {
          'Authorization': 'Bearer ' + await getToken("autoDJ_auth_token"),
      },
      json: true,
      body: {
          "range_start": parseInt(rangeStart),
          }
      };
      console.log(options);
    var promise = new Promise(function(resolve, reject) {
        let callback = function (error, response, body) {
          if(!error && (response.statusCode == 200 || response.statusCode == 201)){
            resolve({});
          }
          else {
            reject(response.statusCode + ": " + response.statusMessage);
          }
        }
        request.put(options, callback);
    });
  
    return await promise.catch(reason => {
      console.log(reason);
    });
  }