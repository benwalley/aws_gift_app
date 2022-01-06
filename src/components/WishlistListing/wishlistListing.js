import React, {useEffect, useState} from 'react';
import { DataStore, Predicates, SortDirection, syncExpression } from 'aws-amplify'
import {Wishlist, WishlistItems} from "../../models";
import {API} from "@aws-amplify/api/lib";
import * as queries from "../../graphql/queries";
import WishlistItem from "../WishlistItem/wishlistItem";
import './wishlistListing.scss'

export default function WishlistListing(props) {
    const { wishlistId } = props;

    const [wishlistItems, setWishlistItems] = useState([]);

    const getWishlistItems = async () => {
        try {
            const wishlistItems = await DataStore.query(WishlistItems, c => c.wishlistID("eq", wishlistId));
            if(wishlistItems && wishlistItems.length > 0) {
                setWishlistItems(wishlistItems)
            }

        } catch(e) {
            // do nothing, it should try again
            console.log(e)
        }
    }

    useEffect(() => {
        getWishlistItems()
    }, [wishlistId])

    return (
        <div className="wishlistListingContainer">
            {wishlistItems.map(item => {
                return <WishlistItem data={item} key={item.id}/>
            })}
        </div>
    );
}

