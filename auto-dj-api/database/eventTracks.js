import {
    getTracksFromSpotify
} from "../services/playlistService.js";
import {
    getAllAddedByCode
} from "./eventParticipantVoting.js";
import getConnection from '../database/getConnection.js';
import {
    insertionSortDescending,
    insertionSortAscending
} from "./sortTracks.js";
import {
    addToPlaylist,
    replaceTracks
} from "../services/queueService.js";

//TODO protect from adding tracks from a playlist not attached to the eventCode
export async function insertEventTracksFromSpotify(eventCode, playlistID, sortAfterAdding = true) {
    var tracks = await getTracksFromSpotify(playlistID);
    if (tracks.length > 0) {
        for (var i = 0; i < tracks.length; i++) {
            var track = tracks[i];
            var query = "";
            if (await isTrackInEventTracks(eventCode, track.uri)) {
                query = `update EventTracks set trackNumber = ${track.trackNumber} where eventCode = '${eventCode}' and trackURI = '${track.uri}'`;
            } else {
                var title = track.title.replace("'", "''");
                var artist = track.artist.replace("'", "''");
                query = `insert into EventTracks (eventCode, trackURI, trackNumber, title, artist, isCurrentlyPlaying, hasPlayed, forceToTop) values ('${eventCode}', '${track.uri}', ${track.trackNumber}, '${title}', '${artist}', 0, 0, 0)`;
            }
            var conn = await getConnection();
            await conn.query(query);
        }
        var eventTracks = await getAllTracksWithoutVoteEditing(eventCode);
        if(eventTracks.length > 0) {
            for(var i = 0; i < eventTracks.length; i++) {
                if(tracks.filter(x => x.uri == eventTracks[i].trackURI).length == 0) {
                    deleteFromEventTracks(eventCode, eventTracks[i].trackURI);
                }
            }
        }
        if (sortAfterAdding)
            await sortEventTracks(eventCode, playlistID);
    }
}

export async function deleteFromEventTracks(eventCode, trackURI) {
    var queryString = `delete from EventTracks where eventCode = '${eventCode} and trackURI = ${trackURI}'`;
    var conn = await getConnection();
    await conn.query(queryString);
}

async function getAllTracksWithoutVoteEditing(eventCode) {
    var queryString = `select * from EventTracks where eventCode = '${eventCode}'`;
    var conn = await getConnection();
    var result = await conn.query(queryString);
    if(result.recordset && result.recordset.length > 0) {
        return result.recordset;
    }
    return [];
}

export async function isTrackInEventTracks(eventCode, trackURI) {
    if (eventCode != null && trackURI != null) {
        var conn = await getConnection();
        var queryString = `select * from EventTracks where eventCode = '${eventCode}' and trackURI = '${trackURI}'`;
        var result = await conn.query(queryString)
        if (result.recordset.length > 0)
            return true;
        else
            return false;
    }
}

export async function resetCurrentlyPlaying(eventCode) {
    if (eventCode != null) {
        var conn = await getConnection();
        var queryString = `update EventTracks set isCurrentlyPlaying = 0, hasPlayed = 0 where eventCode = '${eventCode}'`;
        await conn.query(queryString);
    }
}

//another interval function
export async function updateCurrentlyPlaying(eventCode, trackURI) {
    if (eventCode != null && trackURI != null) {
        var conn = await getConnection();
        var queryString = `update EventTracks set isCurrentlyPlaying = 0 where eventCode = '${eventCode}'`;
        await conn.query(queryString);
        var queryString = `update EventTracks set isCurrentlyPlaying = 1, hasPlayed = 1 where eventCode = '${eventCode}' and trackURI = '${trackURI}'`;
        await conn.query(queryString);
    }
}

//TODO test getUnplayedEventTracks
export async function getUnplayedEventTracks(eventCode) {
    if (eventCode != null) {
        var conn = await getConnection();
        var queryString = `select * from EventTracks where eventCode = '${eventCode}' and hasPlayed = 0 and currentlyPlaying = 1`;
        var result = await conn.query(queryString)
        if (result.recordset.length > 0)
            return result.recordset;
        else
            return null;
    }
}

