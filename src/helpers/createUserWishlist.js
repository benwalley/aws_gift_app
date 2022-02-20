import {DataStore} from "@aws-amplify/datastore";
import {Wishlist} from "../models";

export default async function createUsersWishlist(owner) {
    try {
        if(!owner.id) return;
        const wishlistData = {
            "ownerId": owner.id
        }
        const response = await DataStore.save(
            new Wishlist(wishlistData)
        );
        return response;
    } catch(e) {
        console.log(e)
    }

}
