import {DataStore} from "aws-amplify";
import {Groups} from "../../models";
import { selector } from "recoil"
import dbUserState from "./dbUser";
import {groupVersion} from "../versionAtoms";

const yourGroupName = selector({
    key: 'yourGroupName',
    get: async ({get}) => {
        const user = get(dbUserState);
        const version = get(groupVersion)
        if(user) {
            const group = await DataStore.query(Groups, user.groupId);
            return group.groupName
        }
    },
});

export default yourGroupName
