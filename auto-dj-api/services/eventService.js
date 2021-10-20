import { getByCode, getEventByHost, getEventByPlaylistID as getByPlaylistID } from '../database/events.js';
import {updateParticipant as up} from '../database/eventParticipants.js';
import {getAllVotesByCode as getAllVotes, 
    getAllVotedBy as allVotedBy, 
    getAllAddedBy as allAddedBy } from '../database/eventParticipantVoting.js';

export async function getEventByCode(req, res) {
    var eventCode = req.params.eventCode;
    var result = await getByCode(eventCode);
    res.json(result);
}

export async function getAllVotesByCode(req, res) {
    var eventCode = req.params.eventCode;
    var trackURI = req.params.trackURI;
    var result = await getAllVotes(eventCode, trackURI);
    res.json(result);
}

export async function getEventByPlaylistID(req, res) {
    var playlistID = req.params.playlistID;
    var result = await getByPlaylistID(playlistID);
    console.log(result);
    res.json(result);
}

export async function getEventByHostID(req, res) {
    var hostID = req.params.hostID;
    var result = await getEventByHost(hostID);
    console.log(result);
    res.json(result);
}

export async function getAllVotedBy(req, res) {
    var eventCode = req.params.eventCode;
    var userCookie = req.params.userCookie;
    var result = await allVotedBy(eventCode, userCookie);
    res.json(result);
}

export async function getAllAddedBy(req, res) {
    var eventCode = req.params.eventCode;
    var userCookie = req.params.userCookie;
    var result = await allAddedBy(eventCode, userCookie);
    res.json(result);
}