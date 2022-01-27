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
import {usersInGroupState} from "../../recoil/selectors";
import {useRecoilValue} from "recoil";
import createUsersWishlist from "../../helpers/createUserWishlist";


export default function ListList(props) {
    const {close} = props
    const users = useRecoilValue(usersInGroupState)
    const navigate = useNavigate()

    const handleSelectList = async (e, user) => {
        e.preventDefault();
        const list = await DataStore.query(Wishlist, c => c.ownerId("eq", user.id));
        let theList;
        if(!list || list.length === 0) {
            // create a wishlist for that users
            theList = await createUsersWishlist(user)
        } else {
            theList = list[0]
        }
        navigate(`/${theList.id}`)
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
        <div className="listListContainerContainer">
            {getListList()}
        </div>
    );
}

