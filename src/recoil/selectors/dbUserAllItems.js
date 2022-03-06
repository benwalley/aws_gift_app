import {DataStore} from "aws-amplify";
import {WishlistItems} from "../../models";
import {refreshVisibleWishlistList} from '../versionAtoms'
import { selector } from "recoil"
import dbUserState from "./dbUser";

const dbUserAllItems = selector({
    key: 'dbUserAllItems',
    get: async ({get}) => {
        const dbUser = get(dbUserState);
        const itemsVersion = get(refreshVisibleWishlistList)

        const items = await DataStore.query(WishlistItems, c => c.ownerId("eq", dbUser.id));
        return items;
    },
});

export default dbUserAllItems
