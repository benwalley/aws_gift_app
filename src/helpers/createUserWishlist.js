import {DataStore} from "@aws-amplify/datastore";
import {Wishlist} from "../models";

export default async function createUsersWishlist(user) {
    const wishlistData = {
        "ownerId": user.username,
        "ownerName": "ben"
    }
    const response = await DataStore.save(
        new Wishlist(wishlistData)
    );
    return response;
}
