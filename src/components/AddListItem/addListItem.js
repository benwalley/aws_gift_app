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
import PriorityInput from "../PriorityInput/priorityInput";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {refreshVisibleWishlistList} from '../../recoil/versionAtoms'
import {subUsersState, usingUserState} from "../../recoil/selectors";

export default function AddListItem(props) {
    const {close} = props;
    const [name, setName] = useState('')
    const [imageUrls, setImageUrls] = useState([''])
    const [link, setLink] = useState('')
    const [note, setNote] = useState('')
    const [price, setPrice] = useState('')
    const [addingToUser, setAddingToUser] = useState(undefined)
    const [priority, setPriority] = useState()
    const usingUser = useRecoilValue(usingUserState)
    const subUsers = useRecoilValue(subUsersState)
    const [visibleListVersion, updateVisibleList] = useRecoilState(refreshVisibleWishlistList)

    useEffect(() => {
        initAddingTo()
    }, [])

    const initAddingTo = async () => {
        if(!usingUser) return
        const id = usingUser.id
        const fetchedUser = await DataStore.query(Users, id);
        setAddingToUser(fetchedUser)
    }


    const createInput = (value, setValue, displayName) => {
        return (
            <div className="addListItemInput">
                <label htmlFor={value}>{displayName}</label>
                <input className="themeInput" id={value} type="text" value={value} onChange={(e) => setValue(e.target.value)}/>
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
                <input className="themeInput" type="text" value={url} onChange={(e) => handleImageUrlFieldChange(e, index)}/>
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
        e.preventDefault()
        if(!name) return;
        // check if wishlist exists for you. If so, get the id
        let myWishlist = await DataStore.query(Wishlist, c => c.ownerId("eq", addingToUser.id));
        if(!myWishlist || myWishlist.length === 0 || !myWishlist[0].id) {
            myWishlist = await createUsersWishlist(addingToUser);
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
            "ownerId": addingToUser.id,
            "wishlistItemComments": [],
            "priority": priority
        }
        const response = await DataStore.save(
            new WishlistItems(itemData)
        );
        updateVisibleList(visibleListVersion + 1)
        close();
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
                <form className="addListItemContent" onSubmit={handleAddItem}>
                    <div className="addListItemScrollingContainer">
                        <h2>Add an item to your wishlist</h2>
                        <div className="addingAsName">
                            <span className="addingName">{`Adding to wishlist: ${GetNameOrEmail(addingToUser)}`}</span>
                            <span className="addToOtherUserButtons">
                                {subUsers && subUsers.map(thisUser => {
                                    return <span key={thisUser.id} className="switchUser" onClick={() => setAddingToUser(thisUser)}>{thisUser.displayName}</span>
                                })}
                            </span>
                        </div>

                            {createInput(name, setName, 'Item Name')}
                            <PriorityInput priority={priority} setPriority={setPriority}/>
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