//gets all event tracks with votes
export async function getAllEventTracks(eventCode) {
    if (eventCode != null) {
        var conn = await getConnection();
        var queryString = `EXEC	[dbo].[AllEventTracksWithVotes] @eventCode = N'${eventCode}'`;
        var result = await conn.query(queryString)
        if (result.recordset.length > 0)
            return result.recordset;
        else
            return [];
    }
}

export async function forceSongToTop(eventCode, playlistID, trackURI) {
    var tracks = await getAllEventTracks(eventCode);
    var foundTrack = tracks.filter(x => x.trackURI == trackURI);
    if (foundTrack != null && foundTrack.length > 0) {
        if (foundTrack[0].forceToTop == 0) {
            var forcedTracks = tracks.filter(x => x.forceToTop > 0);
            var lastForcedNumber = 0;
            if (forcedTracks != null && forcedTracks.length > 0) {
                for (var i = 0; i < forcedTracks.length; i++) {
                    if (forcedTracks[i].forceToTop > lastForcedNumber) {
                        lastForcedNumber = forcedTracks[i].forceToTop;
                    }
                }
            }
            var conn = await getConnection();
            var queryString = `update EventTracks set forceToTop = ${lastForcedNumber + 1} where eventCode = '${eventCode}' and trackURI = '${trackURI}'`;
            await conn.query(queryString);
            await sortEventTracks(eventCode, playlistID);
        }
    }
}

export async function sortEventTracks(eventCode, playlistID) {
    var tracks = await getAllEventTracks(eventCode); //TODO check if tracks > 0
    var currentlyPlayingTemp = tracks.filter(x => x.isCurrentlyPlaying == 1);
    var currentlyPlayingIndex = 0;

    if (currentlyPlayingTemp.length > 0) {
        var currentlyPlaying = currentlyPlayingTemp[0];
        for (var i = 0; i < tracks.length; i++) {
            if (tracks[i].isCurrentlyPlaying) {
                currentlyPlaying = i;
                i = tracks.length;
            }
        }
    }

    var unplayedTracks = tracks.filter(x => x.hasPlayed == 0)
    var tracksToSort = unplayedTracks.slice(currentlyPlayingIndex);
    var forcedTracksToSort = tracksToSort.filter(x => x.forceToTop > 0);
    var notForcedTracksToSort = tracksToSort.filter(x => x.forceToTop == 0);

    var sortedTracks = [];
    sortedTracks.push(...tracks.filter(x => x.hasPlayed == 1 && x.isCurrentlyPlaying == 0));
    sortedTracks.push(...tracks.filter(x => x.isCurrentlyPlaying == 1));
    sortedTracks.push(...insertionSortDescending(forcedTracksToSort, "forceToTop"));
    sortedTracks.push(...insertionSortAscending(notForcedTracksToSort, "voteCount"));

    //TODO check to see if anything has been swapped first
    if (sortedTracks.length > 0) {
        //each call to replaceTracks can only do 100 tracks at a time
        var tracksLeft = sortedTracks.length;
        var timesRan = 0;
        while (tracksLeft > 0) {
            await replaceTracks(playlistID, sortedTracks.slice(timesRan * 100, (timesRan + 1) * 100), (timesRan * 100));
            timesRan++;
            tracksLeft -= 100;
        }
    }

    await insertEventTracksFromSpotify(eventCode, playlistID, false);
}

//TODO test addEventTracks
//this is one more function to call on an interval
export async function addEventTracks(eventCode, playlistID) {
    var allAdded = (await getAllAddedByCode(eventCode));
    var tracks = await getAllEventTracks(eventCode);
    var didAddTracks = false;
    if(allAdded && allAdded.length > 0 && tracks && tracks.length > 0) {
        for (var i = 0; i < allAdded.length; i++) {
            var track = allAdded[i];
            if (tracks.filter(y => y.trackURI == track.trackURI).length == 0) {
                didAddTracks = true;
                await addToPlaylist(playlistID, track.trackURI, "autoDJ_auth_token");
            }
        };
    }
    if (didAddTracks) {
        await sortEventTracks(eventCode, playlistID);
    }
}