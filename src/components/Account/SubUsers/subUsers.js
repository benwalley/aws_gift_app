import React, {useEffect, useState} from 'react';
import './subUsers.scss'
import {useRecoilState, useRecoilValue, useRecoilValueLoadable, useSetRecoilState} from "recoil";
import {dbUserState, subUsersState, updateGroupVersion, usersGroupsState} from "../../../recoil/selectors";
import {DataStore} from "aws-amplify";
import {Groups, Money, Users, Wishlist} from "../../../models";
import IconButton from "../../Buttons/IconButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {usingUserIdState, visibleWishlistIDState} from "../../../recoil/atoms";
import createUsersWishlist from "../../../helpers/createUserWishlist";
import {onAuthUIStateChange} from "@aws-amplify/ui-components";
import currentGroupState from "../../../recoil/selectors/currentGroup";
import GroupMultiSelect from "../../GroupMultiSelect/groupMultiSelect";
import GroupMultiSelectPopup from "../../GroupMultiSelect/Popup/popup";
import SubUserItem from "./SubUserItem/subUserItem";

export default function SubUsers() {
    const [subUserName, setSubUserName] = useState('')
    const subUsersUpdate = useRecoilValueLoadable(subUsersState);
    const updateGroup = useSetRecoilState(updateGroupVersion)
    const [usingUserId, setUsingUserId] = useRecoilState(usingUserIdState)

    const dbUserUpdate = useRecoilValueLoadable(dbUserState);
    const currentGroupUpdate = useRecoilValueLoadable(currentGroupState)


    // state values
    const [dbUser, setDbUser] = useState()
    const [subUsers, setSubUsers] = useState([])
    const [currentGroup, setCurrentGroup] = useState()
    const [subUserGroups, setSubUserGroups] = useState([])
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false)

    useEffect(() => {
        if(dbUserUpdate.state === "hasValue") {
            setDbUser(dbUserUpdate.contents);
        }
    }, [dbUserUpdate]);

    useEffect(() => {
        if(subUsersUpdate.state === "hasValue") {
            setSubUsers(subUsersUpdate.contents);
        }
    }, [subUsersUpdate]);

    useEffect(() => {
        if(currentGroupUpdate.state === "hasValue") {
            setCurrentGroup(currentGroupUpdate.contents);
        }
    }, [currentGroupUpdate]);


    const handleAddSubUser = async (e) => {
        e.preventDefault();
        if(!subUserGroups || !subUserName || subUserName === "" || subUserGroups.length === 0) {
            return;
        }
        const subUserData = {
            "displayName": subUserName,
            "parentUserId": dbUser.id,
            "isAdmin": false,
            "isSubUser": true,
        }
        const response = await DataStore.save(
            new Users(subUserData)
        );
        // Add id to group
        for await (const groupData of subUserGroups) {
            const original = await DataStore.query(Groups, groupData.id);
            await DataStore.save(Groups.copyOf(original, updated => {
                try {
                    const copy = [...original.memberIds]
                    copy.push(response.id)
                    updated.memberIds = copy;
                } catch (e) {
                    console.log(e)
                }
            }))
        }
        updateGroup();
        setSubUserName('')
    }

    const handleSwitchToMainUser = (e) => {
        e.preventDefault()
        setUsingUserId(dbUser.id)
    }

    const getSubUserList = () => {
        return subUsers.map((user, index) => {
            return <SubUserItem key={user.id} user={user} setIsEditPopupOpen={setIsEditPopupOpen} index={index} isEditPopupOpen={isEditPopupOpen}/>
        })
    }

    return (<>{dbUser &&
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
                <div className="details">Sub-users are users who do not have their own account.
                    Instead you have the ability to control their wishlist.
                    <div className="subUserDetails">
                        <strong>A sub-user cannot:</strong>
                        <ul>
                            <li>Comment</li>
                            <li>See what other people are getting you</li>
                        </ul>
                    </div>

                </div>
                <form onSubmit={handleAddSubUser}>
                    <input
                        className="themeInput"
                        type="text"
                        placeholder="Sub-user name"
                        value={subUserName}
                        onChange={(e) => setSubUserName(e.target.value)}
                    />
                    <GroupMultiSelect selectedGroups={subUserGroups} setSelectedGroups={setSubUserGroups} userId={dbUser.id}/>
                    <button className="themeButton" onClick={handleAddSubUser}>Create sub-user</button>
                </form>
            </div>
        </div>}
        </>
    );
}
