import React, {useEffect, useState} from 'react';
import TextButton from "../Buttons/TextButton";
import ButtonAsText from "../Buttons/ButtonAsText";
import IconButton from "../Buttons/IconButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {DataStore} from "aws-amplify";
import {Groups, Users} from "../../models";


export default function SubUsers(props) {
    const {setVisibleWishlistOwnerId, setUsingUserId, setLargeWishlistItemId, authUser, dbUser, updateYourGroupData, updateSubUsers, subUsers, close, usingUser} = props
    const [subUserInput, setSubUserInput] = useState([])

    const handleViewEditSubUserList = async (e, subUser, index) => {
        e.preventDefault()
        setVisibleWishlistOwnerId(subUser.id)
        setUsingUserId(subUser.id)
        setLargeWishlistItemId(undefined)
        close()
    }



    const handleSaveSubUser = async (e) => {
        e.preventDefault()
        const group = await DataStore.query(Groups, dbUser.groupId);
        if(!group) {
            return;
        }
        const subUserData = {
            "displayName": subUserInput,
            "parentUserId": dbUser.id,
            "isAdmin": false,
            "isSubUser": true,
            "groupId": group.id || ''
        }
        const response = await DataStore.save(
            new Users(subUserData)
        );
        updateSubUsers()
        updateYourGroupData()
        setSubUserInput('')
    }

    const handleDeleteSubUser = async (e, user) => {
        const id = user.id
        const toDelete = await DataStore.query(Users, id);
        await DataStore.delete(toDelete);
        updateSubUsers()
    }

    const getListSubUsers = () => {
        if(!subUsers || subUsers.length === 0) return;
        return (<div className="subUsersList">
            {subUsers.map((user, index) => {
                return <div key={index} className={user.id === usingUser.id ? "subUserActive" : "subUser"}>
                    {(usingUser.id === user.id) ? `${ user.displayName } (current)` : user.displayName}
                    <div className="viewEditSubList">
                        <ButtonAsText displayName={"View/Edit list"} onClick={(e) => handleViewEditSubUserList(e, user, index)}/>
                    </div>
                    <IconButton
                        displayName={user.displayName}
                        icon={<FontAwesomeIcon icon={faTimesCircle} size="2x" />}
                        onClick={(e) => handleDeleteSubUser(e, user)}
                        confirm={true}
                        confirmText={`Are you sure you want to permanently delete ${user.displayName} ?`}
                    />
                </div>
            })}
        </div>)
    }

    return (
        <div className="addSubUserContainer">
            <h2>Your sub-users</h2>
            {usingUser.isSubUser && <div className="switchToMainAccountButton">
                <TextButton displayName={"Switch back to main account"} onClick={() => setUsingUserId(authUser.id)}/>
            </div>}
            <p>Sub-users are users who do not have their own account, and instead you manage their account.
                You will manage their wishlist, but will not be able to see your own wishlist as their user.</p>
            {getListSubUsers()}
            <h2>Add sub-user</h2>
            <form onSubmit={handleSaveSubUser}>
                <div className="addSubUserInput">
                    <label htmlFor="">Username</label>
                    <input type="text" value={subUserInput} onChange={(e) => setSubUserInput(e.target.value)}/>
                </div>
                <TextButton displayName={"Save sub-user"} onClick={handleSaveSubUser}/>
            </form>

        </div>
    );
}
