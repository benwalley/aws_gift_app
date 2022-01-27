import {DataStore} from "aws-amplify";
import {Users, WishlistItems} from "../../models";
import { selector } from "recoil"
import visibleWishlistState from "./visibleWishlist";

const visibleWishlistDisplayNameState = selector({
    key: 'visibleWishlistDisplayNameState',
    get: async ({get}) => {
        const visibleWishlist = get(visibleWishlistState);
        if(visibleWishlist) {
            const owner = await DataStore.query(Users, visibleWishlist.ownerId);
            return owner.displayName
        }
    },
});

export default visibleWishlistDisplayNameState
