import React, {useEffect, useState} from 'react';
import IconButton from "../Buttons/IconButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimesCircle, faUser} from "@fortawesome/free-solid-svg-icons";
import {DataStore} from "@aws-amplify/datastore";
import {Comments, Users} from "../../models";
import GetNameOrEmail from "../../helpers/getNameOrEmail";
import {dbUserState, refreshNumberComments} from "../../recoil/selectors";
import {useRecoilValue, useSetRecoilState} from "recoil";

export default function SingleComment(props) {
    const {comment, updateComments, wishlist, wishlistItem} = props
    const [name, setName] = useState()
    const dbUser = useRecoilValue(dbUserState)
    const updateNumComments = useSetRecoilState(refreshNumberComments)

    useEffect(() => {
        updateName()
    }, [comment])

    const updateName = async () => {
        if(!comment || !comment.authorId) return;
        const user = await DataStore.query(Users, comment.authorId);
        setName(GetNameOrEmail(user))
    }

    const handleDeleteComment = async (e, comment) => {
        const id = comment.id
        const toDelete = await DataStore.query(Comments, id);
        await DataStore.delete(toDelete);
        updateComments()
        updateNumComments()
    }

    const formatDate = (comment) => {
        if(comment && !comment.createdAt) {
            return "Just now"
        }
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: "numeric", second: "numeric" };

        const dt = new Date(comment.createdAt)
        const returnString = `${dt.toLocaleDateString("en-US", options)}`
        return returnString
    }

    const getProfileImage = () => {
        return <FontAwesomeIcon icon={faUser} size="2x" />
    }



    const canUserSee = () => {
        let ownersID;
        if(wishlist && wishlist.ownerId) {
            ownersID = wishlist.ownerId
        }
        if(wishlistItem && wishlistItem.ownerId) {
            ownersID = wishlistItem.ownerId
        }
        if(comment && !comment.visibleToOwner && (dbUser.id === ownersID) ) {
            return false
        }

        return true;
    }

    return (
        <>
            {canUserSee() && <div className="commentContent" key={comment.id}>
                <div className="header">
                    <div className="profileImage">{getProfileImage()}</div>
                    <div>{name}</div>
                    <div className="visibleToOwner">{comment.visibleToOwner ? "Visible to owner" : "Not visible to owner"}</div>
                    <div className="date">{formatDate(comment)}</div>
                </div>
                <div className="content">{comment.content}</div>
                {comment.authorId === dbUser.id && <div className="deleteButton">
                    <IconButton
                        displayName={"delete"}
                        icon={<FontAwesomeIcon icon={faTimesCircle} size="lg" />}
                        confirm={true}
                        confirmText={"Are you sure you want to permanantly delete this comment?"}
                        onClick={(e) => handleDeleteComment(e, comment)}
                    />
                </div>}
            </div>}
        </>

    );
}

