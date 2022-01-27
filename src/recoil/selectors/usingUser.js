import {DataStore} from "aws-amplify";
import {Users} from "../../models";
import { selector } from "recoil"
import usingUserIdState from "../atoms/usingUserId";
import dbUserState from "./dbUser";


const usingUserState = selector({
    key: 'usingUserState',
    get: async ({get}) => {
        let userId = get(usingUserIdState);
        if(!userId) return get(dbUserState)
        // at this point, the user ID is set, if it made it this far.
        const userData = await DataStore.query(Users, userId);
        return userData
    },
});

export default usingUserState
