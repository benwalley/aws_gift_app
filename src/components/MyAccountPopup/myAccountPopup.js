import React, {useEffect, useState} from 'react';
import TextButton from "../Buttons/TextButton";
import './myAccountPopup.scss'
import IconButton from "../Buttons/IconButton";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTimesCircle} from '@fortawesome/free-solid-svg-icons'
import {DataStore} from "aws-amplify";
import {Groups, Users,} from "../../models";
import SubUsersComponent from '../SubUsers/subUsers'
import CurrentUserInformation from "../CurrentUserInformation/currentUserInformation";
import {sDbUser, sUsingUser, gDbUser, gUsingUser, updateDbUVersion} from '../../helpers/users'

export default function MyAccountPopup(props) {
    const {
        authUser,
        close,
        addError,
        addSuccess,
        setCurrentPage,
        versions,
        setVersions
    } = props;
    const [username, setUsername] = useState('untitled user')
    const [yourGroupName, setYourGroupName] = useState('untitled group')
    const [yourGroupData, setYourGroupData] = useState([]);
    const [invite, setInvite] = useState('')
    const [subUsers, setSubUsers] = useState([])
    const [usersInGroup, setUsersInGroup] = useState({});
    const [invitesInGroup, setInvitesInGroup] = useState([])
    const [dbUser, setDbUser] = useState()

    useEffect(() => {
        updateDbUser()
    }, [versions])

    useEffect(() => {
        updateUsersInGroup()
        updateInvitesInGroup()
    }, [yourGroupData])

    useEffect(() => {
        updateSubUsers();
        updateYourGroupData()
        updateMyUsername()
    }, [dbUser])



    const updateDbUser = async () => {
        const user = await DataStore.query(Users, gDbUser());
        setDbUser(user)
    }

    const updateUsersInGroup = async () => {
        try {
            const groupUsers = await DataStore.query(Users, c => c.groupId("eq", yourGroupData.id));
            setUsersInGroup(groupUsers)
        } catch (e) {console.log(e)}
    }

    const updateInvitesInGroup = async (updatedGroup) => {
        let groupData
        if(updatedGroup) groupData = updatedGroup
        if(!updatedGroup && yourGroupData) groupData = yourGroupData;
        if (!groupData) return;
        try {
            const usersList = [];
            if (!groupData.invitedIds) return
            for (const id of groupData.invitedIds) {
                const user = await DataStore.query(Users, id);
                usersList.push(user)
            }
            setInvitesInGroup([...usersList])
        } catch (e) {
            console.log(e)
        }
    }

    const createGroup = async () => {
        const group = await DataStore.save(
            new Groups({
                "adminUserId": gDbUser(),
                "memberIds": [gDbUser()],
                "invitedIds": [gDbUser()],
                "memberEmailAddresses": [authUser.attributes.email],
                "invitedEmailAddresses": [authUser.attributes.email],
            })
        );
        return group;
    }

    //=================================
    // HANDLE SAVE FUNCTIONS
    //=================================

    const handleSaveUsername = async (e) => {
        e.preventDefault()
        let original = await DataStore.query(Users, dbUser.id);
        await DataStore.save(
            Users.copyOf(original, updated => {
                updated.displayName = username;
            })
        );
        await updateDbUVersion()
        close();
    }

    const handleSaveGroupName = async (e) => {
        e.preventDefault()
        let groupData = await DataStore.query(Groups, c => c.adminUserId("eq", dbUser.id));
        if (!groupData || groupData.length === 0) {
            // create a group
            groupData = await createGroup()
        } else {
            groupData = groupData[0]
        }
        e.preventDefault()
        const original = await DataStore.query(Groups, groupData.id);
        await DataStore.save(
            Groups.copyOf(original, updated => {
                updated.groupName = yourGroupName;
            })
        );
        addSuccess(`Updated Group name to "${yourGroupName}"`)
        updateYourGroupData();
    }


    const handleSaveUserInvites = async (e) => {
        e.preventDefault()
        if(!invite || invite === "") return;
        let groupData = await DataStore.query(Groups, c => c.adminUserId("eq", dbUser.id));
        if (!groupData || groupData.length === 0) {
            // create a group
            groupData = await createGroup()
        } else {
            groupData = groupData[0]
        }
        // At this point, a group is created if necessary
        // get the user if it exists
        let invitedUser = await DataStore.query(Users, c => c.emailAddress("eq", invite));
        if (invitedUser && invitedUser.length === 0) {
            // create user
            const userData = {
                "displayName": 'noname',
                "isAdmin": false,
                "isSubUser": false,
                "subUsers": [],
                "emailAddress": invite
            }

            const response = await DataStore.save(
                new Users(userData)
            );

            invitedUser = response
        } else {
            invitedUser = invitedUser[0]
        }
        // Now that a user and group both exist, update the group with that user.
        const original = await DataStore.query(Groups, groupData.id);
        await DataStore.save(Groups.copyOf(original, updated => {
            let ids;
            if (!original.invitedIds) {
                ids = []
            } else {
                ids = [...original.invitedIds];
            }
            ids.push(invitedUser.id)
            const filteredIds = [...new Set(ids)];
            updated.invitedIds = filteredIds;
        }))
        updateYourGroupData();
        setInvite('')
    }

    //=================================
    // HANDLE UPDATE FUNCTIONS
    //=================================

    const updateMyUsername = () => {
        if (dbUser && dbUser.displayName) {
            setUsername(dbUser.displayName)
        }
    }

    const updateYourGroupData = async () => {
        try {
            let myGroup = await DataStore.query(Groups, dbUser.groupId)
            setYourGroupData(myGroup)
            if (myGroup.groupName) {
                setYourGroupName(myGroup.groupName)
            }
            return myGroup

        } catch (e) {

        }
    }

    const updateSubUsers = async () => {
        try {
            const mySubUsers = await DataStore.query(Users, c => c.parentUserId("eq", dbUser.id).isSubUser("eq", true));
            setSubUsers(mySubUsers)
        } catch (e) {
            console.log(e)
        }
    }

    //=================================
    // GET FUNCTIONS
    //=================================

    const getGroupMembers = () => {
        try {
            if (!usersInGroup || usersInGroup.length === 0) return
            return usersInGroup.map(user => {
                return <div key={user.id} className="user">
                    <div>{user.displayName === "noname" ? user.emailAddress : user.displayName}</div>
                    {user.id !== dbUser.id && dbUser.isAdmin && <IconButton
                        displayName={'delete'}
                        icon={<FontAwesomeIcon icon={faTimesCircle} size="2x"/>}
                        onClick={(e) => handleDeleteGroupMember(e, user)}
                        confirm={true}
                        confirmText={`Are you sure you want to remove ${user.displayName} from your group?`}
                    />}
                </div>
            })
        } catch (e) {

        }
    }

    const renderInvitedEmails = () => {
        try {
            if (!invitesInGroup || invitesInGroup.length === 0) return
            return invitesInGroup.map(user => {
                if (user.groupId === yourGroupData.id) return; // don't show users who already joined your group
                return <div key={user.id} className="user">
                    <div>{user.emailAddress}</div>
                    <IconButton
                        displayName={'delete'}
                        icon={<FontAwesomeIcon icon={faTimesCircle} size="2x"/>}
                        onClick={(e) => handleDeleteGroupMember(e, user)}
                        confirm={true}
                        confirmText={`Are you sure you want to uninvite ${user.emailAddress} from your group?`}
                    />
                </div>
            })
        } catch (e) {

        }
    }

    const getAddUserToGroup = () => {
        // if is admin

        return (<div className="addUsersContainer">
            <h2>Your Group</h2>
            {dbUser && dbUser.isAdmin && <form action="" onSubmit={handleSaveGroupName}>
                <div className="myAccountFormInput">
                    <input className="accountInput" type="text" value={yourGroupName}
                           onChange={(e) => setYourGroupName(e.target.value)}/>
                </div>
                <div className="saveGroupButton">
                    <TextButton displayName={"Save group name"} onClick={handleSaveGroupName}/>
                </div>
            </form>}
            <div className="groupUserList">
                <h3>Members</h3>
                {getGroupMembers()}
            </div>

            {dbUser && dbUser.isAdmin && <div>
                <div className="groupUserList">
                    <h3>Invites</h3>
                    {renderInvitedEmails()}
                </div>
                <h3 className="addUsersTitle">Add users</h3>
                <p>Enter email address for someone who wants to join. When they sign up with that email address, they will
                    be added to your group.
                    If they already have an account, they will get an invitation to change to your group</p>
                <form onSubmit={handleSaveUserInvites}>
                    <div className="myAccountFormInput">
                        <input className="accountInput" type="text" value={invite}
                               onChange={(e) => setInvite(e.target.value)}/>
                    </div>
                    <div className="saveAccountButton">
                        <TextButton displayName={"Add user to group"} onClick={handleSaveUserInvites}/>
                    </div>
                </form>
            </div>}
        </div>)
    }


    //=================================
    // HANDLE DELETE FUNCTIONS
    //=================================


    const handleDeleteGroupMember = async (e, user) => {
        // TODO: just remove user from group, don't delete it'
        const id = yourGroupData.id

        const original = await DataStore.query(Groups, id);
        await DataStore.save(Groups.copyOf(original, updated => {
            try {
                const copyOfInvitedIds = [...updated.invitedIds]
                updated.invitedIds = [...copyOfInvitedIds.filter(item => item !== user.id)];
            } catch (e) {
                console.log(e)
            }
        }))
        // remove groupId from user if necessary
        const originalUser = await DataStore.query(Users, user.id);
        await DataStore.save(Groups.copyOf(originalUser, updated => {
            try {
                updated.groupId = updated.groupId === id ? '' : updated.groupId;
            } catch (e) {
                console.log(e)
            }

        }))
        const updatedGroup = await updateYourGroupData()
        updateInvitesInGroup(updatedGroup)
        updateSubUsers()
    }

    return (
        <div className="myAccountPopupContainer">
            <div className="myAccountPopupBackground" onClick={close}></div>
            <div className="myAccountPopupContent">
                <div className="myAccountPopupScrollingContainer">
                    <CurrentUserInformation
                        closeMyAccountPopup={close}
                        addError={addError}
                        addSuccess={addSuccess}
                        versions={versions}
                        setVersions={setVersions}
                    />
                </div>

                <div className="myAccountPopupScrollingContainer">
                    <h2>My Account Information</h2>
                    <form onSubmit={handleSaveUsername}>
                        <div className="myAccountFormInput">
                            <label htmlFor="">Username</label>
                            <input className="accountInput" type="text" value={username}
                                   onChange={(e) => setUsername(e.target.value)}/>
                        </div>
                        <div className="saveAccountButton">
                            <TextButton displayName={"Save Username"} onClick={handleSaveUsername}/>
                        </div>
                    </form>
                    {getAddUserToGroup()}
                    <SubUsersComponent
                        dbUser={dbUser}
                        updateYourGroupData={updateYourGroupData}
                        updateSubUsers={updateSubUsers}
                        subUsers={subUsers}
                        close={close}
                        versions={versions}
                        setVersions={setVersions}
                    />
                </div>
            </div>
        </div>
    );
}

