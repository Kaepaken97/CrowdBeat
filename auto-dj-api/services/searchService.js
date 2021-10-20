import request from 'request';
import {getToken} from '../tokens/tokenService.js';

export async function searchForTracks(searchValue) {
    var tempSearchValue = "" + searchValue.replace(/ /g, "%20")
    .replace("(", "%28")
    .replace(")", "%29")
    .replace("!", "%21")
    .replace(".", "%2E")
    .replace("?", "%3F");
    var queryParams = "q=" + tempSearchValue + "&type=track,artist";
    var optionsTracks = {
        url: 'https://api.spotify.com/v1/search?'+queryParams,
        headers: {
            'Authorization': 'Bearer ' + await getToken("client_token"),
        },
        json: true
    };

    var promise = new Promise(function(resolve, reject) {
        let callback = function(error, response, body){
            if(error) {
                reject(null);
            }
            else {
                var tracks = [];
                if(body && body.tracks && body.tracks.items) {
                var data_tracks = body.tracks.items;
                if(data_tracks.length > 0)
                    {
                        data_tracks.forEach(y => {
                            var track = {
                              trackURI: y.uri,
                              title: y.name,
                              artist: y.artists[0].name
                            };
                            tracks.push(track);
                          });
                    }
            }
            resolve(tracks);
            }
        }
        request.get(optionsTracks, callback);
    })
  return await promise;
}