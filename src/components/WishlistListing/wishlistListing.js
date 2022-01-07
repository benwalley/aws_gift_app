import React, {useEffect, useState} from 'react';
import { DataStore, Predicates, SortDirection, syncExpression } from 'aws-amplify'
import {Wishlist, WishlistItems} from "../../models";
import {API} from "@aws-amplify/api/lib";
import * as queries from "../../graphql/queries";
import WishlistItem from "../WishlistItem/wishlistItem";
import './wishlistListing.scss'

export default function WishlistListing(props) {
    const { wishlistId, handleSelectWishlistItem, wishlistItems } = props;



    return (
        <div className="wishlistListingContainer">
            {wishlistItems.map(item => {
                return <WishlistItem
                    data={item}
                    key={item.id}
                    handleSelectWishlistItem={handleSelectWishlistItem}
                />
            })}
        </div>
    );
}

