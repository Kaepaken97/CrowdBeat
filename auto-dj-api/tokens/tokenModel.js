export function token(tokenType, token, expires_in, issued, refreshToken) {
    var token = token;
    var tokenName = tokenType;
    var issued = issued;
    var expires_in = expires_in;
    var refresh_token = refreshToken;

    function getToken() {
        return token;
    }

    function expired() {
        var expiry = issued + expires_in;
        var now = Date.now()/1000;
        return expiry <= now;
    }

    function hasRefreshToken() {
        return refresh_token != null;
    }

    function getRefreshToken() {
        return refresh_token;
    }

    function getTokenName() {
        return tokenName;
    }

    function getIssued() {
        return issued;
    }

    function getExpiresIn() {
        return expires_in;
    }

    function refresh(accessToken, expiresIn) {
        if(accessToken != null && accessToken != "" && expiresIn != null) {
            token = accessToken;
            expires_in = expiresIn;
            issued = Date.now()/1000;
        }
    }

    return {
        getToken,
        expired,
        refresh,
        hasRefreshToken,
        getRefreshToken,
        getTokenName,
        getIssued,
        getExpiresIn
    };
}