import { selector } from "recoil"
import {groupVersion, largeWishlistItemVersion} from '../versionAtoms'

const updateLargeWishlistItemVersion = selector({
    key: 'updateLargeWishlistItemVersion',
    get: ({get}) => {},
    set: ({get, set}) => {
        const version = get(largeWishlistItemVersion);
        set(largeWishlistItemVersion, version + 1)
    }
});

export default updateLargeWishlistItemVersion
