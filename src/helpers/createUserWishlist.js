import {DataStore} from "@aws-amplify/datastore";
import {Wishlist} from "../models";

export default async function createUsersWishlist(ownerId) {
    try {
        if(!ownerId) return;
        const wishlistData = {
            "ownerId": ownerId
        }
        const response = await DataStore.save(
            new Wishlist(wishlistData)
        );
        return response;
    } catch(e) {
        console.log(e)
    }

}
