import React, {useEffect, useState} from 'react';
import formatPrice from "../../helpers/formatPrice";
import './wishlistItemLarge.scss'
import TextButton from "../Buttons/TextButton";
import IconButton from "../Buttons/IconButton";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faShoppingCart, faUserFriends } from '@fortawesome/free-solid-svg-icons'
import {DataStore} from "@aws-amplify/datastore";
import {WishlistItems} from "../../models";

export default function WishlistItemLarge(props) {
    const {wishlistItemId, updateMyWishlistItems} = props
    const [data, setData] = useState({})


    useEffect(() => {
        updateWishlistItem()
    }, [wishlistItemId])

    const updateWishlistItem = async () => {
        const item = await DataStore.query(WishlistItems, wishlistItemId);
        setData(item);
    }

    const getPrice = () => {
        if(!data || !data.price) return '';
        const price = formatPrice(data.price)
        if(price === undefined) {
            return ''; // handle price not being a number
        }
        return (
            <div className="priceContainer">
                <p className="priceLabel">Approximate price:</p>
                <p className="priceData">{price}</p>
            </div>
        )
    }

    const getImage = () => {
        if(data && data.imageUrls && data.imageUrls.length > 0) {
            if(data.imageUrls.length >= 1) {
                return (<div className="primaryImage">
                    <img src={data.imageUrls[0]} alt={data.name || "product image"}/>
                </div>)
            }
        }
    }

    const handleDelete = async (e) => {
        e.preventDefault()
        const toDelete = await DataStore.query(WishlistItems, wishlistItemId);
        await DataStore.delete(toDelete);
    //    refresh data
        updateWishlistItem();
        updateMyWishlistItems();
    }

    const handleGetting = async (e) => {
        e.preventDefault()
        const original = await DataStore.query(WishlistItems, wishlistItemId);
        await DataStore.save(
            WishlistItems.copyOf(original, updated => {
                updated.gottenBy = ['Ben']; // TODO: update with proper data. maybe using ids
            })
        );
        updateWishlistItem();
    }

    const handleWantsToGet = async (e) => {
        e.preventDefault()
        const original = await DataStore.query(WishlistItems, wishlistItemId);
        await DataStore.save(
            WishlistItems.copyOf(original, updated => {
                updated.wantsToGet = ['Ben']; // TODO: update with proper data. maybe using ids
            })
        );
        updateWishlistItem();

    }

    const getWantsToGet = () => {
        if(!data || !data.wantsToGet || data.wantsToGet.length === 0) {
            return;
        }
        if(data.wantsToGet.length === 1) {
            return <div>{`${data.wantsToGet[0]} wants someone to go in on this with them.`}</div>
        } else if (data.wantsToGet.length > 1) {
            let wantsToGetNames = '';
            for(let i = 0; i < data.wantsToGet.length; i++) {
                if(i === data.wantsToGet.length - 1) {
                    wantsToGetNames += ` ${data.wantsToGet[i]}`;
                } else {
                    wantsToGetNames += ` ${data.wantsToGet[i]} and`;
                }

            }
            return <div>{`${wantsToGetNames} want someone to go in on this with them.`}</div>
        }
    }


    const getGetting = () => {
        if(!data || !data.gottenBy || data.gottenBy.length === 0) {
            return;
        }
        if(data.gottenBy.length === 1) {
            return <div>{`${data.gottenBy[0]} is getting this.`}</div>
        } else if (data.gottenBy.length > 1) {
            let gottenByNames = '';
            for(let i = 0; i < data.gottenBy.length; i++) {
                if(i === data.gottenBy.length - 1) {
                    gottenByNames += ` ${data.gottenBy[i]}`;
                } else {
                    gottenByNames += ` ${data.gottenBy[i]} and`;
                }

            }
            return <div>{`${gottenByNames} are getting this.`}</div>
        }
    }

    const getLink = () => {
        if( data && data.link) {
            return (
                <a href={data.link} aria-label="this is a test" target="_blank`">Link to product</a>
            )
        }
    }

    const getName = () => {
        if(data && data.name) {
            return <h2 className="name">{data.name}</h2>
        }
    }

    const getNote = () => {
        if(!data || !data.note) return;
        return <div className="notes">{data.note}</div>
    }


    return (
        !data ? <div></div> :
        <div className="largeWishlistItemContainer">
            {getName()}
            {getImage()}
            <div className="actionButtons">
                <div>
                    <IconButton onClick={handleGetting} displayName={"Get This"} icon={<FontAwesomeIcon icon={faShoppingCart} size="2x" />}/>
                </div>
                <div>
                    <IconButton onClick={handleWantsToGet} displayName={"Want to get this"} icon={<FontAwesomeIcon icon={faUserFriends} size="2x" />}/>
                </div>
                <div className="deleteButton">
                    <IconButton onClick={handleDelete} displayName={"Delete"} icon={<FontAwesomeIcon icon={faTrashAlt} size="2x" />}/>
                </div>
            </div>
            <div className="information">
                {getPrice()}
                {getLink()}
            </div>
            {getNote()}
            <div className="extras">
                <div className="wantsToGet">{getWantsToGet()}</div>
                <div className="getting">{getGetting()}</div>
            </div>
        </div>
    );
}

