import {DataStore} from "aws-amplify";
import {Groups} from "../../models";
import {dbUserState} from "./";
import { selector } from "recoil"
import {groupVersion, userMoniesVersion} from '../versionAtoms'


const usersGroupsState = selector({
    key: 'usersGroupsState',
    get: async ({get}) => {
        const dbUser = get(dbUserState);
        const version = get(groupVersion)
        if(!dbUser) return;
        const groups = await DataStore.query(Groups, c => c.memberIds("contains", dbUser.id));

        return groups
    },
});

export default usersGroupsState
