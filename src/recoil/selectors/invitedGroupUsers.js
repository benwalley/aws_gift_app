import {DataStore} from "aws-amplify";
import {Groups, Users} from "../../models";
import {dbUserState} from "./";
import { selector } from "recoil"
import {groupVersion} from "../versionAtoms";


const invitedGroupUsers = selector({
    key: 'invitedGroupUsers',
    get: async ({get}) => {
        const dbUser = get(dbUserState);
        const version = get(groupVersion)
        if(!dbUser || !dbUser.groupId) return;
        const emails = [];
        const group =  await DataStore.query(Groups, dbUser.groupId);
        if(!group || !group.invitedIds || group.invitedIds.length === 0) return [];
        for(const id of group.invitedIds) {
            const user = await DataStore.query(Users, id);
            if(!user.groupId || user.groupId !== group.id) {
                emails.push(user.emailAddress)
            }
        }
        return emails
    },
});

export default invitedGroupUsers
