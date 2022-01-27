import {DataStore} from "aws-amplify";
import {Groups, Users, WishlistItems} from "../../models";
import { selector } from "recoil"
import visibleWishlistState from "./visibleWishlist";
import {largeWishlistItemVersion} from "../versionAtoms";
import dbUserState from "./dbUser";

const yourGroupInvites = selector({
    key: 'yourGroupInvites',
    get: async ({get}) => {
        const dbUser = get(dbUserState)
        console.log(dbUser)
        const groups =  await DataStore.query(Groups, c => c.invitedIds("contains", dbUser.id));
        return groups;
    },
});

export default yourGroupInvites
