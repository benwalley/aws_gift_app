import {DataStore} from "aws-amplify";
import {Users} from "../../models";
import {dbUserState} from "./";
import { selector } from "recoil"
import {groupVersion} from "../versionAtoms";

const subUsersState = selector({
    key: 'subUsersState',
    get: async ({get}) => {
        const dbUser = get(dbUserState);
        const version = get(groupVersion)
        if(!dbUser) return;
        const gottenOtherUsers = await DataStore.query(Users, c => c.parentUserId("eq", dbUser.id));
        return gottenOtherUsers
    },
});

export default subUsersState
