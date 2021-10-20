import getConnection from '../database/getConnection.js';
import { v4 as uuidv4 } from 'uuid';
import {getActiveHost} from './hosts.js'
import { insertEventTracksFromSpotify } from './eventTracks.js';

function createEventCode() {
    var eventCode = uuidv4().slice(26);
    return eventCode;
  }

export async function createEvent(playlistID, eventName, voteLimit, trackLimit, participantLimit) {
    var eventExists = await getEventByPlaylistID(playlistID);
    if(eventExists == null) {
        var host = await getActiveHost();
        var hostID = host.id;
        var eventCode = createEventCode();
    
        var conn = await getConnection();
        var queryString = `insert into Events (hostID,eventCode,voteLimit,` + 
        `eventName,trackLimit,participantLimit, playlistID) VALUES('${hostID}','${eventCode}'` +
        `,${voteLimit},'${eventName}',${trackLimit},${participantLimit}, '${playlistID}')`;
    
        await conn.query(queryString);
        var eventCode = (await getEventByPlaylistID(playlistID)).eventCode;
        await insertEventTracksFromSpotify(eventCode, playlistID);
        return eventCode;
    }
    else {
        await insertEventTracksFromSpotify(eventExists.eventCode, playlistID);
        return eventExists.eventCode;
    }
}

export async function getEventByPlaylistID(playlistID) {
    var conn = await getConnection();
    var querystring = `select * from Events where playlistID = '${playlistID}'`;
    var result = await conn.query(querystring);
    if(result.recordset.length > 0)
        return result.recordset[0];
    return null;
}

export async function getEventByHost(hostID) {
    var conn = await getConnection();
    var querystring = `select * from Events where hostID = '${hostID}'`;
    var result = await conn.query(querystring);
    if(result.recordset.length > 0)
        return result.recordset;
    return null;
}

export async function updateEventSettings(eventCode, eventName, voteLimit, trackLimit, participantLimit) {
    var conn = await getConnection();
    var updateEventName = `update Events set eventName = ${eventName} where ` + 
    `eventCode = ${eventCode}`;
    var updateVoteLimit = `update Events set voteLimit = ${voteLimit} where ` + 
    `eventCode = ${eventCode}`;
    var updateTrackLimit = `update Events set trackLimit = ${trackLimit} where ` + 
    `eventCode = ${eventCode}`;
    var updateParticipantLimit = `update Events set participantLimit = ${participantLimit} where ` + 
    `eventCode = ${eventCode}`;

    if(eventName != null)
        await conn.query(updateEventName);
    if(voteLimit != null)
        await conn.query(updateVoteLimit);
    if(trackLimit != null)
        await conn.query(updateTrackLimit);
    if(participantLimit != null)
        await conn.query(updateParticipantLimit);
}

export async function getByCode(eventCode) {
    if (eventCode != null) {
        var conn = await getConnection();
        var queryString = `select * from Events where eventCode = '${eventCode}'`;
        var result = await conn.query(queryString);
            if(result.recordset.length > 0)
                return result.recordset[0];
            else 
                return null;
    }
}

export async function deleteByEventCode(eventCode) {
    if (eventCode == null) {
        var conn = await getConnection();
        var queryString = `delete from Events where eventCode = '${eventCode}'`;
        await conn.query(queryString);
    }
}