import React, {useEffect, useState} from 'react';
import {DataStore} from "@aws-amplify/datastore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faEye, faEyeSlash, faPaperPlane, faTimesCircle, faUser, faUserLock} from '@fortawesome/free-solid-svg-icons'
import {Comments} from "../../models";
import IconButton from "../Buttons/IconButton";
import './commentsComponent.scss'
import SingleComment from "./SingleComment";

export default function CommentsComponent(props) {
    const {wishlist, wishlistItem, commenterId, usingUser, dbUser} = props
    const [commentInput, setCommentInput] = useState('')
    const [commentsArr, setCommentsArr] = useState([])
    const [canOwnerSee, setCanOwnerSee] = useState(true)
    const [myInterval, setMyInterval] = useState()

    const updateEvery = 10000 // 10 seconds

    useEffect(() => {
        updateComments()
        automaticUpdate()
    }, [wishlist, wishlistItem])

    const updateComments = async () => {
        let updatedComments;
        if(wishlist && wishlist.id) {
            updatedComments = await DataStore.query(Comments, c => c.wishlistId("eq", wishlist.id));
        } else if(wishlistItem && wishlistItem.id) {
            updatedComments = await DataStore.query(Comments, c => c.wishlistItemId("eq", wishlistItem.id));
        } else {
            return;
        }
        setCommentsArr([...updatedComments])
    }

    const automaticUpdate = () => {
        clearInterval(myInterval)
        setMyInterval(setInterval(updateComments, updateEvery))
    }

    const getNewDate = () => {
        const date = new Date();
        return date.toISOString()

    }

    const handleSendComment = async (e) => {
        e.preventDefault()
        if(!commentInput || commentInput === '') return;

        const commentData = {
            "authorId": commenterId,
            "content": commentInput,
            "visibleToOwner": canOwnerSee,
            "createdAt": getNewDate()
        }
        if(wishlistItem && wishlistItem.id) commentData.wishlistItemId = wishlistItem.id;
        if(wishlist && wishlist.id) commentData.wishlistId = wishlist.id

        const newComment = await DataStore.save(
            new Comments(commentData)
        );

        updateComments()
        setCommentInput('')
        return newComment;
    }

    const handleSetOwnerCanSee = (e) => {
        e.preventDefault();
        setCanOwnerSee(!canOwnerSee)
    }

    const getVisibilityToggle = () => {
        if(wishlist && wishlist.ownerId && (wishlist.ownerId !== commenterId)) {
            return <button className="canOwnerSeeButton" onClick={handleSetOwnerCanSee} aria-label="can owner see comment">
                <label htmlFor="">{canOwnerSee ? "Visible to owner" : "Invisible to owner"}</label>
                <div className="unlocked"><FontAwesomeIcon icon={faEye} size="lg"/></div>
                <div className={canOwnerSee ? "ownerSeeToggleUnlocked" : "ownerSeeToggleLocked"}></div>
                <div className="locked"><FontAwesomeIcon icon={faEyeSlash} size="lg" /></div>
            </button>
        }
        if (wishlistItem && wishlistItem.id && (wishlistItem.ownerId !== commenterId)) {
            return <button className="canOwnerSeeButton" onClick={handleSetOwnerCanSee} aria-label="can owner see comment">
                <label htmlFor="">Visible to owner</label>
                <div className="unlocked"><FontAwesomeIcon icon={faEye} size="lg"/></div>
                <div className={canOwnerSee ? "ownerSeeToggleUnlocked" : "ownerSeeToggleLocked"}></div>
                <div className="locked"><FontAwesomeIcon icon={faEyeSlash} size="lg" /></div>
            </button>
        }
    }

    const getTitle = () => {
        if(wishlist && !wishlistItem) {
            return "Wishlist Comments"
        }
        if(wishlistItem && !wishlist) {
            return "Item Comments"
        }
        else {
            return ''
        }
    }

    return (
        <div className="commentsContainer">
            <div className="title">{getTitle()}</div>
            <div>
                {commentsArr.map(comment => {
                    return <SingleComment wishlist={wishlist} wishlistItem={wishlistItem} commenterId={commenterId} key={comment.id} comment={comment} updateComments={updateComments}/>
                })}
            </div>
            <form className="addComment" onSubmit={handleSendComment}>
                <div className="inputContainer">
                    <input type="text" value={commentInput} onChange={(e) => setCommentInput(e.target.value)}/>
                    <div className="sendButton">
                        <IconButton
                            displayName="Send"
                            onClick={handleSendComment}
                            icon={<FontAwesomeIcon icon={faPaperPlane} size="lg" />}
                        />
                    </div>
                </div>

                {getVisibilityToggle()}

            </form>
        </div>
    );
}

