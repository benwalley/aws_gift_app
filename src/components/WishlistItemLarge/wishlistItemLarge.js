import React, {useEffect, useState} from 'react';
import formatPrice from "../../helpers/formatPrice";
import './wishlistItemLarge.scss'
import TextButton from "../Buttons/TextButton";
import IconButton from "../Buttons/IconButton";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faShoppingCart, faUserFriends, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import {DataStore} from "@aws-amplify/datastore";
import {WishlistItems} from "../../models";
import Modal from "../Modal/modal";
import createStyledInput from "../../helpers/createStyledInput";
import EditWishlistItemPopup from "../EditWishlistItemPopup/editWishlistItemPopup";
import CommentsComponent from "../CommentsComponent/commentsComponent";
import PriorityDisplay from "../PriorityInput/priorityDisplay";
import UserNameBubble from "./UserNameBubble/userNameBubble";
import {
    useParams,
    useNavigate
} from "react-router-dom";
import {useRecoilState, useRecoilValue, useRecoilValueLoadable, useSetRecoilState} from "recoil";
import {
    dbUserState,
    largeWishlistItemDataState,
    updateLargeWishlistItemVersion,
    usingUserState,
    visibleWishlistState
} from "../../recoil/selectors";
import {largeWishlistItemIdState, visibleWishlistIDState} from "../../recoil/atoms";
import {isSuperOwner} from "../../recoil/selectors/"


