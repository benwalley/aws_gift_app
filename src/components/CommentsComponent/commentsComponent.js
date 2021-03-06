import React, {useEffect, useState} from 'react';
import {DataStore} from "@aws-amplify/datastore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faEye, faEyeSlash, faPaperPlane, faTimesCircle, faUser, faUserLock} from '@fortawesome/free-solid-svg-icons'
import {Comments} from "../../models";
import IconButton from "../Buttons/IconButton";
import './commentsComponent.scss'
import SingleComment from "./SingleComment";
import {useRecoilValue, useRecoilValueLoadable, useSetRecoilState} from "recoil";
import {dbUserState, refreshNumberComments} from "../../recoil/selectors";
import currentGroup from "../../recoil/selectors/currentGroup";
import currentGroupState from "../../recoil/selectors/currentGroup";

export default function CommentsComponent(props) {
    const {wishlist, wishlistItem} = props
    const [commentInput, setCommentInput] = useState('')
    const [commentsArr, setCommentsArr] = useState([])
    const [canOwnerSee, setCanOwnerSee] = useState(true)
    const [myInterval, setMyInterval] = useState()
    const updateNumComments = useSetRecoilState(refreshNumberComments)
    const dbUserUpdate = useRecoilValueLoadable(dbUserState);
    const currentGroupUpdate = useRecoilValueLoadable(currentGroupState)

    // State values
    const [dbUser, setDbUser] = useState()
    const [currentGroup, setCurrentGroup] = useState()

    useEffect(() => {
        if(currentGroupUpdate.state === "hasValue") {
            setCurrentGroup(currentGroupUpdate.contents);
        }
    }, [currentGroupUpdate]);

    useEffect(() => {
        if(dbUserUpdate.state === "hasValue") {
            setDbUser(dbUserUpdate.contents);
        }
    }, [dbUserUpdate]);

    const updateEvery = 10000 // 10 seconds

    useEffect(() => {
        updateComments()
        automaticUpdate()
    }, [wishlist, wishlistItem, currentGroup])

    const updateComments = async () => {
        let updatedComments;
        if(wishlist && wishlist.id) {
            updatedComments = await DataStore.query(Comments, c => c.wishlistId("eq", wishlist.id).groupId("eq", currentGroup.id));
        } else if(wishlistItem && wishlistItem.id) {
            updatedComments = await DataStore.query(Comments, c => c.wishlistItemId("eq", wishlistItem.id).groupId("eq", currentGroup.id));
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
        if(!commentInput || !dbUser || !currentGroup || commentInput === '') return;

        const commentData = {
            "authorId": dbUser.id,
            "content": commentInput,
            "visibleToOwner": canOwnerSee,
            "createdAt": getNewDate(),
            "groupId": currentGroup.id
        }
        if(wishlistItem && wishlistItem.id) commentData.wishlistItemId = wishlistItem.id;
        if(wishlist && wishlist.id) commentData.wishlistId = wishlist.id

        const newComment = await DataStore.save(
            new Comments(commentData)
        );

        updateComments()
        updateNumComments()
        setCommentInput('')
        return newComment;
    }



    const handleSetOwnerCanSee = (e) => {
        e.preventDefault();
        setCanOwnerSee(!canOwnerSee)
    }

    const getVisibilityToggle = () => {
        if(dbUser && wishlist && wishlist.ownerId && (wishlist.ownerId !== dbUser.id)) {
            return <button className="canOwnerSeeButton" onClick={handleSetOwnerCanSee} aria-label="can owner see comment">
                <label htmlFor="">{canOwnerSee ? "Visible to owner" : "Invisible to owner"}</label>
                <div className="unlocked"><FontAwesomeIcon icon={faEye} size="lg"/></div>
                <div className={canOwnerSee ? "ownerSeeToggleUnlocked" : "ownerSeeToggleLocked"}></div>
                <div className="locked"><FontAwesomeIcon icon={faEyeSlash} size="lg" /></div>
            </button>
        }
        if (dbUser && wishlistItem && wishlistItem.id && (wishlistItem.ownerId !== dbUser.id)) {
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
            <div className="scrollingCommentSection">
                {commentsArr && commentsArr.length === 0 && <div>There are no comments yet.</div>}
                {commentsArr.map(comment => {
                    return <SingleComment
                        wishlist={wishlist}
                        wishlistItem={wishlistItem}
                        key={comment.id}
                        comment={comment}
                        updateComments={updateComments}
                    />
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

