import React, {useEffect, useState} from 'react';
import IconButton from "../../../Buttons/IconButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import GroupMultiSelectPopup from "../../../GroupMultiSelect/Popup/popup";
import {DataStore} from "aws-amplify";
import {Groups, Users, Wishlist} from "../../../../models";
import createUsersWishlist from "../../../../helpers/createUserWishlist";
import {useNavigate} from "react-router";
import {useRecoilState, useRecoilValueLoadable, useSetRecoilState} from "recoil";
import {usingUserIdState, visibleWishlistIDState} from "../../../../recoil/atoms";
import {dbUserState, updateGroupVersion, usersGroupsState} from "../../../../recoil/selectors";


export default function SubUserItem(props) {
    const {user, index} = props
    const updateGroup = useSetRecoilState(updateGroupVersion)
    const [usingUserId, setUsingUserId] = useRecoilState(usingUserIdState)
    const setVisibleWishlistId = useSetRecoilState(visibleWishlistIDState)
    const dbUserUpdate = useRecoilValueLoadable(dbUserState);
    const allGroupsUpdate = useRecoilValueLoadable(usersGroupsState);
    const navigate = useNavigate()


    // state values
    const [dbUser, setDbUser] = useState()
    const [selectedEditGroups, setSelectedEditGroups] = useState([])
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false)
    const [allGroups, setAllGroups] = useState();

    useEffect(() => {
        if(allGroupsUpdate.state === "hasValue") {
            setAllGroups(allGroupsUpdate.contents);
        }
    }, [allGroupsUpdate]);

    useEffect(() => {
        if(dbUserUpdate.state === "hasValue") {
            setDbUser(dbUserUpdate.contents);
        }
    }, [dbUserUpdate]);

    useEffect(() => {
        // set initial selected edit groups
        updateInitialGroups()
    }, []);

    const updateInitialGroups = async () => {
        const myGroups = await DataStore.query(Groups, c => c.memberIds("contains", user.id));
        setSelectedEditGroups(myGroups)
    }

    const handleViewEditAsUser = async (e, user) => {
        e.preventDefault()
        let wishlist
        const subUserWishlists = await DataStore.query(Wishlist, c => c.ownerId("eq", user.id));
        if(subUserWishlists && subUserWishlists.length > 0) {
            wishlist = subUserWishlists[0]
        } else {
            wishlist = await createUsersWishlist(user)
        }
        let switchToId = wishlist.id
        setVisibleWishlistId(switchToId)
        setUsingUserId(user.id)
        navigate(`/${switchToId}`)
    }

    const submitUpdateSubUser = async (e, userId) => {
        e.preventDefault();
        //loop through all of this user's groups, and if it's not in selectedEditGroups, remove it. And if it is, add it.

        for(const group of allGroups) {
            // this means we should remove the id from the group if it's in there
            const original = await DataStore.query(Groups, group.id);
            await DataStore.save(Groups.copyOf(original, updated => {
                try {
                    const membersCopy = [...original.memberIds];
                    if(selectedEditGroups.some(g => g.id === group.id)) {
                        //if the current group is selected, add it to the array
                        membersCopy.push(userId);
                    } else {
                        // This means the current group is not selected, so we should remove it from the array if it's in it.
                        const index = membersCopy.indexOf(userId);
                        if (index > -1) {
                            membersCopy.splice(index, 1)
                        }
                    }
                    updated.memberIds = [...new Set(membersCopy)];

                } catch (e) {
                    console.log(e)
                }
            }))
        }
        setIsEditPopupOpen(false)
        updateGroup()
    }

    const handleDeleteSubUser = async (user) => {
        const todelete = await DataStore.query(Users, user.id);
        await DataStore.delete(todelete);
        updateGroup()
    }

    return (<>{dbUser && <div key={user.id} className={index%2 === 0 ? "even" : "odd"}>
            <button onClick={() => setIsEditPopupOpen(true)}>Set groups</button>
            <div className="name">
                {user.displayName}
                {usingUserId === user.id ? ' (current)' : ''}
            </div>
            <button onClick={(e) => handleViewEditAsUser(e, user)} className="viewEditButton">view/edit as {user.displayName}</button>

            <IconButton
                displayName={'delete'}
                icon={<FontAwesomeIcon icon={faTimesCircle} size="lg"/>}
                onClick={() => handleDeleteSubUser(user)}
                confirm={true}
                confirmText={`Are you sure you want to delete the user ${user.displayName}?`}
            />
            <GroupMultiSelectPopup onSubmit={(e) => submitUpdateSubUser(e, user.id)} isOpen={isEditPopupOpen} setIsOpen={setIsEditPopupOpen} initialSelected={user.groupIds} selectedGroups={selectedEditGroups} setSelectedGroups={setSelectedEditGroups} userId={dbUser.id}/>
        </div>}
    </>
    );
}

