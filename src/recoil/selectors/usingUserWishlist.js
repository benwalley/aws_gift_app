import {DataStore} from "aws-amplify";
import {Users, Wishlist} from "../../models";
import {usingUserIdState} from "../atoms/";
import { selector } from "recoil"
import createUsersWishlist from "../../helpers/createUserWishlist";

// Returns the user's wishlist. If it doesn't exist, it creates it.
const usingUserWishlistState = selector({
    key: 'usingUserWishlistState',
    get: async ({get}) => {
        const userId = get(usingUserIdState);
        const usingUser = await DataStore.query(Users, userId);
        if(!usingUser) return;
        // find wishlist for usingUser
        let wishlist = await DataStore.query(Wishlist, c => c.ownerId("eq", usingUser.id));
        if(wishlist && wishlist.length > 0) return wishlist[0]
        // if the user doesn't have a wishlist, create one.
        const newWishlist = await createUsersWishlist(usingUser)
        return newWishlist;
    },
});

export default usingUserWishlistState
