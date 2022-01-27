import {DataStore} from "@aws-amplify/datastore";
import {Users} from "../models";

export function sDbUser(userId, versions, setVersions) {
    localStorage.setItem('giftApp/User/dbUser', userId)
    const vCopy = versions;
    vCopy.dbUser = vCopy.dbUser + 1;
    setVersions({...vCopy});
}

export function sUsingUser(userId, versions, setVersions) {
    localStorage.setItem('giftApp/User/usingUser', userId)
    const vCopy = versions;
    vCopy.usingUser = vCopy.usingUser + 1;
    setVersions({...vCopy});
}

export function gDbUser() {
    return localStorage.getItem('giftApp/User/dbUser')
}

export function gUsingUser() {
    return localStorage.getItem('giftApp/User/usingUser')
}

export async function getUserData(id) {
    const user = await DataStore.query(Users, id);
    return user;
}

export function updateUUVersion(versions, setVersions) {
    const vCopy = versions;
    vCopy.usingUser = vCopy.usingUser + 1;
    setVersions({...vCopy});
}

export function updateDbUVersion(versions, setVersions) {
    const vCopy = versions;
    vCopy.dbUser = vCopy.dbUser + 1;
    setVersions({...vCopy});
}

