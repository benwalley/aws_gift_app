import {DataStore} from "aws-amplify";
import {Groups} from "../../models";
import {currentGroupIdState} from "../atoms/";
import { selector } from "recoil"
import currentGroupVersion from "../versionAtoms/currentGroupVersion";
import {groupVersion} from "../versionAtoms";


const currentGroupState = selector({
    key: 'currentGroupState',
    get: async ({get}) => {
        const id = get(currentGroupIdState)
        const version = get(currentGroupVersion)
        const gVersion = get(groupVersion)
        if(!id) return '';
        // get the user
        const group = await DataStore.query(Groups, id);
        return group
    },
});

export default currentGroupState