export default function WishlistItemLarge(props) {
    const {} = props
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const dataUpdate = useRecoilValueLoadable(largeWishlistItemDataState)
    const setLargeWishlistItemId = useSetRecoilState(largeWishlistItemIdState)
    const usingUserUpdate = useRecoilValueLoadable(usingUserState)
    const updateLargeItem = useSetRecoilState(updateLargeWishlistItemVersion)
    const visibleWishlistUpdate = useRecoilValueLoadable((visibleWishlistState))
    let { wishlistId, itemId } = useParams();
    const isSuperUpdate = useRecoilValueLoadable(isSuperOwner)
    const navigate = useNavigate()
    const [isSuper, setIsSuper] = useState(false)
    const [visibleWishlist, setVisibleWishlist] = useState()
    const [usingUser, setUsingUser] = useState()
    const [data, setData] = useState()

    useEffect(() => {
        setLargeWishlistItem()
    }, [wishlistId, itemId])

    useEffect(() => {
        if(isSuperUpdate.state === "hasValue") {
            setIsSuper(isSuperUpdate.contents);
        }
    }, [isSuperUpdate]);

    useEffect(() => {
        if(visibleWishlistUpdate.state === "hasValue") {
            setVisibleWishlist(visibleWishlistUpdate.contents);
        }
    }, [visibleWishlistUpdate]);

    useEffect(() => {
        if(usingUserUpdate.state === "hasValue") {
            setUsingUser(usingUserUpdate.contents);
        }
    }, [usingUserUpdate]);

    useEffect(() => {
        if(dataUpdate.state === "hasValue") {
            setData(dataUpdate.contents);
        }
    }, [dataUpdate]);

    const setLargeWishlistItem = () => {
        if(!wishlistId || !itemId) return;
        setLargeWishlistItemId(itemId)
    }

    const getPrice = () => {
        if(!data || !data.price) return '';
        const price = formatPrice(data.price)
        if(price === undefined) {
            return ''; // handle price not being a number
        }
        return (
            <div className="priceContainer">
                <h3 className="priceLabel">Approximate price:</h3>
                <p className="priceData">{price}</p>
            </div>
        )
    }

    const getImage = () => {
        try {
            if(data && data.imageUrls && data.imageUrls.length > 0) {
                if(data.imageUrls.length >= 1 && data.imageUrls[0] !== "") {
                    return (<div className="primaryImage">
                        <img src={data.imageUrls[selectedImageIndex]} alt={data.name || "product image"}/>
                    </div>)
                }
            }
        } catch(e) {
            return
        }

    }

    const selectImage = (index) => {
        setSelectedImageIndex(index)
    }

    const getOtherImages = () => {
        if(data && data.imageUrls && data.imageUrls.length > 0) {
            if(data.imageUrls.length > 1) {
                return <div className="imageList">
                    {data.imageUrls.map((image, index) => {
                        return (<div key={index} onClick={() => selectImage(index)} className={index === selectedImageIndex ? "imageListItemSelected" : "imageListItem"}>
                            <img src={image} alt={data.name || "product image"}/>
                        </div>)
                    })}
                </div>

            }
        }
    }

    const handleDelete = async (e) => {
        if(!data) return;
        e.preventDefault()
        const toDelete = await DataStore.query(WishlistItems, data.id);
        await DataStore.delete(toDelete);
        // refresh data
        navigate(`/${wishlistId}`)
    }

    const handleGetting = async (e) => {
        if(!usingUser) return;
        e.preventDefault()
        const original = await DataStore.query(WishlistItems, data.id);
        const gottenByList = [...original.gottenBy]
        let alreadyGotten = false;
        for(let i = 0; i < gottenByList.length; i++) {
            const gottenItem = gottenByList[i]
            if(gottenItem === usingUser.id) {
                alreadyGotten = true;
                gottenByList.splice(i, 1)
            }
        }
        if(!alreadyGotten) {
            gottenByList.push(usingUser.id)
        }

        await DataStore.save(
            WishlistItems.copyOf(original, updated => {
                updated.gottenBy = [... new Set(gottenByList)]; //
            })
        );
        updateLargeItem()
    }

    const handleWantsToGet = async (e) => {
        if(!usingUser || !data) return;
        try {
            e.preventDefault()
            const original = await DataStore.query(WishlistItems, data.id);
            const wantsList = [...original.wantsToGet]
            let alreadyGotten = false;
            for(let i = 0; i < wantsList.length; i++) {
                const gottenItem = wantsList[i]
                if(gottenItem === usingUser.id) {
                    alreadyGotten = true;
                    wantsList.splice(i, 1)
                }
            }
            if(!alreadyGotten) {
                wantsList.push(usingUser.id)
            }
            await DataStore.save(
                WishlistItems.copyOf(original, updated => {
                    updated.wantsToGet = [...new Set(wantsList)];
                })
            );
            updateLargeItem()
        } catch(e) {
            console.log(e)
        }
    }

    const getWantsToGet = () => {
        try {
            if(!data || !data.wantsToGet || data.wantsToGet.length === 0) {
                return;
            }
            return data.wantsToGet.map((person) => {
                return <UserNameBubble key={person} id={person} classString={"electricBlue"}/>
            })
        } catch(e) {
            console.log(e)
        }
    }


    const getGetting = () => {
        try {
            if(!data || !data.gottenBy || data.gottenBy.length === 0) {
                return;
            }
            return data.gottenBy.map(person => {
                return <UserNameBubble key={person} id={person} classString={"pinkBubble"}/>
            })
        } catch(e) {
            console.log(e)
        }

    }

    const getLink = () => {
        if( data && data.link) {
            return (
                <a className="link" href={data.link} aria-label={data.name} target="_blank`">Link to product</a>
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
        return <div className="notes">
            <h3>Notes</h3>
            <div>
                {data.note}
            </div>
        </div>
    }

    // only if the using user is the one who created the wishlist
    const isOwner = () => {
        if(!usingUser) return
        return usingUser.id === visibleWishlist.ownerId;
    }

    return (
        !data || !itemId ? <div></div> :
        <div className="largeWishlistItemContainer">
            <div className="nameContainer">
                {getName()}
                <PriorityDisplay priority={data.priority} showName={true}showVisual={true}/>
            </div>
            <div className="imagesContainer">
                {getImage()}
                {getOtherImages()}
            </div>

            <div className="actionButtons">
                {!isOwner() && <div>
                    <IconButton onClick={handleGetting} displayName={"Get This"} icon={<FontAwesomeIcon icon={faShoppingCart} size="2x" />}/>
                </div>}
                {(isOwner() || isSuper) && <div>
                    <IconButton onClick={() => setEditModalOpen(true)} displayName={"Edit"} icon={<FontAwesomeIcon icon={faPencilAlt} size="2x" />}/>
                </div>}
                {!isOwner() && <div>
                    <IconButton onClick={handleWantsToGet} displayName={"Want to get this"} icon={<FontAwesomeIcon icon={faUserFriends} size="2x" />}/>
                </div>}
                {(isOwner() || isSuper) && <div className="deleteButton">
                    <IconButton onClick={handleDelete} displayName={"Delete"} icon={<FontAwesomeIcon icon={faTrashAlt} size="2x" />}/>
                </div>}
            </div>
            {(getPrice() || getLink()) && <div className="information">
                {getPrice()}
                {getLink()}
            </div>}
            {getNote()}
            <div className="extras">
                {data.wantsToGet && data.wantsToGet.length > 0 && <div className="wantsToGet">
                    <h3>Want to go in on this:</h3>
                    <div className="wantsToGetList">
                        {getWantsToGet()}
                    </div>
                </div>}
                {data.gottenBy && data.gottenBy.length > 0 && <div className="getting">
                    <h3>Getting this:</h3>
                    <div className="gettingList">
                        {getGetting()}
                    </div>
                </div>}
            </div>
            {data && data.id && <CommentsComponent
                wishlistItem={data}
                commenterId={12}
            />}
            <Modal close={() => setEditModalOpen(false)} isOpen={editModalOpen}>
                <EditWishlistItemPopup
                    itemData={data}
                    close={() => setEditModalOpen(false)}
                 />
            </Modal>
        </div>
    );
}

