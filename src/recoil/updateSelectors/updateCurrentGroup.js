import { selector } from "recoil"
import {refreshVisibleWishlistList} from '../versionAtoms'
import currentGroupVersion from "../versionAtoms/currentGroupVersion";

const updateCurrentGroup = selector({
    key: 'updateCurrentGroup',
    get: ({get}) => {},
    set: ({get, set}) => {
        const version = get(currentGroupVersion);
        set(currentGroupVersion, version + 1)
    }
});

export default updateCurrentGroup
