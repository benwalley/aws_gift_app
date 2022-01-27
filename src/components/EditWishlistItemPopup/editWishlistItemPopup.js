import React, {useEffect, useState} from 'react';
import createStyledInput from "../../helpers/createStyledInput";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import './editWishlistItemPopup.scss'
import TextButton from "../Buttons/TextButton";
import GetMyWishlist from "../../helpers/getWishlists";
import {DataStore} from "aws-amplify";
import {Wishlist, WishlistItems} from "../../models";
import PriorityInput from "../PriorityInput/priorityInput";

export default function EditWishlistItemPopup(props) {
    const {itemData, updateVisibleWishlist, close} = props;
    const [name, setName] = useState('')
    const [imageUrls, setImageUrls] = useState([''])
    const [link, setLink] = useState('')
    const [note, setNote] = useState('')
    const [price, setPrice] = useState('')
    const [priority, setPriority] = useState()

    useEffect(() => {
        setName(itemData.name)
        setPriority(itemData.priority)
        setNote(itemData.note)
        setLink(itemData.link)
        setPrice(itemData.price || '')
        setImageUrls([...itemData.imageUrls])
    }, [])

    const imageUrlInputs = () => {
        const inputs = imageUrls.map((url, index) => {
            return <div key={index} className="themeStyledInput">
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

    const handleRemoveImageUrl = (e, index) => {
        e.preventDefault();
        const imageUrlsCopy = imageUrls;
        imageUrlsCopy.splice(index, 1);
        setImageUrls([...imageUrlsCopy])
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!name) return;
        const original = await DataStore.query(WishlistItems, itemData.id);

        await DataStore.save(
            WishlistItems.copyOf(original, updated => {
                updated.imageUrls = imageUrls;
                updated.name = name;
                updated.note = note;
                updated.price = parseFloat(price);
                updated.priority = priority;
                updated.link = link;
            })
        );
        updateVisibleWishlist()
        close();
    }

    const createStyledInput = (value, displayName, setValue) => {
        return (
            <div className="themeStyledInput">
                <label htmlFor={value}>{displayName}</label>
                <input id={value} type="text" value={value} onChange={(e) => setValue(e.target.value)}/>
            </div>
        )
    }

    return (
        <div>
            <h2>Edit item</h2>
            <form onSubmit={handleSubmit}>
                {createStyledInput(name, 'Item Name', setName)}
                <PriorityInput priority={priority} setPriority={setPriority}/>
                {createStyledInput(note, 'Note', setNote)}
                {createStyledInput(link, 'Link to item', setLink,)}
                {createStyledInput(price, 'Approximate price', setPrice,)}
                <div className="addImages">
                    {imageUrlInputs()}
                    <button type="button" className="addAnotherImageButton" onClick={handleAddAnotherImageUrl}>Add another image url
                    </button>
                </div>
                <div className="updateItemButton">
                    <TextButton displayName={"Update item"} onClick={handleSubmit}/>
                </div>
            </form>
        </div>
    );
}

