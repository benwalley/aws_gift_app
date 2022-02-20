import { selector } from "recoil"
import {groupVersion} from "../versionAtoms";
import currentGroupState from "./currentGroup";

const yourGroupName = selector({
    key: 'yourGroupName',
    get: async ({get}) => {
        const version = get(groupVersion)
        const currentGroup = get(currentGroupState)
        if(currentGroup) {
            return currentGroup.groupName;
        }
    },
});

export default yourGroupName
