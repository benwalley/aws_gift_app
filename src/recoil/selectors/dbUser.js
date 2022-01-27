import {DataStore} from "aws-amplify";
import {Users} from "../../models";
import {authUserEmail, authUserUsername} from "../atoms/";
import {dbUserVersion} from '../versionAtoms'
import { selector } from "recoil"


const dbUserState = selector({
    key: 'dbUserState',
    get: async ({get}) => {
        const username = get(authUserUsername);
        const email = get(authUserEmail);
        const version = get(dbUserVersion)
        if(!username || !email) return '';
        // get the user
        const user = await DataStore.query(Users, c => c.userUsername("eq", username));
        if(user && user.length > 0) return user[0];
        // if the user isn't found, create it, and then return it
        const userData = {
            "displayName": 'noname',
            "userUsername": username,
            "emailAddress": email
        }
        const newUser = await DataStore.save(
            new Users(userData)
        );
        return newUser;
    },
});

export default dbUserState
