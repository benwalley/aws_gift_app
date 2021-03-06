import React, {useEffect, useState, Suspense} from 'react';
import { DataStore } from 'aws-amplify'
import {WishlistItems, Wishlist, Users} from '../../models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronDown, faTimes, faTimesCircle} from '@fortawesome/free-solid-svg-icons'
import './addListItem.scss'
import TextButton from "../Buttons/TextButton";
import createUsersWishlist from "../../helpers/createUserWishlist";
import GetNameOrEmail from "../../helpers/getNameOrEmail";
import PriorityInput from "../PriorityInput/priorityInput";
import {useRecoilValueLoadable, useSetRecoilState} from "recoil";
import {dbUserState, subUsersState, updateVisibleWishlist, usingUserState} from "../../recoil/selectors";
import currentGroupState from "../../recoil/selectors/currentGroup";
import GroupMultiSelect from "../GroupMultiSelect/groupMultiSelect";

export default function AddListItem(props) {
    const {close} = props;
    const [name, setName] = useState('')
    const [imageUrls, setImageUrls] = useState([''])
    const [link, setLink] = useState('')
    const [note, setNote] = useState('')
    const [price, setPrice] = useState('')
    const [addingToUser, setAddingToUser] = useState(undefined)
    const [priority, setPriority] = useState()
    const [selectedGroups, setSelectedGroups] = useState([])
    const usingUserUpdate = useRecoilValueLoadable(usingUserState)
    const subUsersUpdate = useRecoilValueLoadable(subUsersState)
    const updateVisibleList = useSetRecoilState(updateVisibleWishlist)
    const dbUserUpdate = useRecoilValueLoadable(dbUserState);
    const currentGroupUpdate = useRecoilValueLoadable(currentGroupState)

    // State values
    const [dbUser, setDbUser] = useState()
    const [usingUser, setUsingUser] = useState()
    const [subUsers, setSubUsers] = useState()
    const [currentGroup, setCurrentGroup] = useState()
    const [userGroupSectionOpen, setUserGroupSectionOpen] = useState()


    useEffect(() => {
        if(dbUserUpdate.state === "hasValue") {
            setDbUser(dbUserUpdate.contents);
        }
    }, [dbUserUpdate]);

    useEffect(() => {
        if(usingUserUpdate.state === "hasValue") {
            setUsingUser(usingUserUpdate.contents);
        }
    }, [usingUserUpdate]);

    useEffect(() => {
        if(subUsersUpdate.state === "hasValue") {
            setSubUsers(subUsersUpdate.contents);
        }
    }, [subUsersUpdate]);

    useEffect(() => {
        if(currentGroupUpdate.state === "hasValue") {
            setCurrentGroup(currentGroupUpdate.contents);
            setSelectedGroups([currentGroupUpdate.contents])
        }
    }, [currentGroupUpdate]);

    useEffect(() => {
        initAddingTo()
    }, [usingUser])

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
            "priority": priority,
            'groupIds': selectedGroups.map(g => g.id)
        }
        const response = await DataStore.save(
            new WishlistItems(itemData)
        );
        updateVisibleList()
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
            {addingToUser && <form className="addListItemContent" onSubmit={handleAddItem}>
                <button className="closeModal" onClick={close} aria-label="close"><FontAwesomeIcon icon={faTimes} size="xl"/></button>
                <div className="addListItemScrollingContainer">
                    <h2>Add an item to your wishlist</h2>
                    <div className="dropdownToggle" onClick={() => setUserGroupSectionOpen(!userGroupSectionOpen)}>
                        <span className="title">Adding to: </span>
                        <span className="addingToUserBubble">{addingToUser.displayName}</span>
                        <span className="title">Groups:</span>
                        {selectedGroups.map(group => {
                            return <span className="addingToUserBubble">{group.groupName}</span>
                        })}
                        <span className={userGroupSectionOpen ? "dropdownToggleArrowOpen" : "dropdownToggleArrow"}><FontAwesomeIcon icon={faChevronDown} size="1x"/></span>
                    </div>
                    {userGroupSectionOpen && <div className="dropdownContent">
                        <div className="addingAsName">
                        <span className="addingName">
                            <span className="selectNameAndGroupTitle">Set wishlist: </span>
                        </span>
                        <span className="addToOtherUserButtons">
                            {subUsers && [...subUsers, dbUser].map(thisUser => {
                                if(thisUser.id === addingToUser.id) return
                                return <span key={thisUser.id} className="switchUser" onClick={() => setAddingToUser(thisUser)}>{thisUser.displayName}</span>
                            })}
                        </span>
                        </div>
                        <div className="selectGroups">
                            <h4 className="selectNameAndGroupTitle">Set group(s)</h4>
                            <GroupMultiSelect selectedGroups={selectedGroups} setSelectedGroups={setSelectedGroups} userId={addingToUser.id}/>
                        </div>
                    </div>}

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
            </form>}
        </div>
    );
}

