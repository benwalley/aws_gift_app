import React, {useEffect, useState} from 'react';
import './firstTimePopup.scss'
import {DataStore} from "@aws-amplify/datastore";
import {Groups, Users} from "../../models";
import TextButton from "../Buttons/TextButton";
import {dbUserState} from "../../recoil/selectors";
import {useRecoilValue, useSetRecoilState} from "recoil";
import refreshDbUser from "../../recoil/selectors/refreshDbUser";

export default function FirstTimePopup(props) {
    const {close} = props
    const [username, setUsername] = useState('noname')
    const [groupName, setGroupName] = useState('')
    const [isJoiningGroup, setIsJoiningGroup] = useState('admin')
    const [groupInvites, setGroupInvites] = useState([])
    const [groupJoining, setGroupJoining] = useState(undefined)
    const dbUser = useRecoilValue(dbUserState)
    const updateDbUser = useSetRecoilState(refreshDbUser)

    useEffect(() => {
        updateGroupInvites()
    }, [dbUser])

    const updateGroupInvites = async () => {
        if(!dbUser || !dbUser.id) return;
        const allGroups = await DataStore.query(Groups, c => c.invitedIds("contains", dbUser.id));
        console.log(allGroups)
        setGroupInvites(allGroups)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(!username || !isJoiningGroup) {
            // addError("Please create a username")
            return;
        }

        if(isJoiningGroup === "join") {
            if(!groupJoining) {
                // addError('You must select a group to join, or create a new group');
                return;
            }
            // update user
            const original = await DataStore.query(Users, dbUser.id);
            await DataStore.save(Users.copyOf(original, updated => {
                updated.groupId = groupJoining;
                updated.displayName = username;
            }))
        } else if(isJoiningGroup === "admin") {
            if(!groupName) {
                // addError("You must enter a name for your group")
                return;
            }
            //check if they already are an admin of a group, and if so, don't let them create another one.
            const testGroup = await DataStore.query(Groups, c => c.adminUserId("eq", dbUser.id));
            if(testGroup && testGroup.length > 0) {
                // addError(`You are already the admin of a group (${testGroup[0].groupName}). Click My Account to edit the group name.`)
                close()
                return;
            }
            //Create new group
            const group = await DataStore.save(
                new Groups({
                    "adminUserId": dbUser.id,
                    "invitedIds": [dbUser.id],
                    "groupId": groupJoining,
                    "groupName": groupName
                })
            );

            // update user
            const original = await DataStore.query(Users, dbUser.id);
            await DataStore.save(Users.copyOf(original, updated => {
                updated.groupId = group.id;
                updated.displayName = username;
                updated.isAdmin = true;
                updated.subUsers = [];
            }))
        }
        updateDbUser()
        close()
    }

    const renderJoiningSection = () => {
        if(isJoiningGroup) {
            return <div className="section">
                {isJoiningGroup === "admin" && <div className="creatingNew">
                    <h2>What would you like to call your group?</h2>
                    <div className="userInput">
                        <label htmlFor="">Group name</label>
                        <input value={groupName} onChange={(e) => setGroupName(e.target.value)} type="text"/>
                    </div>
                </div>}
                {isJoiningGroup === "join" && <div className="joiningGroup">
                    <h2>You have been invited to the following group(s)</h2>
                    <div className="groupInvites">
                        {groupInvites.map(invite => {
                            return <div className={groupJoining === invite.id ? "selected" : "invite"} key={invite.id} onClick={() => setGroupJoining(invite.id)}>{invite.groupName}</div>
                        })}
                    </div>
                </div>}
            </div>
        }
    }

    const renderJoiningChoiceSection = () => {
        if(groupInvites && groupInvites.length > 0) {
            return (<div className="section">
                <h2>Are you creating your own group, or joining an existing group?</h2>
                <div className="radioContainer">
                    <div>
                        <label htmlFor="beAdmin">Creating new group</label>
                        <input id="beAdmin" required type="radio" value="admin" name="group" checked={isJoiningGroup === "admin"} onChange={(e) => setIsJoiningGroup(e.target.value)} />

                    </div>
                    <div>
                        <label htmlFor="joinGroup">Joining a group</label>
                        <input id="joinGroup" required type="radio" value="join" name="group" checked={isJoiningGroup === "join"} onChange={(e) => setIsJoiningGroup(e.target.value)}/>
                    </div>
                </div>
            </div>)
        }
        return (<div className="section">
            <h2>Create A Group</h2>
            <div>You do not have any active group invites. To be invited to a group, ask the creator of the group to add you to the group</div>
        </div>)
    }

    return (
        <div className="firstTimePopupContainer">
            <h1>First time user setup</h1>
            <form action="" onSubmit={handleSubmit}>
                <div className="section">
                    <h2>Set your username</h2>
                    <div className="userInput">
                        <label htmlFor="">username</label>
                        <input required value={username} onChange={(e) => setUsername(e.target.value)} type="text"/>
                    </div>
                </div>
                {renderJoiningChoiceSection()}
                {renderJoiningSection()}



                <TextButton onClick={handleSubmit} displayName={"Submit"}/>
            </form>
        </div>
    );
}

