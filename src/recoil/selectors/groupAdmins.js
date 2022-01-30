import {DataStore} from "aws-amplify";
import {Groups, Users} from "../../models";
import {dbUserState} from "./";
import { selector } from "recoil"
import {groupVersion} from "../versionAtoms";


const groupAdminsState = selector({
    key: 'groupAdminsState',
    get: async ({get}) => {
        const dbUser = get(dbUserState);
        const version = get(groupVersion)
        if(!dbUser || !dbUser.groupId) return;
        const admin = await DataStore.query(Users, c => c.groupId("eq", dbUser.groupId).isAdmin('eq', true));
        if(!admin) return [];
        return admin
    },
});

export default groupAdminsState
