import { v4 as uuidv4 } from 'uuid';
import getConnection from '../database/getConnection.js';

function createUserCookie() {
    var cookie = uuidv4();
    return cookie;
}

export async function getAllByCode(eventCode) {
    if (eventCode != null) {
        var conn = await getConnection();
        var queryString = `select * from EventParticipants where eventCode = '${eventCode}'`;
        var result = await conn.query(queryString)
            if(result.recordset.length > 0)
                return result.recordset;
            else 
                return null;
    }
}

export async function getByCookie(id) {
    if (id != null) {
        var conn = await getConnection();
        var queryString = `select * from EventParticipants where userCookie = '${id}'`;
        var result = await conn.query(queryString);
            if(result.recordset.length > 0)
                return result.recordset[0];
            else 
                return null;
    }
}

export async function deleteById(id) {
    if (id != null) {
        var conn = await getConnection();
        var queryString = `delete from EventParticipants where userCookie = '${id}'`;
        await conn.query(queryString);
    }
}

export async function addParticipant(eventCode, displayName) {
    if (eventCode != null && displayName != null) {
        var conn = await getConnection();
        var cookie = createUserCookie();
        var queryString = `insert into EventParticipants (eventCode, userCookie, displayName, isBanned) values ('${eventCode}', '${cookie}', '${displayName}', 0)`;
        await conn.query(queryString);
        return cookie;
    }
}

export async function updateParticipant(userCookie, displayName, isBanned) {
    if (isBanned != null && displayName != null && userCookie != null) {
        var conn = await getConnection();
        var queryString = `update EventParticipants (displayName, isBanned) values ('${displayName}', ${isBanned}) where userCookie = '${userCookie}'`;
        await conn.query(queryString);
    }
}