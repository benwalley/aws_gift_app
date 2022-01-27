import {DataStore} from "aws-amplify";
import {Users} from "../../models";
import {dbUserState} from "./";
import { selector } from "recoil"
import {groupVersion} from "../versionAtoms";


const usersInGroupState = selector({
    key: 'usersInGroupState',
    get: async ({get}) => {
        const dbUser = get(dbUserState);
        const version = get(groupVersion)
        if(!dbUser || !dbUser.groupId) return;
        const gottenOtherUsers = await DataStore.query(Users, c => c.groupId("eq", dbUser.groupId));
        return gottenOtherUsers
    },
});

export default usersInGroupState
