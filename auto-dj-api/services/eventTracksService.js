import { 
    insertEventTracksFromSpotify, 
    updateCurrentlyPlaying,  
    getUnplayedEventTracks,
    getAllEventTracks,
    forceSongToTop,
    sortEventTracks,
    addEventTracks,
    resetCurrentlyPlaying as resetCurrentlyPlayingTracks
} from "../database/eventTracks.js";

export async function insertFromSpotify(res, req) {
    var eventCode = req.params.eventCode;
    var playlistID = req.params.playlistID;
    var result = await insertEventTracksFromSpotify(eventCode, playlistID);
    res.json({result});
}

//TODO - why does this need req.req and res.res?
export async function resetCurrentlyPlaying(res, req) {
    var eventCode = req.req.params.eventCode;
    await resetCurrentlyPlayingTracks(eventCode);
    res.res.json({});
}

export async function setCurrentlyPlaying(res, req) {
    var eventCode = req.params.eventCode;
    var trackURI = req.params.trackURI;
    var result = await updateCurrentlyPlaying(eventCode, trackURI);
    res.json({result});
}

export async function getUnplayed(res, req) {
    var eventCode = req.params.eventCode;
    var result = await getUnplayedEventTracks(eventCode);
    res.json({result});
}

export async function getAll(res, req) {
    var eventCode = req.params.eventCode;
    var result = await getAllEventTracks(eventCode);
    res.json({result});
}

//TODO why does this need req.req and res.res too?
export async function forceToTop(res, req) {
    var eventCode = req.req.params.eventCode;
    var playlistID = req.req.params.playlistID;
    var trackURI = req.req.params.trackURI;
    var result = await forceSongToTop(eventCode, playlistID, trackURI);
    res.res.json({result});
}

export async function sortTracks(res, req) {
    var eventCode = req.params.eventCode;
    var playlistID = req.params.playlistID;
    var result = await sortEventTracks(eventCode, playlistID);
    res.json({result});
}

//TODO this one has double req too
export async function addUnaddedTracks(res, req) {
    var eventCode = req.req.params.eventCode;
    var playlistID = req.req.params.playlistID;
    var result = await addEventTracks(eventCode, playlistID);
    res.res.json({result});
}
