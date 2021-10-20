import getConnection from '../database/getConnection.js';

export async function getAllBannedTracks(code) {
    if (id != null && code != null) {
        var conn = await getConnection();
        var queryString = `select * from NoPlayList where eventCode = '${code}'`;
        var result = await conn.query(queryString);
            if(result.recordset.length > 0)
                return result.recordset;
            else 
                return null;
    }
}

export async function banTrack(code, trackName, trackURI) {
    if (trackURI != null && code != null && trackName != null) {
        var conn = await getConnection();
        var queryString = `insert into NoPlayList (eventCode, trackName, trackURI) values ('${code}', '${trackName}', '${trackURI}')`;
        await conn.query(queryString);
    }
}

export async function unbanTrack(code, trackName, trackURI) {
    if (trackURI != null && code != null && trackName != null) {
        var conn = await getConnection();
        var queryString = `delete from NoPlayList where eventCode = ${eventCode} and trackURI = ${trackURI}`;
        await conn.query(queryString);
    }
}