import {DataStore} from "aws-amplify";
import {Groups} from "../../models";
import {dbUserState} from "../selectors";
import {selector, selectorFamily} from "recoil"
import {groupVersion, userMoniesVersion} from '../versionAtoms'


const userSpecificGroupsState = selectorFamily({
    key: 'userSpecificGroupsState',
    get: userId => async ({get}) => {
        const dbUser = get(dbUserState);
        const version = get(groupVersion)
        if(!dbUser) return;
        const groups = await DataStore.query(Groups, c => c.memberIds("contains", userId));

        return groups
    },
});

export default userSpecificGroupsState
