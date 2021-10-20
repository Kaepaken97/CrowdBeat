import { addParticipant as add, updateParticipant as update, getByCookie, deleteById } from '../database/eventParticipants.js';
import { voteTrack as vote, unvoteTrack as unvote } from '../database/eventParticipantVoting.js';

export async function addParticipant(req, res) {
  var eventCode = req.params.eventCode;
  var displayName = req.params.displayName;
  var result = await add(eventCode, displayName);
  res.json(result);
}

export async function updateParticipant(req, res) {
  var userCookie = req.params.userCookie;
  var displayName = req.params.displayName;
  var isBanned = await getByCookie(userCookie).isBanned;
  var result = await update(userCookie, displayName, isBanned);
  res.json(result);
}

export async function deleteParticipant(req, res) {
  var userCookie = req.params.userCookie;
  await deleteById(userCookie);
}

export async function unvoteTrack(req, res) {
  var userCookie = req.params.userCookie;
  var eventCode = req.params.eventCode;
  var trackUri = req.params.trackUri;
  await unvote(eventCode, userCookie, trackUri);
}

export async function voteTrack(req, res) {
  var userCookie = req.params.userCookie;
  var eventCode = req.params.eventCode;
  var trackUri = req.params.trackUri;
  var addedByUser = req.params.addedByUser;
  var result = await vote(eventCode, userCookie, trackUri, addedByUser);
  if(result != null) {
    res.status(404).send("Exceeded Votes"); //participant has exceeded number of votes allowed
  }
}