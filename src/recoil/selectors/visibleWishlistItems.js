import {DataStore} from "aws-amplify";
import {WishlistItems} from "../../models";
import { selector } from "recoil"
import {currentGroupIdState, visibleWishlistIDState} from "../atoms";
import {groupVersion, largeWishlistItemVersion, refreshVisibleWishlistList} from '../versionAtoms'

const visibleWishlistItemsState = selector({
    key: 'visibleWishlistItemsState',
    get: async ({get}) => {
        const wishlistId = get(visibleWishlistIDState);
        const visibleWishlistVersion = get(refreshVisibleWishlistList)
        const itemVersion = get(largeWishlistItemVersion)
        const gVersion = get(groupVersion)
        const groupId = get(currentGroupIdState)
        if(!wishlistId) return;
        // find wishlist for usingUser
        let wishlists = await DataStore.query(WishlistItems, c => c.wishlistId("eq", wishlistId).groupIds('contains', groupId));
        return wishlists;
    },
});

export default visibleWishlistItemsState
