import React, {useEffect, useState} from 'react';
import GetNameOrEmail from '../../../helpers/getNameOrEmail'
import './yourInfo.scss'
import {dbUserState, yourGroupName} from "../../../recoil/selectors";
import {useRecoilValue, useRecoilValueLoadable, useSetRecoilState} from "recoil";
import {Link} from "react-router-dom";
import {Users} from "../../../models";
import {DataStore} from "@aws-amplify/datastore";
import {updateDbUVersion} from "../../../helpers/users";
import refreshDbUser from "../../../recoil/selectors/refreshDbUser";

export default function YourInfo() {
    const groupNameUpdate = useRecoilValueLoadable(yourGroupName);
    const [editNameValue, setEditNameValue] = useState('')
    const [editNamePopupOpen, setEditNamePopupOpen] = useState(false)
    const updateUser = useSetRecoilState(refreshDbUser)
    const dbUserUpdate = useRecoilValueLoadable(dbUserState);
    // State values
    const [dbUser, setDbUser] = useState()
    const [groupName, setGroupName] = useState()

    useEffect(() => {
        if(dbUserUpdate.state === "hasValue") {
            setDbUser(dbUserUpdate.contents);
        }
    }, [dbUserUpdate]);

    useEffect(() => {
        if(groupNameUpdate.state === "hasValue") {
            setGroupName(groupNameUpdate.contents);
        }
    }, [groupNameUpdate]);



    const handleSaveName = async (e) => {
        e.preventDefault()
        // handle updating user
        const original = await DataStore.query(Users, dbUser.id);
        await DataStore.save(Users.copyOf(original, updated => {
            try {
                updated.displayName = editNameValue;
            } catch (e) {
                console.log(e)
            }
        }))
        updateUser();
        setEditNamePopupOpen(false)
        setEditNameValue('')
    }

    return (
        <div className="yourInfoContainer">
            <h2>Your user information</h2>
            <div className="yourInfoItem">
                <h4>Username:</h4>
                <div className="value">{GetNameOrEmail(dbUser)}</div>
                <button className="buttonSection" onClick={() => setEditNamePopupOpen(!editNamePopupOpen)}>{editNamePopupOpen ? "Cancel name change" : "Edit"}</button>
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
            {dbUser && <div className="yourInfoItem">
                <h4>Email</h4>
                <div className="value">{dbUser.emailAddress}</div>
            </div>}
            <div className="yourInfoItem">
                <h4>Group</h4>
                <div className="value">{groupName}</div>
                <Link className="buttonSection" to={`/account/group`}>Group details</Link>
            </div>
        </div>
    );
}
