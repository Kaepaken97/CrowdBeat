import getConnection from '../database/getConnection.js';

export async function getToken(tokenName) {
    if (tokenName != null) {
        var conn = await getConnection();
        var queryString = `select * from Tokens where tokenName = '${tokenName}'`;
        var result = await conn.query(queryString);
            if(result.recordset.length > 0)
                return result.recordset[0];
            else 
                return null;
    }
}

export async function createToken(tokenName, issued, expires_in, token, refreshToken) {
    if (tokenName != null && issued != null && expires_in != null && token != null) {
        var conn = await getConnection();
        var queryString = `insert into Tokens (tokenName, issued, expires_in, token, refreshToken) values('${tokenName}', '${issued}', ${expires_in}, '${token}', '${refreshToken}')`;
        await conn.query(queryString);
    }
}

export async function updateToken(tokenName, issued, expires_in, token, refreshToken) {
    if (tokenName != null && issued != null && expires_in != null && token != null) {
        var conn = await getConnection();
        var queryString = `update Tokens set issued = '${issued}', expires_in = ${expires_in}, token = '${token}', refreshToken = '${refreshToken}' where tokenName = '${tokenName}'`;
        await conn.query(queryString);
    }
}

export async function deleteToken(tokenName) {
    if (tokenName != null) {
        var conn = await getConnection();
        var queryString = `delete from Tokens where tokenName = '${tokenName}'`;
        await conn.query(queryString);
    }
}