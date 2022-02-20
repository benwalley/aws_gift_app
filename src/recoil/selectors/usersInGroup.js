import {DataStore} from "aws-amplify";
import {Groups, Users} from "../../models";
import {dbUserState} from "./";
import { selector } from "recoil"
import {groupVersion} from "../versionAtoms";
import {currentGroupIdState} from "../atoms";


const usersInGroupState = selector({
    key: 'usersInGroupState',
    get: async ({get}) => {
        const dbUser = get(dbUserState);
        const version = get(groupVersion)
        const currentGroup = get(currentGroupIdState)
        if(!dbUser) return;
        const group = await DataStore.query(Groups, currentGroup);
        const groupUsers = []
        for(const id of group.memberIds) {
            const user = await DataStore.query(Users, id);
            if(user) groupUsers.push(user);
        }
        return groupUsers;
    },
});

export default usersInGroupState
