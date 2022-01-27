import {DataStore} from "aws-amplify";
import {Users, WishlistItems} from "../../models";
import { selector } from "recoil"
import largeWishlistItemId from "../atoms/largeWishlistItemId";
import {largeWishlistItemVersion} from "../versionAtoms";


const largeWishlistItemDataState = selector({
    key: 'largeWishlistItemDataState',
    get: async ({get}) => {
        const itemId = get(largeWishlistItemId);
        const version = get(largeWishlistItemVersion)
        if(!itemId) return;
        const itemData = await DataStore.query(WishlistItems, itemId);
        return itemData
    },
});

export default largeWishlistItemDataState
