import {DataStore} from "aws-amplify";
import {Groups, Users} from "../../models";
import {dbUserState} from "./";
import { selector } from "recoil"
import {groupVersion} from "../versionAtoms";
import {currentGroupIdState} from "../atoms";


const groupAdminsState = selector({
    key: 'groupAdminsState',
    get: async ({get}) => {
        const dbUser = get(dbUserState);
        const version = get(groupVersion)
        const currentGroup = get(currentGroupIdState)
        if(!dbUser) return;
        const admins = []
        const group = await DataStore.query(Groups, currentGroup);
        if(!group) return []
        for await (const id of group.adminIds) {
            const user = await DataStore.query(Users, id);
            if(user) {
                admins.push(user);
            }
        }
        return admins;
    },
});

export default groupAdminsState
