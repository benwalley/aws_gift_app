import React, {useEffect, useState} from 'react';
import './wishlistItem.scss'
import formatPrice from "../../helpers/formatPrice";

export default function WishlistItem(props) {
    const {data} = props

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
        console.log(data)
        console.log("clicked " + data.name)
    }


    return (
        <div
            className="wishlistListingItem"
            onClick={handleItemClick}
        >
            {getImage()}
            <h2 className="name">{data.name}</h2>
            {getPrice()}
        </div>
    );
}

