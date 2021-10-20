import getConnection from '../database/getConnection.js';
import { getByCode } from './events.js';
import { getTracks } from '../services/playlistService.js';
import { moveTrack, addToPlaylist } from '../services/queueService.js';
import { sortEventTracks } from './eventTracks.js';

export async function getAllVotesByCode(eventCode, trackURI) {
    if (eventCode != null && trackURI != null) {
        var conn = await getConnection();
        var queryString = `select count(*) as x from EventParticipantVoting where eventCode = '${eventCode}' and trackURI = '${trackURI}' and addedByUser = 0`;
        var result = await conn.query(queryString);
            if(result.recordset.length > 0)
                return result.recordset[0].x;
            else 
                return null;
    }
}

export async function getAllAddedByCode(eventCode) {
    if (eventCode != null) {
        var conn = await getConnection();
        var queryString = `select * from EventParticipantVoting where eventCode = '${eventCode}' and addedByUser = 1`;
        var result = await conn.query(queryString);
            if(result.recordset.length > 0)
                return result.recordset;
            else 
                return null;
    }
}

//TODO - how is this different from istrackadded in EventTracks
export async function isTrackAlreadyAdded(eventCode, playlistID, trackURI) {
    if (eventCode != null && playlistID != null && trackURI != null) {
        var tracks = await getTracks(eventCode, playlistID);
        var isTrackInPlaylist = tracks.filter(x => x.uri == trackURI).length > 0;
        if(isTrackInPlaylist)
            return true;

        var conn = await getConnection();
        var queryString = `select * from EventParticipantVoting where eventCode = '${eventCode}' and trackURI = '${trackURI}' and addedByUser = 1`;
        var result = await conn.query(queryString);
            if(result.recordset.length > 0)
                return true;
            else 
                return false;
    }
}

export async function getAllVotedBy(code, id) {
    if (id != null && code != null) {
        var conn = await getConnection();
        var queryString = `select * from EventParticipantVoting where eventCode = '${code}' and userCookie = '${id}' and addedByUser = 0`;
        var result = await conn.query(queryString);
            if(result.recordset.length > 0)
                return result.recordset;
            else 
                return [];
    }
}

export async function getAllAddedBy(code, id) {
    if (id != null && code != null) {
        var conn = await getConnection();
        var queryString = `select * from EventParticipantVoting where eventCode = '${code}' and userCookie = '${id}' and addedByUser = 1`;
        var result = await conn.query(queryString);
            if(result.recordset.length > 0)
                return result.recordset;
            else 
                return null;
    }
}

export async function unvoteTrack(code, id, trackUri) {
    if (id != null && code != null && trackUri != null) {
        var conn = await getConnection();
        var queryString = `delete from EventParticipantVoting where eventCode = '${code}' and userCookie = '${id}' and trackURI = '${trackUri}'`;
        var result = await conn.query(queryString);
        var event = await getByCode(code);
        var playlistID = event.playlistID;
    }
}

export async function voteTrack(code, id, trackUri, addedByUser) {
    if (id != null && code != null && trackUri != null && addedByUser != null) {
        var conn = await getConnection();
        addedByUser = addedByUser == true ? 1 : 0;
        var event = await getByCode(code);
        var playlistID = event.playlistID;
        var queryString = `insert into EventParticipantVoting (eventCode, userCookie, trackURI, addedByUser) values ('${code}', '${id}', '${trackUri}', ${addedByUser})`;
        if(addedByUser == 0)
        {
            var votes = await getAllVotedBy(code, id);
            var voteCount = votes != null ? votes.length : 0;
            var voteLimit = event.voteLimit;
            if(voteCount < voteLimit)
            {
                await conn.query(queryString);
            }
            else
                return "Participant has exceeded vote count";
        }
        if(addedByUser == 1)
        {
            var votes = await getAllAddedBy(code, playlistID);
            var voteCount = votes != null ? votes.length : 0;
            var addLimit = event.trackLimit;
            if(voteCount < addLimit)
            {
                if(await isTrackAlreadyAdded(code, playlistID, trackUri))
                {
                    return "Participant cant add this track as it has already been added to the playlist";
                }
                await conn.query(queryString);
            }
            else
                return "Participant has exceeded add track count";
        }
    }
}