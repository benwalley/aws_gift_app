import React, {useEffect, useState} from 'react';
import {DataStore} from "@aws-amplify/datastore";
import {Wishlist} from "../../models";
import './listList.scss';
import {
    useNavigate
} from "react-router-dom";
import {usersInGroupState} from "../../recoil/selectors";
import createUsersWishlist from "../../helpers/createUserWishlist";
import {useRecoilValueLoadable} from "recoil";


export default function ListList(props) {
    const {close} = props
    const usersUpdate = useRecoilValueLoadable(usersInGroupState)
    const navigate = useNavigate()
    const [users, setUsers] = useState()

    useEffect(() => {
        if(usersUpdate.state === "hasValue") {
            setUsers(usersUpdate.contents);
        }
    }, [usersUpdate]);

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

