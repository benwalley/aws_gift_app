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
import WishlistItemLarge from "../WishlistItemLarge/wishlistItemLarge";

export default function Dashboard(props) {
    const {user, myWishlist, myWishlistItems, updateMyWishlistItems} = props
    const [wishlist, setWishlist] = useState(undefined)
    const [wishlistId, setWishlistId] = useState(undefined)
    const [visibleWishlistItemId, setVisibleWishlistItemId] = useState(undefined)
    const [wishlistItems, setWishlistItems] = useState([])



    const handleSelectWishlistItem = (itemData) => {
        setVisibleWishlistItemId(itemData.id)
    }

    const getVisibleWishlistItem = () => {
        if(!visibleWishlistItemId) return;
        return (<div className="visibleWishlistItem">
            <WishlistItemLarge wishlistItemId={visibleWishlistItemId} updateMyWishlistItems={updateMyWishlistItems}/>
        </div>)
    }

    return (
        <div className="dashboardContainer">
            {getVisibleWishlistItem()}
            <div className="wishlistListing">
                <WishlistListing
                    wishlistId={wishlistId}
                    handleSelectWishlistItem={handleSelectWishlistItem}
                    wishlistItems={myWishlistItems}
                    updateMyWishlistItems={updateMyWishlistItems}
                />
            </div>
        </div>
    );
}

