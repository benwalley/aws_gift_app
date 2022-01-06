import {DataStore} from "@aws-amplify/datastore";
import {Wishlist} from "../models";


export default async function GetMyWishlist(user) {
    try {
        const username = user.username;
        return await DataStore.query(Wishlist)

    } catch (e) {
        return "failed"
    }
}


