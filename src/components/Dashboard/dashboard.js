import React, {useEffect, useState, useCallback} from 'react';
import WishlistListing from "../WishlistListing/wishlistListing";
import './dashboard.scss'
import WishlistItemLarge from "../WishlistItemLarge/wishlistItemLarge";
import {DataStore} from "@aws-amplify/datastore";
import {Comments, Users, Wishlist, WishlistItems} from "../../models";
import GetNameOrEmail from "../../helpers/getNameOrEmail";
import CommentsComponent from "../CommentsComponent/commentsComponent";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useNavigate
} from "react-router-dom";
import createUsersWishlist from "../../helpers/createUserWishlist";
import {useRecoilState, useRecoilValue} from "recoil";
import {visibleWishlistState, dbUserState, visibleWishlistDisplayNameState} from "../../recoil/selectors";
import {visibleWishlistIDState} from "../../recoil/atoms";

export default function Dashboard(props) {
    const {} = props;
    // The currently visible wishlist
    const visibleWishlist = useRecoilValue(visibleWishlistState); // data for the wishlist currently being displayed
    const dbUser = useRecoilValue(dbUserState);
    const visibleWishlistDisplayName = useRecoilValue(visibleWishlistDisplayNameState);
    const [visibleWishlistId, setVisibleWishlistId] = useRecoilState(visibleWishlistIDState)

    let { wishlistId, itemId } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        redirectToWishlistIfNeeded() // this will make sure you are on a wishlist page. At the moment, there are no pages that are not wishlists
    }, [wishlistId, itemId])

    const redirectToWishlistIfNeeded = async () => {
        if(!dbUser) return false;
        let goodWishlist = false;
        if(wishlistId) {
            // check if it is for a real wishlist
            const wishlist = await DataStore.query(Wishlist, wishlistId);
            //TODO: Handle way to see shared lists
            const theUser = await DataStore.query(Users, dbUser.id);
            if(wishlist && wishlist.groupId === theUser.groupId) goodWishlist = true; // if it's not in the user's group, you can't see it
        }
        // If there is no wishlist id, or if the id is not good, find the user's wishlist
        if(!wishlistId || !goodWishlist) {
            const wishlists = await DataStore.query(Wishlist, c => c.ownerId("eq", dbUser.id));
            let newWishlist
            if(!wishlists || wishlists.length === 0) {
                // if the user doesn't have a wishlist yet, create one
                const theUser = await DataStore.query(Users, dbUser.id);
                newWishlist = await createUserWishlistIfNeeded(theUser)
            }
            const theWishlist = newWishlist ?? wishlists[0] // the wishlist now represents the viewedWishlist
            navigate(`/${theWishlist.id}`)
        }
        setVisibleWishlistId(wishlistId)
        return true;
    }

    // should only be done once when the page is loaded
    const createUserWishlistIfNeeded = async (newDbUser) => {
        if(!dbUser) return;
        if(!newDbUser) newDbUser = await DataStore.query(Users, dbUser.id);;
        if(!newDbUser || !newDbUser.id) return;
        try {
            const wishlists = await DataStore.query(Wishlist, c => c.ownerId("eq", newDbUser.id));
            if(!wishlists || wishlists.length === 0 ) {
                //   create an empty wishlist for the user
                const newWishlist = await createUsersWishlist(newDbUser)
                return newWishlist
            }
            return wishlists[0]
        } catch(e) {

        }
    }

    const getVisibleWishlistItem = () => {
        if(!itemId) return;
        return (<div className="visibleWishlistItem">
            <WishlistItemLarge/>
        </div>)
    }


    return (
            <div className="dashboardContainer">
                {visibleWishlist && <h1 className="dashboardTitle">{visibleWishlistDisplayName}</h1>}
                <div className="leftColumn"></div>
                <div className="visibleWishlistItem">
                    {getVisibleWishlistItem()}
                </div>
                <div className="wishlistListing">
                    <WishlistListing/>
                </div>
                <div className="wishlistCommentsContainer">
                    <CommentsComponent
                        commenterId={dbUser.id}
                        wishlist={visibleWishlist}
                    />
                </div>
            </div>
    );
}

