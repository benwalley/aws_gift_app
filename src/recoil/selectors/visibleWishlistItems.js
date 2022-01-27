import {DataStore} from "aws-amplify";
import {WishlistItems} from "../../models";
import { selector } from "recoil"
import {visibleWishlistIDState} from "../atoms";
import {largeWishlistItemVersion, refreshVisibleWishlistList} from '../versionAtoms'

const visibleWishlistItemsState = selector({
    key: 'visibleWishlistItemsState',
    get: async ({get}) => {
        const wishlistId = get(visibleWishlistIDState);
        const update = get(refreshVisibleWishlistList)
        const itemVersion = get(largeWishlistItemVersion)
        if(!wishlistId) return;
        // find wishlist for usingUser
        let wishlists = await DataStore.query(WishlistItems, c => c.wishlistId("eq", wishlistId));
        return wishlists;
    },
});

export default visibleWishlistItemsState
