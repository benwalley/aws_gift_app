import { selector } from "recoil"
import {groupVersion} from '../versionAtoms'

const updateGroupVersion = selector({
    key: 'updateGroupVersion',
    get: ({get}) => {},
    set: ({get, set}) => {
        const version = get(groupVersion);
        set(groupVersion, version + 1)
    }
});

export default updateGroupVersion
