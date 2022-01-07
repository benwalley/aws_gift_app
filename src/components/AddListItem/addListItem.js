import React, {useEffect, useState} from 'react';
import { DataStore, Predicates, SortDirection, syncExpression } from 'aws-amplify'
import { WishlistItems, Wishlist } from '../../models';
import GetMyWishlist from "../../helpers/getWishlists";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import './addListItem.scss'
import TextButton from "../Buttons/TextButton";

export default function AddListItem(props) {
    const {user, close, updateMyWishlistItems} = props;
    const [name, setName] = useState('')
    const [imageUrls, setImageUrls] = useState([''])
    const [link, setLink] = useState('')
    const [note, setNote] = useState('')
    const [price, setPrice] = useState('')

    const createInput = (value, setValue, displayName) => {
        return (
            <div className="addListItemInput">
                <label htmlFor={value}>{displayName}</label>
                <input id={value} type="text" value={value} onChange={(e) => setValue(e.target.value)}/>
            </div>
        )
    }

    const handleRemoveImageUrl = (e, index) => {
        e.preventDefault();
        const imageUrlsCopy = imageUrls;
        imageUrlsCopy.splice(index, 1);
        setImageUrls([...imageUrlsCopy])
    }

    const imageUrlInputs = () => {
        const inputs = imageUrls.map((url, index) => {
            return <div key={index} className="addImagesInput">
                <input type="text" value={url} onChange={(e) => handleImageUrlFieldChange(e, index)}/>
                <button className="removeImageUrl"
                        onClick={(e) => handleRemoveImageUrl(e, index)}
                        aria-label="remove image url">
                    <FontAwesomeIcon icon={faTimesCircle} size="2x"/>
                </button>
            </div>
        })
        return (<div className="addListItemInput">
            <p className="addImagesTitle">Add Image Urls</p>
            {inputs}
        </div>)
    }

    const createUsersWishlist = async (user) => {
        const wishlistData = {
            "ownerId": user.username,
            "ownerName": "ben"
        }
        const response = await DataStore.save(
            new Wishlist(wishlistData)
        );
        return response;
    }

    const handleAddItem = async (e) => {
        //TODO: handle verifying there is at least a name set
        e.preventDefault()
        // check if wishlist exists for you. If so, get the id
        let myWishlist = await GetMyWishlist(user)
        if(!myWishlist || !myWishlist[0].id) {
            myWishlist = await createUsersWishlist(user);
        } else {
            myWishlist = myWishlist[0]
        }
        const wishlistId = myWishlist.id
        // if it doesn't create one and get the id
        const itemData = {
            "imageUrls": imageUrls,
            "images": [],
            "name": name,
            "link": link,
            "note": note,
            "gottenBy": [],
            "wantsToGet": [],
            "price": parseFloat(price),
            "wishlistID": wishlistId,
            "wishlistItemComments": []
        }
        const response = await DataStore.save(
            new WishlistItems(itemData)
        );
        close();
        updateMyWishlistItems();
    }

    const handleImageUrlFieldChange = (e, index) => {
        const newValue = e.target.value;
        const imageUrlsCopy = imageUrls;
        imageUrlsCopy[index] = newValue;
        setImageUrls([...imageUrlsCopy]);
    }

    const handleAddAnotherImageUrl = (e) => {
        e.preventDefault()
        const imageUrlsCopy = imageUrls;
        imageUrlsCopy.push('');
        setImageUrls([...imageUrlsCopy])
    }

    return (
        <div className="addListItemContainer" >
            <div className="addListItemBackground" onClick={close}></div>
            <div className="addListItemContent">
                <div className="addListItemScrollingContainer">
                    <h2>Add an item to your wishlist</h2>
                    <form action="">
                        {createInput(name, setName, 'Item Name')}
                        {createInput(note, setNote, 'Note')}
                        {createInput(link, setLink, 'Link to item')}
                        {createInput(price, setPrice, 'Approximate price')}
                        <div className="addImages">
                            {imageUrlInputs()}
                            <button className="addAnotherImageButton" onClick={handleAddAnotherImageUrl}>Add another image url</button>
                        </div>
                    </form>
                </div>
                <div className="addItemButton">
                    <TextButton displayName={"Add Item"} onClick={handleAddItem}/>
                </div>
            </div>
        </div>
    );
}

