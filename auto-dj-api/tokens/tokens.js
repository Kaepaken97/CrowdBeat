import request from 'request';
import { getToken as getTokenFromDB, updateToken, deleteToken,createToken } from "../database/tokenService.js";
import configs from '../config.js';

// Private functions
function token(tokenType, token, expires_in, issued, refreshToken) {
    var token = token;
    var tokenName = tokenType;
    var issued = issued;
    var expires_in = expires_in;
    var refresh_token = refreshToken;

    async function getToken() {
        return token;
    }

    async function expired() {
        var expiry = issued + expires_in;
        var now = Date.now()/1000;
        return expiry <= now;
    }

    async function hasRefreshToken() {
        return refresh_token != null;
    }

    async function refresh() {
        if(expired() && refresh_token != null)
        var options = {
            url: "https://accounts.spotify.com/api/token",
            form: {
                grant_type: 'refresh_token',
                code: "",
                refresh_token: refreshToken,
                redirect_uri: 'http://localhost:8080/',
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${new Buffer(configs.client_id + ':' + configs.client_secret).toString('base64')}`,
            }
        };
              var promise = new Promise(async function(resolve, reject) {
                let callback = async function (error, response, body) {
                    if(error) {
                        reject(error);
                    } else {
                        resolve(body);
                    }
                };
        
                // use the access token to access the Spotify Web API
                request.post(options, callback);
            });
        
            var result = JSON.parse(await promise);
            token = result.access_token;
            expires_in = result.expires_in;
            issued = Date.now()/1000;

            await updateToken(tokenName, issued, expires_in, token, refreshToken);
    }

    return {
        getToken,
        expired,
        refresh,
        hasRefreshToken
    };
}

// Private variables
var tokens = {};

// Public functions
export async function getToken(tokenType) {
    if(tokens[tokenType] != undefined && tokens[tokenType] != null)
    {
        if(tokenType != "client_token" && await tokens[tokenType].expired() && tokens[tokenType].hasRefreshToken())
            await tokens[tokenType].refresh()
        return await tokens[tokenType].getToken();
    }
    else {
        var DBToken = await getTokenFromDB(tokenType);
        if(DBToken != null){
            tokens[tokenType] = await token(tokenType, DBToken.token, DBToken.expires_in, DBToken.issued, DBToken.refreshToken);
            if(tokenType != "client_token" && await tokens[tokenType].expired() && DBToken.refreshToken != null)
                await tokens[tokenType].refresh()
            return await tokens[tokenType].getToken();
        }
    }
    return null;
}

export async function isExpired(tokenType) {
    if(tokens[tokenType] != undefined && tokens[tokenType] != null)
        return await tokens[tokenType].expired();
    else
        return true
}

export async function setToken(tokenType, tok, expires_in, refreshTok = null) {
    if(tok == null)
    {
        tokens[tokenType] = null;
        await deleteToken(tokenType);
    }
    else
    {
        var DBToken = await getTokenFromDB(tokenType);
        const issuedNow = Date.now()/1000;
        
        if(DBToken != null)
        {
            await updateToken(tokenType, issuedNow, expires_in, tok, refreshTok);
        }
        else
        {
            await createToken(tokenType, issuedNow, expires_in, tok, refreshTok)
        }
        tokens[tokenType] = await token(tokenType, tok, expires_in, issuedNow, refreshTok);
    }
}