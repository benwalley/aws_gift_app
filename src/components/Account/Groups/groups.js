import React, {useEffect, useState} from 'react';
import {dbUserState, updateGroupVersion, usersGroupsState, usersInvitedToGroupsState} from "../../../recoil/selectors";
import {useRecoilValue, useRecoilValueLoadable, useSetRecoilState} from "recoil";
import './groups.scss'
import {DataStore} from "@aws-amplify/datastore";
import {Groups, Users} from "../../../models";
import IconButton from "../../Buttons/IconButton";
import {faTimesCircle, faUserShield} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {currentGroupIdState} from "../../../recoil/atoms";
//TODO: when you join a group, show list of products, and select any you want to move to that group.

export default function GroupsSection() {
    const myGroupsUpdate = useRecoilValueLoadable(usersGroupsState)
    const myInvitedGroupsUpdated = useRecoilValueLoadable(usersInvitedToGroupsState)
    const currentGroupId = useRecoilValue(currentGroupIdState)
    const [myGroups, setMyGroups] = useState([])
    const [myInvitedGroups, setMyInvitedGroups] = useState([])
    const [newGroupName, setNewGroupName] = useState('')
    const dbUserUpdate = useRecoilValueLoadable(dbUserState);
    const updateGroup = useSetRecoilState(updateGroupVersion)
    const [dbUser, setDbUser] = useState()

    useEffect(() => {
        if(dbUserUpdate.state === "hasValue") {
            setDbUser(dbUserUpdate.contents);
        }
    }, [dbUserUpdate]);

    useEffect(() => {
        if(myGroupsUpdate.state === "hasValue") {
            setMyGroups(myGroupsUpdate.contents);
        }
    }, [myGroupsUpdate]);

    useEffect(() => {
        if(myInvitedGroupsUpdated.state === "hasValue") {
            setMyInvitedGroups(myInvitedGroupsUpdated.contents);
        }
    }, [myInvitedGroupsUpdated]);

    const handleDeleteGroup = async (e, group) => {
        const todelete = await DataStore.query(Groups, group.id);
        await DataStore.delete(todelete);
        updateGroup()
    }

    const isAdminOfGroup = (group) => {
        return group.adminIds.indexOf(dbUser.id) > -1
    }

    const renderMyGroups = () => {
        if(!myGroups) return;
        return myGroups.map((group, index) => {
            return <div className={index % 2 === 0 ? "even" : "odd"} key={group.id}>
                <div className="groupName">
                    {group.groupName}
                    {group.id === currentGroupId && " (Current)"}
                    {group.creatorId === dbUser.id && <FontAwesomeIcon icon={faUserShield} size="sm"/>}
                </div>
                {isAdminOfGroup(group) && group.id !== currentGroupId && <IconButton
                    displayName={'delete'}
                    icon={<FontAwesomeIcon icon={faTimesCircle} size="lg"/>}
                    onClick={(e) => handleDeleteGroup(e, group)}
                    confirm={true}
                    confirmText={`Are you sure you want to delete the group ${group.groupName}?`}
                />}
            </div>
        })
    }

    const handleJoinGroup = async (e, group) => {
        e.preventDefault();
        const original = await DataStore.query(Groups, group.id);
        await DataStore.save(Groups.copyOf(original, updated => {
            const membersCopy = [...original.memberIds];
            membersCopy.push(dbUser.id);
            updated.memberIds = [...new Set(membersCopy)]
        }))
        updateGroup()
    }

    const renderInvitedToGroups = () => {
        return myInvitedGroups.map((group, index) => {
            return <div className={index % 2 === 0 ? "even" : "odd"} key={group.id}>
                {group.groupName}
                <button onClick={(e) => handleJoinGroup(e, group)}>Join group</button>
            </div>
        })
    }

    const createGroup = async (e) => {
        e.preventDefault();
        if(newGroupName === "") return;

        const group = await DataStore.save(
            new Groups({
                "memberIds": [dbUser.id],
                "adminUserId": [dbUser.id],
                "invitedIds": [dbUser.id],
                "groupName": newGroupName,
                "creatorId": dbUser.id,
                "adminIds": [dbUser.id]
            })
        );

        updateGroup();
        setNewGroupName('')
    }

    return (
        <div className="groupsContainer">
            <h2>Groups</h2>


            {/*leave group*/}
            <div className='themeList'>
                <h3>Groups you're a part of</h3>
                {renderMyGroups()}
            </div>
            <p className="ownerInstructions">Created by you <FontAwesomeIcon icon={faUserShield} size="sm"/></p>

            <div className='themeList'>
                <h3>Groups you're invited to</h3>
                {renderInvitedToGroups()}
            </div>
            {/*Join group*/}

            <div className="themeList">
                <h3>Create new group</h3>
                <form className="addGroupForm" onSubmit={createGroup}>
                    <input
                        className="themeInput"
                        type="text"
                        placeholder="group name"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                    />
                    <button className="themeButton">Create</button>
                </form>
            </div>
        </div>
    );
}

