import { createEvent as create, 
  deleteByEventCode, 
  getByCode, 
  updateEventSettings } from "../database/events.js";
import { getAllByCode, getByCookie } from "../database/eventParticipants.js";
import { getAllBannedTracks as allBannedTracks, unbanTrack as unban, banTrack as ban } from "../database/noPlayList.js";
import { getActiveHost as getActive } from "../database/hosts.js";
import { removeFromPlaylist } from "./queueService.js";
import { deleteFromEventTracks, sortEventTracks } from "../database/eventTracks.js";

export async function getActiveHost(req, res) {
  var result = await getActive();
  if(result != null) {
    res.json(result);
  }
  else
    res.status(404).send("Something went wrong.");
}

export async function createEvent(req, res)
{
  var playlistID = req.params.playlistID;
  var eventName = req.params.eventName;
  var voteLimit = req.params.voteLimit;
  var trackLimit = req.params.trackLimit;
  var participantLimit = req.params.participantLimit;
  var result = await create(playlistID, eventName, voteLimit, trackLimit, participantLimit);
  if(result != null)
    res.json(result);
  else
    res.status(404).send("Something went wrong.");
}

export async function deleteEvent(req, res) {
  var eventCode = req.params.eventCode;
  await deleteByEventCode(eventcode);
}

export async function updateEvent(req, res) {
  var eventCode = req.params.eventCode;
  var eventName = req.params.eventName;
  var voteLimit = req.params.voteLimit;
  var trackLimit = req.params.trackLimit;
  var participantLimit = req.params.participantLimit;
  await updateEventSettings(eventCode, eventName, voteLimit, trackLimit, participantLimit);
}

export async function getAllEventParticipants(req, res) {
  var eventCode = req.params.eventCode;
  var result = await getAllByCode(eventCode);
  res.json(result);
}

export async function getEventParticipantById(req, res) {
  var userCookie = req.params.userCookie;
  var result = await getByCookie(userCookie);
  res.json(result);
}

export async function updateParticipant(req, res) {
  var userCookie = req.params.userCookie;
  var displayName = req.params.displayName;
  var isBanned = req.params.isBanned;
  await up(userCookie, displayName, isBanned);
}

export async function getAllBannedTracks(req, res) {
  var eventCode = req.params.eventCode;
  await allBannedTracks(eventCode);
}

export async function banTrack(req, res) {
  var eventCode = req.params.eventCode;
  var trackName = req.params.trackName;
  var trackURI = req.params.trackURI;
  await ban(eventCode, trackName, trackURI);
  var event = await getByCode(eventCode);
  if(event && event.playlistID) {
    await removeFromPlaylist(event.playlistID, trackURI, "autoDJ_auth_token");
    await deleteFromEventTracks(eventCode, trackURI);
    await sortEventTracks(eventCode, event.playlistID);
  }
}

export async function unbanTrack(req, res) {
  var eventCode = req.params.eventCode;
  var trackName = req.params.trackName;
  var trackURI = req.params.trackURI;
  await unban(eventCode, trackName, trackURI);
}