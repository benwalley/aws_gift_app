import React, {useEffect, useState} from 'react';
import {DataStore} from "@aws-amplify/datastore";
import {Wishlist} from "../../models";
import './listList.scss';
import {
    useNavigate
} from "react-router-dom";
import {currentGroupState, dbUserState, usersGroupsState, usersInGroupState} from "../../recoil/selectors";
import createUsersWishlist from "../../helpers/createUserWishlist";
import {useRecoilValueLoadable} from "recoil";
import GroupMultiSelect from "../GroupMultiSelect/groupMultiSelect";
import usersInGroups from "../../recoil/selectorFamilies/usersInGroups";


export default function ListList(props) {
    const {close, selectedGroups, setSelectedGroups} = props

    const navigate = useNavigate()
    const [users, setUsers] = useState()
    const usersUpdate = useRecoilValueLoadable(usersInGroups(selectedGroups));
    const dbUserUpdate = useRecoilValueLoadable(dbUserState);
    const currentGroupUpdate = useRecoilValueLoadable((currentGroupState))
    const [dbUser, setDbUser] = useState()
    const [currentGroup, setCurrentGroup] = useState()

    useEffect(() => {
        if(currentGroupUpdate.state === "hasValue") {
            setCurrentGroup(currentGroupUpdate.contents);
        }
    }, [currentGroupUpdate]);

    useEffect(() => {
        if(!selectedGroups || selectedGroups.length === 0 && currentGroup) {
            setSelectedGroups([currentGroup])
        }
    }, [currentGroup]);

    useEffect(() => {
        if(dbUserUpdate.state === "hasValue") {
            setDbUser(dbUserUpdate.contents);
        }
    }, [dbUserUpdate]);

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
        return <div className="listListContainer">
            <h2>All Wishlists</h2>
            {dbUser && currentGroup && <div className="groupsDropdown">
                <GroupMultiSelect selectedGroups={selectedGroups} setSelectedGroups={setSelectedGroups} userId={dbUser.id} />
            </div>}
            {users && users.length > 0 && <div className="usersListContainer">
                {users.map(user => {
                    return (<div key={user.id} className="usersListItem" onClick={(e) => handleSelectList(e, user)}>
                {user.displayName === "noname" ? user.emailAddress : user.displayName}
                    </div>)
                })}
            </div>}
        </div>
    }

    return (
        <div className="listListContainerContainer">
            {getListList()}
        </div>
    );
}

