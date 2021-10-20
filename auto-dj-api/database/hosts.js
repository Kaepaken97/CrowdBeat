import getConnection from './getConnection.js';
import request from 'request';
import {getToken} from '../tokens/tokenService.js';

export async function getActiveHost() {
    var optionsPlaylists = {
        url: 'https://api.spotify.com/v1/me',
        headers: {
          'Authorization': 'Bearer ' + await getToken("auth_token"),
        },
        json: true
    };
    var promise = new Promise(function(resolve, reject) {
        let callback = function (error, response, body) {
            if(error) {
                reject(error);
            } else {
                resolve({displayName: body.display_name, id: body.id});
            }
        };

        // use the access token to access the Spotify Web API
        request.get(optionsPlaylists, callback);
    });

    return await promise;
}

async function checkForHostID() {
    var conn = await getConnection();
    var host = await getActiveHost();
    if(host != null) {
        console.log("HOST: ", host);
        var queryString = `select hostID from Users where spotifyUserName = '${host.displayName}'`;
    

        var result = await conn.request().query(queryString)
            if(result.recordset.length > 0)
                return result.recordset[0];
            else 
                return null;
    }
    return null;
}

export async function addHostID() {
    var hostID = await checkForHostID();
    var user = await getActiveHost();
    var conn = await getConnection();
    if (hostID == null) {
        try {
            var queryString = `insert into Users (hostID, spotifyUserName) values ('${user.id}', '${user.displayName}')`;
            var result = await conn.request().query(queryString);
            if(result.recordset && result.recordset.length > 0)
                return result.recordset[0];
            else 
                return null;
        }
        catch (ex){
            console.log(ex);
        }
    }
    return hostID;
}

export async function getById(id) {
    if (id == null) {
        var conn = await getConnection();
        var queryString = `select * from Users where hostID = '${id}'`;
        conn.query(queryString, (err, result) => {
            if(result.recordset.length > 0)
                return result.recordset[0];
            else 
                return null;
        });
    }
}

export async function deleteById(id) {
    if (id == null) {
        var conn = await getConnection();
        var queryString = `delete from Users where hostID = '${id}'`;
        conn.query(queryString);
    }
}