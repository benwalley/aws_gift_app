import {DataStore} from "aws-amplify";
import {Wishlist} from "../../models";
import { selector } from "recoil"
import visibleWishlistIDState from "../atoms/visibleWishlistId";

const visibleWishlistState = selector({
    key: 'visibleWishlistState',
    get: async ({get}) => {
        const wishlistId = get(visibleWishlistIDState);
        if(!wishlistId) return;
        // find wishlist for usingUser
        let wishlist = await DataStore.query(Wishlist, wishlistId);
        return wishlist;
    },
});

export default visibleWishlistState
