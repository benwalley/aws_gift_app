import React, {useEffect, useState} from 'react';
import './group.scss'
import {useRecoilValueLoadable, useSetRecoilState} from "recoil";
import {
    dbUserState,
    invitedGroupUsers,
    updateGroupVersion,
    usersInGroupState,
    yourGroupName
} from "../../../recoil/selectors";
import {DataStore} from "@aws-amplify/datastore";
import {Groups, Users} from "../../../models";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimesCircle, faUserCog} from "@fortawesome/free-solid-svg-icons";
import IconButton from "../../Buttons/IconButton";
import currentGroupState from "../../../recoil/selectors/currentGroup";
import isUserAdminOfGroup from "../../../helpers/IsUserAdminOfGroup";

export default function Group() {
    const [editNamePopupOpen, setEditNamePopupOpen] = useState(false)
    const [editNameValue, setEditNameValue] = useState('')
    const dbUserUpdate = useRecoilValueLoadable(dbUserState)
    const updateGroup = useSetRecoilState(updateGroupVersion)
    const groupNameUpdate = useRecoilValueLoadable(yourGroupName);
    const groupUsersUpdate = useRecoilValueLoadable(usersInGroupState)
    const invitedUsersUpdate = useRecoilValueLoadable(invitedGroupUsers)
    const currentGroupUpdate = useRecoilValueLoadable(currentGroupState)
    const [inviteText, setInviteText] = useState('')
    // state values
    const [dbUser, setDbUser] = useState()
    const [groupName, setGroupName] = useState('');
    const [groupUsers, setGroupUsers] = useState([])
    const [invitedUsers, setInvitedUsers] = useState([])
    const [currentGroup, setCurrentGroup] = useState()

    useEffect(() => {
        if (dbUserUpdate.state === "hasValue") {
            setDbUser(dbUserUpdate.contents);
        }
    }, [dbUserUpdate]);

    useEffect(() => {
        if (groupNameUpdate.state === "hasValue") {
            setGroupName(groupNameUpdate.contents);
        }
    }, [groupNameUpdate]);

    useEffect(() => {
        if (groupUsersUpdate.state === "hasValue") {
            setGroupUsers(groupUsersUpdate.contents);
        }
    }, [groupUsersUpdate]);

    useEffect(() => {
        if (invitedUsersUpdate.state === "hasValue") {
            setInvitedUsers(invitedUsersUpdate.contents);
        }
    }, [invitedUsersUpdate]);

    useEffect(() => {
        if (currentGroupUpdate.state === "hasValue") {
            console.log(currentGroupUpdate.contents)
            setCurrentGroup(currentGroupUpdate.contents);
        }
    }, [currentGroupUpdate]);

    const handleSaveName = async (e) => {
        if (!currentGroup) return;
        e.preventDefault()
        // handle updating user
        const original = await DataStore.query(Groups, currentGroup.id);
        await DataStore.save(Groups.copyOf(original, updated => {
            try {
                updated.groupName = editNameValue;
            } catch (e) {
                console.log(e)
            }
        }))
        updateGroup();
        setEditNamePopupOpen(false)
        setEditNameValue('')
    }

    const handleDeleteGroupMember = async (e, user) => {
        //TODO: remove id from group instead of user
        // remove their group id
        const originalUser = await DataStore.query(Users, user.id);
        // If they're a subuser, we just delete the user
        if (originalUser.isSubUser) {
            await DataStore.delete(originalUser);
        } else {
            //If they're a normal user, remove their id from the memberIds
            const originalGroup = await DataStore.query(Groups, currentGroup.id);
            await DataStore.save(Groups.copyOf(originalGroup, updatedGroup => {
                try {
                    const membersCopy = [...originalGroup.memberIds];
                    const index = membersCopy.indexOf(user.id);
                    membersCopy.splice(index, 1)
                    updatedGroup.memberIds = membersCopy;
                } catch (e) {

                }
            }))
        }

        // remove their invite.
        const originalGroup = await DataStore.query(Groups, currentGroup.id);
        await DataStore.save(Groups.copyOf(originalGroup, updatedGroup => {
            try {
                const invitesCopy = [...originalGroup.invitedIds];
                const index = invitesCopy.indexOf(user.id);
                invitesCopy.splice(index, 1)
                updatedGroup.invitedIds = invitesCopy;
            } catch (e) {

            }
        }))
        updateGroup()
    }

    const handleDeleteInvite = async (e, email) => {
        const user = await DataStore.query(Users, c => c.emailAddress("eq", email));
        if (!user || user.length === 0) return;
        // if there is a user, remove their ID from the list
        // remove their invite.
        const originalGroup = await DataStore.query(Groups, currentGroup.id);
        await DataStore.save(Groups.copyOf(originalGroup, updatedGroup => {
            try {
                const invitesCopy = [...originalGroup.invitedIds];
                const index = invitesCopy.indexOf(user[0].id);
                invitesCopy.splice(index, 1)
                updatedGroup.invitedIds = invitesCopy;
            } catch (e) {

            }
        }))
        updateGroup()
    }

    const handleToggleAdmin = async (e, user) => {
        e.preventDefault();
        const isAdmin = isUserAdminOfGroup(user.id, currentGroup);
        const original = await DataStore.query(Groups, currentGroup.id);
        await DataStore.save(Users.copyOf(original, updated => {
            const adminsCopy = [...original.adminIds]
            if(isAdmin) {
                const index = adminsCopy.indexOf(user.id);
                adminsCopy.splice(index, 1);
            } else {
                adminsCopy.push(user.id);
            }
            updated.adminIds = [...new Set(adminsCopy)]
        }))
        updateGroup()
    }

    const renderMakeAdminButton = (user) => {
        // check if user is admin of this group;
        const isDbUserCreator = dbUser.id === currentGroup.creatorId;
        if(!isDbUserCreator) return;
        const isAdmin = isUserAdminOfGroup(user.id, currentGroup)
        const isSubUser = user.isSubUser;
        if(!isSubUser && !dbUser.id === user.id) {
            return <button onClick={(e) => handleToggleAdmin(e, user)}>
                {isAdmin ? "Make not-admin" : "Make admin"}
            </button>
        }
    }

    const renderUsersInGroup = () => {
        if (!dbUser || !groupUsers || !currentGroup) return;
        return groupUsers.map((user, index) => {
            const isAdmin = isUserAdminOfGroup(dbUser.id, currentGroup)
            return <div key={user.id} className={index % 2 === 0 ? "even" : "odd"}>
                <div className="groupUserItem">
                    {user.displayName}
                    {user.id === dbUser.id ? " (you)" : ''}
                    {currentGroup.adminIds.indexOf(user.id) > -1 ? <div className="adminIcon"><FontAwesomeIcon icon={faUserCog} size="sm"/></div> : ''}
                </div>
                <div className="makeAdmin">
                    {renderMakeAdminButton(user)}
                </div>
                {user.id !== dbUser.id && isAdmin && <IconButton
                    displayName={'delete'}
                    icon={<FontAwesomeIcon icon={faTimesCircle} size="lg"/>}
                    onClick={(e) => handleDeleteGroupMember(e, user)}
                    confirm={true}
                    confirmText={`Are you sure you want to remove ${user.displayName} from your group?`}
                />}
            </div>
        })
    }

    const renderInvitedGroupUsers = () => {
        if (!invitedUsers) return;
        return invitedUsers.map((email, index) => {
            return <div key={email} className={index % 2 === 0 ? "even" : "odd"}>
                <div>
                    {email}
                </div>
                {isUserAdminOfGroup(dbUser.id, currentGroup) && <IconButton
                    displayName={'delete'}
                    icon={<FontAwesomeIcon icon={faTimesCircle} size="lg"/>}
                    onClick={(e) => handleDeleteInvite(e, email)}
                    confirm={true}
                    confirmText={`Are you sure you want to un-invite ${email} ?`}
                />}
            </div>
        })
    }

    const handleAddInvite = async (e) => {
        e.preventDefault()
        if (!inviteText || inviteText === "") return;
        let groupData = await DataStore.query(Groups, currentGroup.id);
        if (!groupData) return; // throw error
        // get the user if it exists
        let invitedUser = await DataStore.query(Users, c => c.emailAddress("eq", inviteText));
        // If there is not already a user, create it.
        if (invitedUser && invitedUser.length === 0) {
            // create user
            const userData = {
                "displayName": 'noname',
                "isAdmin": false,
                "isSubUser": false,
                "subUsers": [],
                "emailAddress": inviteText
            }

            const response = await DataStore.save(
                new Users(userData)
            );

            invitedUser = response
        } else {
            invitedUser = invitedUser[0]
        }
        // Now that a user exists, update the group with that user.
        const original = await DataStore.query(Groups, currentGroup.id);
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

        setInviteText('')
        updateGroup()
    }

    const isAdminForThisGroup = () => {
        if(!currentGroup || !dbUser) return false;
        return currentGroup.adminIds.indexOf(dbUser.id) > -1;
    }

    return (<>
            {dbUser && currentGroup && <div className="yourGroupContainer">
                <div>
                    <div className="groupNameSection">
                        {groupName && <h2 className="groupName">{groupName}</h2>}
                        {isAdminForThisGroup() && <button className="themeTextLink"
                                onClick={() => setEditNamePopupOpen(!editNamePopupOpen)}>{editNamePopupOpen ? "Cancel name change" : "Edit group name"}</button>}
                        {editNamePopupOpen &&
                        <form className="editNameSection" onSubmit={handleSaveName}>
                            <input
                                className="changeNameInput"
                                type="text"
                                value={editNameValue}
                                onChange={(e) => setEditNameValue(e.target.value)}
                            />
                            <button onClick={handleSaveName}>Save</button>
                        </form>}
                    </div>
                    <div className="groupUsersSection">
                        {groupUsers && groupUsers.length > 0 && <div className="themeList">
                            <h3>Users in your group</h3>
                            {renderUsersInGroup()}
                        </div>}
                    </div>
                    <div className="adminLegend">
                        <div>Group admin</div>
                        <div className="adminIcon"><FontAwesomeIcon icon={faUserCog} size="sm"/></div>
                    </div>
                    {invitedUsers && invitedUsers.length > 0 && <div className="themeList">
                        <h3>Users invited to your group</h3>
                        {renderInvitedGroupUsers()}
                    </div>}
                    {isUserAdminOfGroup(dbUser.id, currentGroup) && <div className="inviteUserSection">
                        <h3>Invite a user to join your group</h3>
                        <p>This will not send any sort of invite, all it will do is allow them to join your group if
                            they want to.</p>
                        <form onSubmit={handleAddInvite}>
                            <input
                                className="themeInput"
                                type="text"
                                placeholder="Enter email address"
                                value={inviteText}
                                onChange={(e) => setInviteText(e.target.value)}
                            />
                            <button className="themeButton" onClick={handleAddInvite}>Invite</button>
                        </form>
                    </div>}
                </div>
            </div>}
        </>
    );
}

