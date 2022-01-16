import React, {useEffect, useState} from 'react';
import './wishlistItem.scss'
import formatPrice from "../../helpers/formatPrice";
import IconButton from "../Buttons/IconButton";
import {DataStore} from "@aws-amplify/datastore";
import {WishlistItems} from "../../models";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function WishlistItem(props) {
    const {data, handleSelectWishlistItem, updateMyWishlistItems, count, dbUser} = props

    const getImage = () => {
        if(!data.imageUrls) return '';
        // if there is an image, render it
        return <img className="imageThumbnail" src={data.imageUrls[0]} alt={data.name}/>
    }

    const getPrice = () => {
        const price = formatPrice(data.price)
        if(price === undefined) {
            return ''; // handle price not being a number
        }
        return <p className="price">~ {price}</p>
    }

    const handleItemClick = () => {
        handleSelectWishlistItem(data)
    }

    const handleDelete = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        const id = data.id;

        const toDelete = await DataStore.query(WishlistItems, id);
        await DataStore.delete(toDelete);
        //    refresh data
        updateMyWishlistItems();
    }

    const getClass = () => {
        if(count%2 === 0) {
            return "wishlistListingItemEven"
        } else {
            return "wishlistListingItemOdd"
        }
    }


    return (
        <div
            className={getClass()}
            onClick={handleItemClick}
        >
            {getImage()}
            <h2 className="name">{data.name}</h2>
            {getPrice()}
            {data.ownerId === dbUser.id && <div className="deleteButton">
                <IconButton icon={<FontAwesomeIcon icon={faTrash} size="2x" />} displayName={'delete'} onClick={handleDelete}/>
            </div>}
        </div>
    );
}

