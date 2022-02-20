import {DataStore} from "aws-amplify";
import {Groups, Users} from "../../models";
import {dbUserState} from "./";
import { selector } from "recoil"
import {groupVersion} from "../versionAtoms";
import {currentGroupIdState} from "../atoms";


const invitedGroupUsers = selector({
    key: 'invitedGroupUsers',
    get: async ({get}) => {
        const dbUser = get(dbUserState);
        const version = get(groupVersion)
        const currentGroup = get(currentGroupIdState)
        if(!dbUser) return;
        const emails = [];
        const group =  await DataStore.query(Groups, currentGroup);
        for(const id of group.invitedIds) {
            if(group.memberIds.indexOf(id) === -1) {
                // get the user for the ID
                const user = await DataStore.query(Users, id);
                emails.push(user.emailAddress)
            }
        }
        return emails
    },
});

export default invitedGroupUsers
