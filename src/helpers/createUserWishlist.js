import {DataStore} from "@aws-amplify/datastore";
import {Wishlist} from "../models";

export default async function createUsersWishlist(owner) {
    try {
        if(!owner.id|| !owner.groupId) return;
        const wishlistData = {
            "ownerId": owner.id,
            "groupId": owner.groupId
        }
        const response = await DataStore.save(
            new Wishlist(wishlistData)
        );
        return response;
    } catch(e) {
        console.log(e)
    }

}
