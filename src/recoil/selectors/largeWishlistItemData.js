import {DataStore} from "aws-amplify";
import {Users, WishlistItems} from "../../models";
import { selector } from "recoil"
import largeWishlistItemId from "../atoms/largeWishlistItemId";
import {largeWishlistItemVersion} from "../versionAtoms";
import {currentGroupIdState} from "../atoms";


const largeWishlistItemDataState = selector({
    key: 'largeWishlistItemDataState',
    get: async ({get}) => {
        const itemId = get(largeWishlistItemId);
        const version = get(largeWishlistItemVersion)
        const currentGroup = get(currentGroupIdState)
        if(!itemId) return;
        const itemData = await DataStore.query(WishlistItems, itemId);
        if(itemData && itemData.groupIds.indexOf(currentGroup) === -1) return; // don't return it if it's in the wrong group
        return itemData
    },
});

export default largeWishlistItemDataState
