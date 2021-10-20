import {
    setInterval
} from 'timers';
import {
    token
} from './tokenModel.js';

import request from 'request';
import { getToken as getTokenFromDB, updateToken, deleteToken,createToken } from "../database/tokens.js";
import configs from '../config.js';

// Private variables
var tokens = {};

//Public functions
export async function refreshToken(tok) {
    var options = {
        url: "https://accounts.spotify.com/api/token",
        form: {
            grant_type: 'refresh_token',
            code: "",
            refresh_token: tok.getRefreshToken(),
            redirect_uri: 'http://192.168.0.23:8080/',
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${new Buffer(configs.client_id + ':' + configs.client_secret).toString('base64')}`,
        }
    };
    var promise = new Promise(async function (resolve, reject) {
        let callback = async function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        };

        request.post(options, callback);
    });

    var result = JSON.parse(await promise);
    tokens[tok.getTokenName()].refresh(result.access_token, result.expires_in)
    await updateToken(tok.getTokenName(), tok.getIssued(), tok.getExpiresIn(), tok.getToken(), tok.getRefreshToken());
}

export async function getToken(tokenType) {
    if (tokens[tokenType] != undefined && tokens[tokenType] != null) {
        if (tokenType != "client_token" && tokens[tokenType].expired() && tokens[tokenType].hasRefreshToken())
            await refreshToken(tokens[tokenType])
        return tokens[tokenType].getToken();
    } else {
        var DBToken = await getTokenFromDB(tokenType);
        if (DBToken != null) {
            tokens[tokenType] = token(tokenType, DBToken.token, DBToken.expires_in, DBToken.issued, DBToken.refreshToken);
            if (tokenType != "client_token" && tokens[tokenType].expired() && DBToken.refreshToken != null)
                await refreshToken(tokens[tokenType])
            return tokens[tokenType].getToken();
        }
    }
    return null;
}

export async function isExpired(tokenType) {
    if (tokens[tokenType] != undefined && tokens[tokenType] != null)
        return tokens[tokenType].expired();
    else
        return true
}

export async function setToken(tokenType, tok, expires_in, refreshTok = null) {
    if (tok == null) {
        tokens[tokenType] = null;
        await deleteToken(tokenType);
    } else {
        var DBToken = await getTokenFromDB(tokenType);
        const issuedNow = Date.now() / 1000;

        if (DBToken != null) {
            await updateToken(tokenType, issuedNow, expires_in, tok, refreshTok);
        } else {
            await createToken(tokenType, issuedNow, expires_in, tok, refreshTok)
        }
        tokens[tokenType] = token(tokenType, tok, expires_in, issuedNow, refreshTok);
    }
}