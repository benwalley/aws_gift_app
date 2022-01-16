import React, {useEffect, useState, useCallback} from 'react';
import WishlistListing from "../WishlistListing/wishlistListing";
import './dashboard.scss'
import WishlistItemLarge from "../WishlistItemLarge/wishlistItemLarge";
import {DataStore} from "@aws-amplify/datastore";
import {Comments, Users} from "../../models";
import GetNameOrEmail from "../../helpers/getNameOrEmail";
import CommentsComponent from "../CommentsComponent/commentsComponent";

export default function Dashboard(props) {
    const {user, dbUser, usingUser, visibleWishlist, visibleWishlistItems, updateVisibleWishlist, setLargeWishlistItemId, largeWishlistItemData} = props;
    const [wishlistDisplayName, setWishlistDisplayName] = useState('loading...')

    useEffect(() => {
        updateUserName()
    }, [visibleWishlist, user])

    const handleSelectWishlistItem = (itemData) => {
        setLargeWishlistItemId(itemData.id)
    }

    const getVisibleWishlistItem = () => {
        if(!largeWishlistItemData || !largeWishlistItemData.id) return;
        return (<div className="visibleWishlistItem">
            <WishlistItemLarge
                wishlistItemId={largeWishlistItemData.id}
                updateVisibleWishlist={updateVisibleWishlist}
                isOwner={user && visibleWishlist && user.id === largeWishlistItemData.ownerId}
                isCreator={largeWishlistItemData.ownerId === user.id}
                user={user}
                usingUser={usingUser}
                data={largeWishlistItemData}
                dbUser={dbUser}
            />
        </div>)
    }

    const updateUserName = async () => {
        try {
            const user = await DataStore.query(Users, visibleWishlist.ownerId);
            setWishlistDisplayName(GetNameOrEmail(user));
        } catch(e) {
            return "loading..."
        }
    }

    return (
        <div className="dashboardContainer">
            {visibleWishlist && <h1 className="dashboardTitle">{wishlistDisplayName}</h1>}
            <div className="visibleWishlistItem">
                {getVisibleWishlistItem()}
            </div>
            <div className="wishlistListing">
                <WishlistListing
                    visibleWishlist={visibleWishlist}
                    handleSelectWishlistItem={handleSelectWishlistItem}
                    wishlistItems={visibleWishlistItems}
                    updateVisibleWishlist={updateVisibleWishlist}
                    dbUser={dbUser}
                />
            </div>
            {visibleWishlist && <CommentsComponent wishlist={visibleWishlist} commenterId={dbUser.id} usingUser={usingUser} dbUser={dbUser}/>}
        </div>
    );
}

