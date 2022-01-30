import { selector } from "recoil"
import {refreshVisibleWishlistList} from '../versionAtoms'

const updateVisibleWishlist = selector({
    key: 'updateVisibleWishlist',
    get: ({get}) => {},
    set: ({get, set}) => {
        const version = get(refreshVisibleWishlistList);
        set(refreshVisibleWishlistList, version + 1)
    }
});

export default updateVisibleWishlist
