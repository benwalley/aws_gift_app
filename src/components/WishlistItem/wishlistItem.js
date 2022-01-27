import React, {useEffect, useState, Suspense} from 'react';
import './wishlistItem.scss'
import formatPrice from "../../helpers/formatPrice";
import IconButton from "../Buttons/IconButton";
import {DataStore} from "@aws-amplify/datastore";
import {Comments, WishlistItems} from "../../models";
import {faCheck, faComment, faTimesCircle, faTrash, faUserFriends} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PriorityDisplay from "../PriorityInput/priorityDisplay";
import {
    useParams,
    useNavigate
} from "react-router-dom";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {dbUserState, updateLargeWishlistItemVersion} from "../../recoil/selectors";
import {refreshNumberOfComments, refreshVisibleWishlistList} from "../../recoil/versionAtoms";

export default function WishlistItem(props) {
    const {data, count} = props
    const [numberOfComments, setNumberOfComments] = useState();
    const dbUser = useRecoilValue(dbUserState)
    let { wishlistId } = useParams();
    const [visibleListVersion, updateVisibleList] = useRecoilState(refreshVisibleWishlistList)
    const numCommentsVersion = useRecoilValue(refreshNumberOfComments)
    const updateLargeItem = useSetRecoilState(updateLargeWishlistItemVersion)
    const navigate = useNavigate()


    useEffect(() => {
        updateNumberOfComments()
    }, [data, numCommentsVersion])

    const updateNumberOfComments = async () => {
        if(!dbUser) return;
        try {
            let comments;
            if(data.ownerId === dbUser.id) {
                comments = await DataStore.query(Comments, c => c.wishlistItemId("eq", data.id).visibleToOwner("eq", true));
            } else {
                comments = await DataStore.query(Comments, c => c.wishlistItemId("eq", data.id));
            }
            setNumberOfComments(comments.length)
        } catch(e) {
            console.log(e)
        }
    }

    const getImage = () => {
        if(!data.imageUrls || data.imageUrls[0] === "") return '';
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

    const handleSelectWishlistItem = () => {
        if(!wishlistId) return
        navigate(`/${wishlistId}/${data.id}`)
    }

    const handleDelete = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        const id = data.id;

        const toDelete = await DataStore.query(WishlistItems, id);
        await DataStore.delete(toDelete);
        updateVisibleList(visibleListVersion + 1)
        updateLargeItem()
    }

    const getClass = () => {
        if(count%2 === 0) {
            return "wishlistListingItemEven"
        } else {
            return "wishlistListingItemOdd"
        }
    }

    const getNumberOfComments = () => {
        if(!numberOfComments) return;
        return <div className="numComments">
            <FontAwesomeIcon icon={faComment} size="lg" />
            <div>{numberOfComments}</div>
        </div>
    }

    const getIndicators = () => {
        if(data.gottenBy && data.gottenBy.length > 0 && data.wantsToGet && data.wantsToGet.length > 0) {
            return <div className="gottenAndWantsIndicator">
                <div className="wantsToGetIndicator"><FontAwesomeIcon icon={faUserFriends} size="3x" /></div>
                <div className="gottenIndicator"><FontAwesomeIcon icon={faCheck} size="3x" /></div>
            </div>
        }
        if(data.gottenBy && data.gottenBy.length > 0) {
            return <div className="gottenIndicator"><FontAwesomeIcon icon={faCheck} size="3x" /></div>
        }
        if(data.wantsToGet && data.wantsToGet.length > 0) {
            return <div className="wantsToGetIndicator"><FontAwesomeIcon icon={faUserFriends} size="3x" /></div>
        }
    }

    return (
        <Suspense fallback={<div>Loading whale types...</div>}>
            <div className={getClass()} onClick={handleSelectWishlistItem}>
                {getIndicators()}
                {getImage()}
                <h2 className="name">{data.name}</h2>
                {getPrice()}
                {data && dbUser && data.ownerId === dbUser.id && <div className="deleteButton">
                    <IconButton icon={<FontAwesomeIcon icon={faTimesCircle} size="lg" />} displayName={'delete'} onClick={handleDelete}/>
                </div>}
                {getNumberOfComments()}
                <PriorityDisplay priority={data.priority} showName={true} showNumbers={true}/>
            </div>
        </Suspense>
    );
}

