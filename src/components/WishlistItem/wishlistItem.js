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
import {useRecoilState, useRecoilValue, useRecoilValueLoadable, useSetRecoilState} from "recoil";
import {dbUserState, isSuperOwner, updateLargeWishlistItemVersion, usingUserState} from "../../recoil/selectors";
import {refreshNumberOfComments, refreshVisibleWishlistList} from "../../recoil/versionAtoms";
import visibleWishlist from "../../recoil/selectors/visibleWishlist";
import visibleWishlistState from "../../recoil/selectors/visibleWishlist";
import Loading from "../Loading/loading";

export default function WishlistItem(props) {
    const {data, count, closeSelectSection} = props
    const [numberOfComments, setNumberOfComments] = useState();
    let { wishlistId } = useParams();
    const [visibleListVersion, updateVisibleList] = useRecoilState(refreshVisibleWishlistList)
    const numCommentsVersion = useRecoilValue(refreshNumberOfComments)
    const updateLargeItem = useSetRecoilState(updateLargeWishlistItemVersion)
    const visibleWishlistUpdate = useRecoilValueLoadable(visibleWishlistState)
    const isSuperUpdate = useRecoilValueLoadable(isSuperOwner)
    const navigate = useNavigate()
    const dbUserUpdate = useRecoilValueLoadable(dbUserState);
    const usingUserUpdate = useRecoilValueLoadable(usingUserState);
    // State values
    const [dbUser, setDbUser] = useState()
    const [usingUser, setUsingUser] = useState()
    const [isSuper, setIsSuper] = useState(false)
    const [visibleWishlist, setVisibleWishlist] = useState()

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
        closeSelectSection()
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

    const isOwner = () => {
        if(!dbUser || !visibleWishlist) return false;
        if(dbUser.id === visibleWishlist.ownerId) return true;
        return !!isSuper;

    }

    const getIndicators = () => {
        // don't return anything if this users shouldn't see them.
        if(!data || !dbUser || data.ownerId === dbUser.id ||data.ownerId === usingUser.id) return
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
            <div className={getClass()} onClick={handleSelectWishlistItem}>
                {getIndicators()}
                {getImage()}
                <h2 className="name">{data.name}</h2>
                {getPrice()}
                {isOwner() && <div className="deleteButton">
                    <IconButton icon={<FontAwesomeIcon icon={faTimesCircle} size="lg" />} displayName={'delete'} onClick={handleDelete}/>
                </div>}
                {getNumberOfComments()}
                <PriorityDisplay priority={data.priority} showName={true} showNumbers={true}/>
            </div>
    );
}

