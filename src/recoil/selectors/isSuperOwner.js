import {DataStore} from "aws-amplify";
import {Users} from "../../models";
import {dbUserState} from "./";
import { selector } from "recoil"
import usingUserState from "./usingUser";
import visibleWishlistState from "./visibleWishlist";


const isSuperOwner = selector({
    key: 'isSuperOwner',
    get: async ({get}) => {
       const dbUser = get(dbUserState);
       if(!dbUser) return
       const visibleWishlist = get(visibleWishlistState);
       if(!visibleWishlist) return;
       const wishlistOwner =  await DataStore.query(Users, visibleWishlist.ownerId);
        if(!wishlistOwner) return;
       return wishlistOwner.isSubUser && wishlistOwner.parentUserId === dbUser.id
    },
});

export default isSuperOwner
