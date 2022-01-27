import React, {useEffect, useState} from 'react';
import './subUsers.scss'
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {dbUserState, subUsersState, updateGroupVersion} from "../../../recoil/selectors";
import {DataStore} from "aws-amplify";
import {Groups, Money, Users} from "../../../models";
import IconButton from "../../Buttons/IconButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {usingUserIdState} from "../../../recoil/atoms";

export default function SubUsers() {
    const [subUserName, setSubUserName] = useState('')
    const subUsers = useRecoilValue(subUsersState);
    const updateGroup = useSetRecoilState(updateGroupVersion)
    const dbUser = useRecoilValue(dbUserState)
    const [usingUserId, setUsingUserId] = useRecoilState(usingUserIdState)

    const handleAddSubUser = async (e) => {
        e.preventDefault();
        const group = await DataStore.query(Groups, dbUser.groupId);
        if(!group) {
            return;
        }
        const subUserData = {
            "displayName": subUserName,
            "parentUserId": dbUser.id,
            "isAdmin": false,
            "isSubUser": true,
            "groupId": group.id || ''
        }
        const response = await DataStore.save(
            new Users(subUserData)
        );
        updateGroup();
        setSubUserName('')
    }

    const handleDeleteSubUser = async (user) => {
        const todelete = await DataStore.query(Users, user.id);
        await DataStore.delete(todelete);
        updateGroup()
    }

    const handleViewEditAsUser = (e, user) => {
        e.preventDefault()
        setUsingUserId(user.id)
    }

    const handleSwitchToMainUser = (e) => {
        e.preventDefault()
        setUsingUserId(dbUser.id)
    }

    const getSubUserList = () => {
        return subUsers.map((user, index) => {
            return <div key={user.id} className={index%2 === 0 ? "even" : "odd"}>
                <div className="name">
                    {user.displayName}
                    {usingUserId === user.id ? ' (current)' : ''}
                </div>
                <button onClick={(e) => handleViewEditAsUser(e, user)} className="viewEditButton">view/edit as {user.displayName}</button>

                <IconButton
                    displayName={'delete'}
                    icon={<FontAwesomeIcon icon={faTimesCircle} size="lg"/>}
                    onClick={(e) => handleDeleteSubUser(user)}
                    confirm={true}
                    confirmText={`Are you sure you want to delete the user ${user.displayName}?`}
                />
            </div>
        })
    }

    return (
        <div className="subUsersContainer">
            <h2>Sub-users</h2>
            {subUsers && subUsers.length > 0 && <div className="groupNameSection">
                <div className="subUserList">
                    <h3 className="groupName">Your Sub-users</h3>
                    {getSubUserList()}
                </div>
                {usingUserId !== dbUser.id && <button onClick={handleSwitchToMainUser} className="themeSecondaryButtonNonFullWidth">Switch to main user</button>}

            </div>}
            <div className="inviteUserSection">
                <h3>Add a sub-user</h3>
                <p className="details">Sub-users are users who do not have their own account.
                    Instead you have the ability to control their wishlist.
                    <div className="subUserDetails">
                        <strong>A sub-user cannot:</strong>
                        <ul>
                            <li>Comment</li>
                            <li>See what other people are getting you</li>
                        </ul>
                    </div>

                </p>
                <form onSubmit={handleAddSubUser}>
                    <input
                        className="themeInput"
                        type="text"
                        placeholder="Sub-user name"
                        value={subUserName}
                        onChange={(e) => setSubUserName(e.target.value)}
                    />
                    <button className="themeButton" onClick={handleAddSubUser}>Create sub-user</button>
                </form>
            </div>
        </div>
    );
}
