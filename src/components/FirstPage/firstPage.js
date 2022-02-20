import React, {useEffect, useState} from 'react';
import GroupSelect from "../GroupSelect/groupSelect";
import TextButton from "../Buttons/TextButton";
import {DataStore} from "@aws-amplify/datastore";
import {Groups, Users} from "../../models";
import {dbUserState, yourGroupInvites} from "../../recoil/selectors";
import {useRecoilValueLoadable, useSetRecoilState} from "recoil";
import refreshDbUser from "../../recoil/selectors/refreshDbUser";
import './firstPage.scss'
import {currentGroupIdState} from "../../recoil/atoms";
import Loading from "../Loading/loading";

export default function FirstPage(props) {
    const [username, setUsername] = useState('noname')
    const [groupName, setGroupName] = useState('')
    const [isJoiningGroup, setIsJoiningGroup] = useState('admin')
    const [groupJoining, setGroupJoining] = useState([])
    const updateDbUser = useSetRecoilState(refreshDbUser)
    const groupInvitesUpdate = useRecoilValueLoadable(yourGroupInvites)
    const dbUserUpdate = useRecoilValueLoadable(dbUserState);
    const setCurrentGroup = useSetRecoilState(currentGroupIdState)
    // State values
    const [dbUser, setDbUser] = useState()
    const [groupInvites, setGroupInvites] = useState([])

    useEffect(() => {
        if (dbUserUpdate.state === "hasValue") {
            setDbUser(dbUserUpdate.contents);
        }
    }, [dbUserUpdate]);

    useEffect(() => {
        if (groupInvitesUpdate.state === "hasValue") {
            setGroupInvites(groupInvitesUpdate.contents);
        }
    }, [groupInvitesUpdate]);

    const isFirstTimeUser = () => {
        if(!dbUser) return true;
        if(!dbUser.groupIds || dbUser.displayName === "noname") return true;
    }

    const handleSubmit = async (e) => {
        if (!dbUser) return;
        e.preventDefault()
        let myGroup;
        if (!username || !isJoiningGroup) {
            // addError("Please create a username")
            return;
        }

        if (isJoiningGroup === "join") {
            if (!groupJoining || groupJoining.length === 0) {
                // addError('You must select a group to join, or create a new group');
                return;
            }
            for(const groupId of groupJoining) {
                const original = await DataStore.query(Groups, groupId);
                await DataStore.save(Users.copyOf(original, updated => {
                    const membersCopy = [...original.memberIds];
                    membersCopy.push(dbUser.id)
                    updated.memberIds = [...new Set(membersCopy)];
                }))
            }
            myGroup = groupJoining
        } else if (isJoiningGroup === "admin") {
            if (!groupName) {
                // addError("You must enter a name for your group")
                return;
            }
            //check if they already are an admin of a group, and if so, don't let them create another one.
            //Create new group
            const group = await DataStore.save(
                new Groups({
                    "memberIds": [dbUser.id],
                    "adminUserId": [dbUser.id],
                    "invitedIds": [dbUser.id],
                    "groupName": groupName,
                    "creatorId": dbUser.id,
                    "adminIds": [dbUser.id]
                })
            );
            myGroup = group.id;

            // update user
            const original = await DataStore.query(Users, dbUser.id);
            await DataStore.save(Users.copyOf(original, updated => {
                updated.groupIds = [group.id];
                updated.displayName = username;
                updated.isAdmin = true;
                updated.subUsers = [];
            }))
        }
        updateDbUser()
        setCurrentGroup(myGroup)
    }

    const toggleGroupJoining = (id) => {
        const groupJoiningCopy = [...groupJoining]
        if (groupJoiningCopy.indexOf(id) > -1) {
            // remove from list
            const index = groupJoiningCopy.indexOf(id)
            groupJoiningCopy.splice(index, 1)
        } else {
            groupJoiningCopy.push(id);
        }
        setGroupJoining([...new Set(groupJoiningCopy)])
    }

    const renderJoiningSection = () => {
        if (isJoiningGroup) {
            return <div className="nameGroupSection">
                {isJoiningGroup === "admin" && <div className="creatingNew">
                    <h3>What would you like to call your group?</h3>
                    <div className="userInput">
                        <label htmlFor="">Group name</label>
                        <input className="themeInput" value={groupName} onChange={(e) => setGroupName(e.target.value)} type="text"/>
                    </div>
                </div>}
                {isJoiningGroup === "join" && <div className="themeList">
                    <h2>You have been invited to the following group(s)</h2>
                        {groupInvites && groupInvites.map(invite => {
                            return <div className={groupJoining.indexOf(invite.id) > -1 ? "selected" : "invite"}
                                        key={invite.id}
                                        onClick={() => toggleGroupJoining(invite.id)}>{invite.groupName}</div>
                        })}
                </div>}
            </div>
        }
    }

    const renderJoiningChoiceSection = () => {
        if (groupInvites && groupInvites.length > 0) {
            return (<div className="joinOrCreateSection">
                <h2>Are you creating your own group, or joining an existing group?</h2>
                <div className="radioContainer">
                        <input id="beAdmin" required type="radio" value="admin" name="group"
                               checked={isJoiningGroup === "admin"}
                               onChange={(e) => setIsJoiningGroup(e.target.value)}/>
                    <label htmlFor="beAdmin">Creating new group</label>



                    <input id="joinGroup" required type="radio" value="join" name="group"
                               checked={isJoiningGroup === "join"}
                               onChange={(e) => setIsJoiningGroup(e.target.value)}/>
                    <label htmlFor="joinGroup">Joining a group</label>
                </div>
            </div>)
        }
        return (<div className="createGroupSection">
            <h2>Create A Group</h2>
            <div>You do not have any active group invites. To be invited to a group, ask the creator of the group to add
                you to the group
            </div>
        </div>)
    }


    return (<>{!dbUser ? <Loading/> :
            <div className="firstPageContainer">
                <div className="firstTimeUserContainer">
                    <h1>First time user setup</h1>
                    <form action="" onSubmit={handleSubmit}>
                        <div className="section">
                            <h2>Set your username</h2>
                            <div className="userInput">
                                <label htmlFor="">username</label>
                                <input className="themeInput" required value={username} onChange={(e) => setUsername(e.target.value)} type="text"/>
                            </div>
                        </div>
                        {renderJoiningChoiceSection()}
                        {renderJoiningSection()}

                        <button className="themeButton" onClick={handleSubmit} >Submit</button>
                    </form>
                </div>
            </div>
    }
    </>
    );
}

