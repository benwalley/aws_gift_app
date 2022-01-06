import React, {useEffect, useState, useCallback} from 'react';
import { DataStore, Predicates, SortDirection, syncExpression } from 'aws-amplify'
import {Wishlist, WishlistItems} from "../../models";
import { API } from 'aws-amplify';
import * as queries from '../../graphql/queries'
import {graphqlOperation} from "@aws-amplify/api-graphql/lib";
import * as mutations from '../../graphql/mutations';
import {listWishlists} from "../../graphql/queries";
import AddListItem from "../AddListItem/addListItem";
import WishlistListing from "../WishlistListing/wishlistListing";
import GetMyWishlist from "../../helpers/getWishlists";
import createUsersWishlist from "../../helpers/createUserWishlist";
import Header from "../Header/header";
import './dashboard.scss'

export default function Dashboard(props) {
    const {user} = props
    const [wishlist, setWishlist] = useState(undefined)
    const [wishlistId, setWishlistId] = useState(undefined)

    const getMyWishlist = async () => {
        try {
            const myWishlists = await DataStore.query(Wishlist, c => c.ownerId("eq", user.username));
            if(myWishlists && myWishlists.length > 0) {
                setWishlistId(myWishlists[0].id)
                setWishlist(myWishlists[0])
            } else if (myWishlists && myWishlists.length === 0) {
                // this means the query returned, but there are no wishlists created yet
                const myWishlist = await createUsersWishlist(user);
                setWishlistId(myWishlist.id)
                setWishlist(myWishlist)
                console.log("I hit this when I shouldn't have")
            }

        } catch(e) {
            // do nothing, it should try again
            console.log(e)
        }
    }

    useEffect(() => {
        getMyWishlist()
    }, [user])

    return (
        <div className="dashboardContainer">
            <div className="wishlistListing">
                <WishlistListing wishlistId={wishlistId}/>
            </div>
        </div>
    );
}

