import React, {useEffect, useState} from 'react';
import IconButton from "../Buttons/IconButton";
import './header.scss'
import SignOut from "../../helpers/signOut";
import ButtonAsText from "../Buttons/ButtonAsText";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faFileInvoiceDollar, faList, faPlus} from '@fortawesome/free-solid-svg-icons'
import AddListItem from "../AddListItem/addListItem";
import Modal from "../Modal/modal";
import MoneyModal from "../MoneyModal/moneyModal";
import ListList from "../ListList/listList";
import GetNameOrEmail from "../../helpers/getNameOrEmail";
import {Link, useNavigate} from "react-router-dom";
import {DataStore} from "@aws-amplify/datastore";
import {Users, Wishlist} from "../../models";
import {useRecoilState, useRecoilValue, useRecoilValueLoadable, useSetRecoilState} from "recoil";
import {dbUserState, usingUserState} from "../../recoil/selectors";
import createUsersWishlist from "../../helpers/createUserWishlist";
import {usingUserIdState} from "../../recoil/atoms";
import GroupSelect from "../GroupSelect/groupSelect";


export default function Header(props) {
    const {} = props;

    const usingUserUpdate = useRecoilValueLoadable(usingUserState);
    const setUsingUserId = useSetRecoilState(usingUserIdState)

    const [addItemPopupOpen, setAddItemPopupOpen] = useState(false)
    const [moneyPopupOpen, setMoneyPopupOpen] = useState(false)
    const [listListPopupOpen, setListListPopupOpen] = useState(false)
    const navigate = useNavigate()
    const dbUserUpdate = useRecoilValueLoadable(dbUserState);
    // State values
    const [dbUser, setDbUser] = useState()
    const [usingUser, setUsingUser] = useState()
    const [selectedGroups, setSelectedGroups] = useState([])

    useEffect(() => {
        if(dbUserUpdate.state === "hasValue") {
            setDbUser(dbUserUpdate.contents);
        }
    }, [dbUserUpdate]);

    useEffect(() => {
        if(usingUserUpdate.state === "hasValue") {
            setUsingUser(usingUserUpdate.contents);
        }
    }, [usingUserUpdate]);

    const renderAddItemPopup = () => {
        if (addItemPopupOpen) {
            return(
            <AddListItem
                close={closeAddListItem}
            />)
        }
    }

    const closeAddListItem = (e) => {
        if(e) e.preventDefault();
        setAddItemPopupOpen(false)
    }

    const handleRedirectToHome = async (e) => {
        try {
            e.preventDefault();
            let wishlist = await DataStore.query(Wishlist, c => c.ownerId("eq", dbUser.id));
            if(!wishlist || wishlist.length === 0) {
                // we need to create their wishlist
                wishlist = await createUsersWishlist(dbUser)
                setUsingUserId(dbUser.id)
                navigate(`/${wishlist.id}`)
            }
            try {
                setUsingUserId(dbUser.id)
                navigate(`/${wishlist[0].id}`)
            } catch(e) {
                console.log(e)
            }

        } catch(e) {
            console.log(e)
        }
    }

    const renderCurrentUsersName = () => {
        if(!usingUser) return;
        try {
            if(usingUser && usingUser.isSubUser) {
                return (`${GetNameOrEmail(dbUser)} (Viewing as ${ GetNameOrEmail(usingUser)})`)
            } else {
                return GetNameOrEmail(dbUser)
            }
        } catch(e) {
            console.log(e)
            return "loading..."
        }
    }

    return (
        <div className="headerContainer">
            <div className="selectGroup">
                <GroupSelect/>
            </div>
            <ButtonAsText  onClick={handleRedirectToHome}  displayName={renderCurrentUsersName()}/>
            <div className="myAccountButton">
                <Link to="/account/account">My Account</Link>
            </div>
            <span className="signOutButton">
               <ButtonAsText onClick={SignOut} displayName={'Sign Out'}/>
            </span>
            <IconButton onClick={(e) => setMoneyPopupOpen(true)} displayName={'money'} icon={<FontAwesomeIcon icon={faFileInvoiceDollar} size="2x" />}/>
            <IconButton onClick={() => setAddItemPopupOpen(!addItemPopupOpen)} displayName={'add item'} icon={<FontAwesomeIcon icon={faPlus} size="2x"/>}/>
            <IconButton onClick={() => setListListPopupOpen(true)} displayName={'wishlist list'} icon={<FontAwesomeIcon icon={faList} size="2x"/>}/>
            {/* popups which will all be absolutely positioned*/}
            {renderAddItemPopup()}
            <Modal isOpen={moneyPopupOpen} close={() => setMoneyPopupOpen(false)}>
                <MoneyModal/>
            </Modal>
            <Modal isOpen={listListPopupOpen} close={() => setListListPopupOpen(false)}>
                <ListList close={() => setListListPopupOpen(false)} selectedGroups={selectedGroups} setSelectedGroups={setSelectedGroups}/>
            </Modal>
        </div>
    );
}

