import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import configs from './config.js';

//import autoDJ from '../node_modules/auto-dj-angular';

import loginRoute from './routes/login.js';
import autoDJLogin from './routes/autoDJLogin.js';
import callbackRoute from './routes/callback.js';
import clientCredentials from './middleware/clientCredentials.js';
import { getPlaylistByID, getPlaylists, getTracks, createPlaylist, copyPlaylist } from './routes/playlist.js';
import {up, down, add, remove} from './routes/queue.js';
import search from './routes/search.js';
import { getDevices, transferPlayback, play, pause, updateVolume, getCurrentlyPlayingTrack, nextTrack, previousTrack } from './routes/mediaPlayer.js';
import { createEvent, deleteEvent, getAllEventParticipants, getEventParticipantById, updateEvent, updateParticipant as adminUpdateParticipant, getAllBannedTracks, unbanTrack, banTrack, getActiveHost } from './services/hostService.js';
import { addParticipant, deleteParticipant, unvoteTrack, voteTrack, updateParticipant as userUpdateParticipant } from './services/participantService.js';
import { getAllAddedBy, getAllVotedBy, getAllVotesByCode, getEventByCode, getEventByHostID, getEventByPlaylistID } from './services/eventService.js';
import autoDJCallback from './routes/autoDJCallback.js';
import { 
    insertFromSpotify, 
    setCurrentlyPlaying,  
    getUnplayed,
    getAll,
    forceToTop,
    sortTracks,
    addUnaddedTracks,
    resetCurrentlyPlaying
} from './services/eventTracksService.js';

const app = express();
const PORT = 8080;

app.use(cors())
    .use(cookieParser())
    .use(bodyParser.json());

app.use(clientCredentials);

// localhost:8080/login
app.get('/login', loginRoute);
app.get('/autoDJLogin', autoDJLogin);
app.get('/admin-login', (req, res) => res.redirect(configs.baseURL + ':4200/playlist-selector'));
app.get('/', (req, res) => res.redirect(configs.baseURL + ':4200/home'));

// localhost:8080/callback
app.get('/callback', callbackRoute);
app.get('/autoDJCallback', autoDJCallback);
app.get('/createPlaylist/:playlistName', createPlaylist);
app.get('/copyPlaylist/:fromID/:toID', copyPlaylist);
app.get('/getPlaylists', getPlaylists);
app.get('/getPlaylistByID/:id', getPlaylistByID);
app.get('/getTracks/:eventCode/:id', getTracks);
app.get('/queueUp/:playlistId/:trackPos', up);
app.get('/queueDown/:playlistId/:trackPos', down);
app.get('/search/:searchValue', search);

//media player stuff
app.get('/mediaplayer/getDevices', getDevices);
app.get('/mediaplayer/transferPlayback/:id', transferPlayback);
app.get('/mediaplayer/play', play);
app.get('/mediaplayer/play/:id', play);
app.get('/mediaplayer/pause', pause);
app.get('/mediaplayer/nextTrack', nextTrack);
app.get('/mediaplayer/previousTrack', previousTrack);
app.get('/mediaplayer/updateVolume/:volume', updateVolume);
app.get('/mediaplayer/getCurrentlyPlayingTrack/:eventCode', getCurrentlyPlayingTrack);

//user stuff
app.get('/participant/addParticipant/:eventCode/:displayName', addParticipant);
app.get('/participant/updateParticipant/:userCookie/:displayName', userUpdateParticipant);
app.get('/participant/deleteParticipant/:userCookie', deleteParticipant);
app.get('/participant/unvoteTrack/:eventCode/:userCookie/:trackUri', unvoteTrack);
app.get('/participant/voteTrack/:eventCode/:userCookie/:trackUri/:addedByUser', voteTrack);

//admin stuff
app.get('/host/getActiveHost', getActiveHost);
app.get('/host/createEvent/:playlistID/:eventName/:voteLimit/:trackLimit/:participantLimit', createEvent);
app.get('/host/updateEvent/:eventCode/:eventName/:voteLimit/:trackLimit/:participantLimit', updateEvent);
app.get('/host/deleteEvent/:eventCode', deleteEvent);
app.get('/host/getAllEventParticipants/:eventCode', getAllEventParticipants);
app.get('/host/getEventParticipant/:userCookie', getEventParticipantById);
app.get('/host/updateParticipant/:userCookie/:displayName/:isBanned', adminUpdateParticipant);

app.get('/host/getAllBannedTracks/:eventCode', getAllBannedTracks);
app.get('/host/banTrack/:eventCode/:trackName/:trackURI', banTrack);
app.get('/host/unbanTrack/:eventCode/:trackName/:trackURI', unbanTrack);

app.get('/host/queueAdd/:playlistId/:trackURI', add);
app.get('/host/queueRemove/:playlistId/:trackURI', remove);

//event stuff used by admin and user
app.get('/event/getEvent/:eventCode', getEventByCode);
app.get('/event/getAllVotes/:eventCode', getAllVotesByCode);
app.get('/event/getAllVotedBy/:eventCode/:userCookie', getAllVotedBy);
app.get('/event/getAllAddedBy/:eventCode/:userCookie', getAllAddedBy);
app.get('/event/getByPlaylistID/:playlistID', getEventByPlaylistID);
app.get('/event/getEventByHostID/:hostID', getEventByHostID);
app.get('/event/resetCurrentlyPlaying/:eventCode', resetCurrentlyPlaying);

//event track management
app.get('/eventTracks/insertFromSpotify/:eventCode/:playlistID', insertFromSpotify);
app.get('/eventTracks/setCurrentlyPlaying/:eventCode/:trackURI', setCurrentlyPlaying);
app.get('/eventTracks/getUnplayed/:eventCode', getUnplayed);
app.get('/eventTracks/getAll/:eventCode', getAll);
app.get('/eventTracks/sortTracks/:eventCode/:playlistID', sortTracks);
app.get('/eventTracks/addUnaddedTracks/:eventCode/:playlistID', addUnaddedTracks);

app.get('/eventTracks/forceToTop/:eventCode/:playlistID/:trackURI', forceToTop);

app.listen(PORT, '192.168.0.23', () => console.log(`Server Running on port: http://localhost:${PORT}`));