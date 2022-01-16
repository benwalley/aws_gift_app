import React, {useEffect, useState} from 'react';
import { DataStore, Predicates, SortDirection, syncExpression } from 'aws-amplify'
import {WishlistItems, Wishlist, Users} from '../../models';
import GetMyWishlist from "../../helpers/getWishlists";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import './addListItem.scss'
import TextButton from "../Buttons/TextButton";
import createUsersWishlist from "../../helpers/createUserWishlist";
import GetNameOrEmail from "../../helpers/getNameOrEmail";

export default function AddListItem(props) {
    const {user, close, updateVisibleWishlist, visibleWishlist, usingUser, authUser, addError, addSuccess} = props;
    const [name, setName] = useState('')
    const [imageUrls, setImageUrls] = useState([''])
    const [link, setLink] = useState('')
    const [note, setNote] = useState('')
    const [price, setPrice] = useState('')
    const [addingToUser, setAddingToUser] = useState(undefined)
    const [otherUsers, setOtherUsers] = useState([])

    useEffect(() => {
        setAddingToUser(usingUser)
        updateOtherUsers()
    }, [usingUser])

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
                <button type="button" className="removeImageUrl"
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

    const handleAddItem = async (e) => {
        //TODO: handle verifying there is at least a name set
        e.preventDefault()
        if(!name || !visibleWishlist || !visibleWishlist.ownerId) return;
        // check if wishlist exists for you. If so, get the id
        let myWishlist = await DataStore.query(Wishlist, c => c.ownerId("eq", addingToUser.id));
        if(!myWishlist || myWishlist.length === 0 || !myWishlist[0].id) {
            myWishlist = await createUsersWishlist(addingToUser.id);
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
            "wishlistId": wishlistId,
            "ownerId": usingUser.id,
            "wishlistItemComments": []
        }
        const response = await DataStore.save(
            new WishlistItems(itemData)
        );
        close();
        updateVisibleWishlist();
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

    const updateOtherUsers = async () => {
        const gottenOtherUsers = await DataStore.query(Users, c => c.parentUserId("eq", authUser.id));
        setOtherUsers(gottenOtherUsers)

    }

    return (
        <div className="addListItemContainer" >
            <div className="addListItemBackground" onClick={close}></div>
            <form className="addListItemContent" onSubmit={handleAddItem}>
                <div className="addListItemScrollingContainer">
                    <h2>Add an item to your wishlist</h2>
                    <div className="addingAsName">
                        <span className="addingName">{`Adding to wishlist: ${GetNameOrEmail(addingToUser)}`}</span>
                        <span className="addToOtherUserButtons">
                            {otherUsers.map(thisUser => {
                                return <span key={thisUser.id} className="switchUser" onClick={() => setAddingToUser(thisUser)}>{thisUser.displayName}</span>
                            })}
                        </span>
                    </div>

                        {createInput(name, setName, 'Item Name')}
                        {createInput(note, setNote, 'Note')}
                        {createInput(link, setLink, 'Link to item')}
                        {createInput(price, setPrice, 'Approximate price')}
                        <div className="addImages">
                            {imageUrlInputs()}
                            <button type="button" className="addAnotherImageButton" onClick={handleAddAnotherImageUrl}>Add another image url</button>
                        </div>

                </div>
                <div className="addItemButton">
                    <TextButton displayName={"Add Item"} onClick={handleAddItem}/>
                </div>
            </form>
        </div>
    );
}

