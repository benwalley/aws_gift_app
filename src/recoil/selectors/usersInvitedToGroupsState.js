import {DataStore} from "aws-amplify";
import {Groups, Users} from "../../models";
import {dbUserState} from "./";
import { selector } from "recoil"
import {groupVersion} from "../versionAtoms";

const usersInvitedToGroupsState = selector({
    key: 'usersInvitedToGroupsState',
    get: async ({get}) => {
        const dbUser = get(dbUserState);
        const version = get(groupVersion)
        if(!dbUser) return;
        const groups = await DataStore.query(Groups, c => c.invitedIds("contains", dbUser.id).memberIds('notContains', dbUser.id));
        return groups
    },
});

export default usersInvitedToGroupsState
