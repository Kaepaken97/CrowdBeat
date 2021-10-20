import {
    getTracks as getPlaylistTracks,
    getPlaylists as getAllPlaylists,
    getPlaylistByID as getByID,
    createPlaylist as create,
    copyFromXToY
} from '../services/playlistService.js';
import querystring from 'querystring';

export async function createPlaylist(req, res) {
    var playlistName = req.params.playlistName;
    var result = await create(playlistName);
    if (result != null)
        res.json(result);
    else {
        res.redirect('/#' +
            querystring.stringify({
                error: 'authorization_error'
            }));
    }
}

export async function copyPlaylist(req, res) {
    var fromID = req.params.fromID;
    var toID = req.params.toID;
    var result = await copyFromXToY(fromID, toID);
    if (result != null)
        res.json(result);
    else {
        res.redirect('/#' +
            querystring.stringify({
                error: 'authorization_error'
            }));
    }
}

export async function getTracks(req, res) {
    var id = req.params.id;
    var eventCode = req.params.eventCode;
    var result = await getPlaylistTracks(eventCode, id);
    if (result != null)
        res.json(result);
    else {
        res.redirect('/#' +
            querystring.stringify({
                error: 'authorization_error'
            }));
    }
}

export async function getPlaylists(req, res) {
    var result = await getAllPlaylists();
    if (result != null)
        res.json(result);
    else {
        res.redirect('/#' +
            querystring.stringify({
                error: 'authorization_error'
            }));
    }
}

export async function getPlaylistByID(req, res) {
    var id = req.params.id;
    var result = await getByID(id);
    if (result != null)
        res.json(result);
    else {
        res.redirect('/#' +
            querystring.stringify({
                error: 'authorization_error'
            }));
    }
}