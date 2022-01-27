import React, {useEffect, useState} from 'react';
import {DataStore} from "@aws-amplify/datastore";
import {Groups, Users, Wishlist} from "../../models";
import './listList.scss';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useNavigate
} from "react-router-dom";
import {sDbUser, sUsingUser, gDbUser, gUsingUser} from '../../helpers/users'


export default function ListList(props) {
    const {close, setVisibleWishlistOwnerId} = props
    const [users, setUsers] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        updateList()
    }, [])

    const updateList = async() => {
        try {
            const myUser = await DataStore.query(Users, gDbUser())
            const users = await DataStore.query(Users, c => c.groupId("eq", myUser.groupId))
            setUsers(users)
        } catch(e) {
            console.log(e)
        }
    }

    const handleSelectList = async (e, user) => {
        e.preventDefault();
        const list = await DataStore.query(Wishlist, c => c.ownerId("eq", user.id));
        navigate(`/${list[0].id}`)
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

