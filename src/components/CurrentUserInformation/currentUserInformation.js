import React, {useEffect, useState} from 'react';
import {DataStore} from "@aws-amplify/datastore";
import {Groups, Users} from "../../models";
import './currentUserInformation.scss'
import ButtonAsText from "../Buttons/ButtonAsText";
import Modal from "../Modal/modal";
import GetNameOrEmail from "../../helpers/getNameOrEmail";
import TextButton from "../Buttons/TextButton";
import AdminUser from "./AdminUser";

//TODO: make admin users update when you make changes in parent

export default function CurrentUserInformation(props) {
    const {dbUser, addError, addSuccess, setCurrentPage, closeMyAccountPopup} = props;
    const [groupAdmin, setGroupAdmin] = useState()
    const [adminSectionOpen, setAdminSectionOpen] = useState(false)
    const [groupUsers, setGroupUsers] = useState([])
    const [checkboxes, setCheckboxes] = useState([])
    const [invitedToGroups, setInvitedGroups] = useState([])
    const [selectedChangeGroup, setSelectedChangeGroup] = useState()

    useEffect(() => {
        init()
    }, [dbUser])



    const init = async () => {
        const group = await updateGroup()
        const groupUsers = await updateGroupUsers(group)
        const checkArray = []
        for(const user of groupUsers) {
            checkArray.push({
                checked: user.isAdmin,
                id: user.id,
                name: GetNameOrEmail(user),
                isSubUser: user.isSubUser,
                isCurrentUser: user.id === dbUser.id
            })
        }
        setCheckboxes([...checkArray])
        updateGroupInvites(group)
    }

    const updateGroupInvites = async (group) => {
        if(!group) group = groupAdmin;
        if(!dbUser || !dbUser.id) return;
        try {
            const allGroups = await DataStore.query(Groups, c => c.invitedIds("contains", dbUser.id).id("ne", group.id));
            setInvitedGroups(allGroups)
        } catch(e) {
            console.log(e)
        }
    }

    const updateGroup = async () => {
        if (!dbUser) return
        try {
            const group = await DataStore.query(Groups, dbUser.groupId);
            if (group) {
                setGroupAdmin(group)
                return group
            }
        } catch (e) {
            console.log(e)
        }
    }

    const updateGroupUsers = async (group) => {
        if (!dbUser || !group) return
        try {
            const users = await DataStore.query(Users, c => c.groupId("eq", group.id));
            if (users && users.length > 0) {
                setGroupUsers([...users])
            }
            return users
        } catch (e) {

        }
    }

    const handleChangeAdmin = async (e) => {
        e.preventDefault()
        try {
            for(const user of checkboxes) {
                const original = await DataStore.query(Users, user.id);
                await DataStore.save(Groups.copyOf(original, updated => {
                    updated.isAdmin = !!user.checked;
                }))
            }
            addSuccess("Saved the admin users")
            setAdminSectionOpen(false)
        } catch(e) {
            addError("There was an error saving the admin users")
            console.log(e)
        }

    }

    const handleClick = (index, userData) => {
        const boxesCopy = [...checkboxes];
        boxesCopy[index].checked = !userData.checked;
        setCheckboxes([...boxesCopy])
    }

    const renderGroupsYoureInvitedTo = () => {
        return invitedToGroups.map(group => {
                return <div
                    className={selectedChangeGroup && selectedChangeGroup.id === group.id ? "userSelected" : 'user'}
                    key={group.id}
                    onClick={() => setSelectedChangeGroup(group)}
                >{group.groupName}</div>
        })
    }

    const handleChangeYourGroup = async (group) => {
        if(!selectedChangeGroup) {
            addError("You must select a group to join")
            return;
        }
        const original = await DataStore.query(Users, dbUser.id);
        await DataStore.save(Groups.copyOf(original, updated => {
            try {
                updated.groupId = selectedChangeGroup.id;
                updated.isAdmin = false;
            } catch (e) {
                console.log(e)
            }

        }))
        window.location.reload() // TODO: do this in a better way
        closeMyAccountPopup()
    }

    return (
        <div className="currentUserInfoContainer">
            <h2>Your User Information</h2>
            <div className="currentUserInfoItem">
                <h4>email address</h4>
                <div>{dbUser.emailAddress}</div>
            </div>
            {!dbUser.isAdmin && <div className="currentUserInfoItem">
                <h4>Your current group</h4>
                <div>{groupAdmin && groupAdmin.groupName ? groupAdmin.groupName : "loading..."}</div>
            </div>}
            {groupAdmin && dbUser.isAdmin && <div className="currentUserInfoItem">
                <h4>You are the admin of:</h4>
                <div>
                    {groupAdmin.groupName}
                    <div className="makeAdminButton">
                        <ButtonAsText displayName="Make other users admins"
                                      onClick={(e) => setAdminSectionOpen(!adminSectionOpen)}/>
                    </div>
                </div>
            </div>}
            {adminSectionOpen && <div className="adminPopup">
                <form action="" onSubmit={handleChangeAdmin}>
                    {checkboxes.map((data, index) => {
                        if(data.isSubUser || data.isCurrentUser) return
                        return <AdminUser key={data.id} handleClick={() => handleClick( index, data)} user={data}/>
                    })}
                    <TextButton onClick={handleChangeAdmin} displayName={"Save"}/>
                </form>
            </div>}
            {invitedToGroups && invitedToGroups.length > 0 && <div>
                <div className="groupUserList">
                    <h4>Other groups you're invited to</h4>
                    {renderGroupsYoureInvitedTo()}
                </div>
                {selectedChangeGroup && <TextButton
                    onClick={handleChangeYourGroup}
                    displayName={"Switch to selected group"}
                    confirm={true}
                    confirmText={<div className="changeGroupConfirmButton"><div>Are you sure you want to leave</div><strong>{groupAdmin.groupName}</strong><div>and join</div><strong>{selectedChangeGroup.groupName}</strong></div>}
                />}
            </div>}
        </div>
    );
}






