import React, {useEffect, useState} from 'react';
import {DataStore} from "@aws-amplify/datastore";
import {Groups, Users} from "../../models";
import './listList.scss';

export default function ListList(props) {
    const {close, user, setVisibleWishlistOwnerId} = props
    const [users, setUsers] = useState([])
    useEffect(() => {
        updateList()
    }, [user])

    const updateList = async() => {
        try {
            const users = await DataStore.query(Users, c => c.groupId("eq", user.groupId))
            setUsers(users)
        } catch(e) {
            console.log(e)
        }
    }

    const handleSelectList = (e, user) => {
        e.preventDefault();
        setVisibleWishlistOwnerId(user.id)
        close()
    }

    const getListList = () => {
        if(!users || users.length === 0) return
        return <div className="listListContainer">
            <h2>All Wishlists</h2>
            {users.map(user => {
                return (<div key={user.id} className="usersListItem" onClick={(e) => handleSelectList(e, user)}>
                    {user.displayName === "noname" ? user.emailAddress : user.displayName}
                </div>)
            })}
        </div>
    }

    return (
        <div>
            {getListList()}
        </div>
    );
}

