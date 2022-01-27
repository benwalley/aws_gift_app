import {DataStore} from "aws-amplify";
import {Users, WishlistItems} from "../../models";
import { selector } from "recoil"
import visibleWishlistState from "./visibleWishlist";
import {largeWishlistItemVersion} from "../versionAtoms";
import dbUserState from "./dbUser";

const youWantToGetList = selector({
    key: 'youWantToGetList',
    get: async ({get}) => {
        const dbUser = get(dbUserState)
        const largeItemVersion = get(largeWishlistItemVersion);
        const items =  await DataStore.query(WishlistItems, c => c.wantsToGet("contains", dbUser.id));
        return items;
    },
});

export default youWantToGetList
