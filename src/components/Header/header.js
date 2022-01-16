import React, {useEffect, useState} from 'react';
import TextButton from "../Buttons/TextButton";
import IconButton from "../Buttons/IconButton";
import './header.scss'
import SignOut from "../../helpers/signOut";
import ButtonAsText from "../Buttons/ButtonAsText";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDollarSign, faFileInvoiceDollar, faPlus, faList } from '@fortawesome/free-solid-svg-icons'
import AddListItem from "../AddListItem/addListItem";
import MyAccountPopup from "../MyAccountPopup/myAccountPopup";
import Modal from "../Modal/modal";
import MoneyModal from "../MoneyModal/moneyModal";
import ListList from "../ListList/listList";
import GetNameOrEmail from "../../helpers/getNameOrEmail";

export default function Header(props) {
    const {user,
        usingUser,
        setUsingUserId,
        authUser,
        updateDBUser,
        setLargeWishlistItemId,
        setVisibleWishlistOwnerId,
        visibleWishlistOwnerId,
        updateVisibleWishlist,
        visibleWishlist,
        addError,
        addSuccess,
        setCurrentPage
    } = props;

    const [addItemPopupOpen, setAddItemPopupOpen] = useState(false)
    const [myAccountPopupOpen, setMyAccountPopupOpen] = useState(false)
    const [moneyPopupOpen, setMoneyPopupOpen] = useState(false)
    const [listListPopupOpen, setListListPopupOpen] = useState(false)

    const getAddItemPopup = () => {
        if(addItemPopupOpen) {
            let addListItem = <AddListItem
                updateVisibleWishlist={updateVisibleWishlist}
                visibleWishlistOwnerId={visibleWishlistOwnerId}
                visibleWishlist={visibleWishlist}
                usingUser={usingUser}
                authUser={user}
                addError={addError}
                addSuccess={addSuccess}
                close={closeAddListItem}
            />;
            return addListItem
        }
    }

    const closeAddListItem = (e) => {
        if(e) e.preventDefault();
        setAddItemPopupOpen(false)
    }

    const getMyAccountPopup = () => {
        if(myAccountPopupOpen) {
            return <MyAccountPopup
                setVisibleWishlistOwnerId={setVisibleWishlistOwnerId}
                usingUser={usingUser}
                authUser={authUser}
                updateVisibleWishlist={updateVisibleWishlist}
                setLargeWishlistItemId={setLargeWishlistItemId}
                updateDBUser={updateDBUser}
                setUsingUserId={setUsingUserId}
                dbUser={user}
                addError={addError}
                addSuccess={addSuccess}
                close={closeAccountPopup}
                setCurrentPage={setCurrentPage}
            />
        }
    }

    const closeAccountPopup = (e) => {
        if(e) e.preventDefault();
        setMyAccountPopupOpen(false)
    }

    const handleRedirectToHome = (e) => {
        try {
            e.preventDefault();
            setUsingUserId(user.id)
            setLargeWishlistItemId(undefined)
            setVisibleWishlistOwnerId(user.id)
        } catch(e) {
            console.log(e)
        }
    }

    const getCurrentUsersName = () => {
        if(!usingUser) return;
        try {
            if(usingUser && usingUser.isSubUser) {
                return (`${GetNameOrEmail(user)} (Viewing as ${ GetNameOrEmail(usingUser)})`)
            } else {
                return GetNameOrEmail(user)
            }
        } catch(e) {
            console.log(e)
            return "loading..."
        }

    }

    return (
        <div className="headerContainer">
            <ButtonAsText onClick={handleRedirectToHome} displayName={"My Dashboard"}/>
            <ButtonAsText  onClick={handleRedirectToHome}  displayName={getCurrentUsersName()}/>
            <div className="myAccountButton">
                <ButtonAsText onClick={() => setMyAccountPopupOpen(true)} displayName={'My Account'}/>
            </div>
            <span className="signOutButton">
               <ButtonAsText onClick={SignOut} displayName={'Sign Out'}/>
            </span>
            <IconButton onClick={(e) => setMoneyPopupOpen(true)} displayName={'money'} icon={<FontAwesomeIcon icon={faFileInvoiceDollar} size="2x" />}/>
            <IconButton onClick={() => setAddItemPopupOpen(!addItemPopupOpen)} displayName={'add item'} icon={<FontAwesomeIcon icon={faPlus} size="2x"/>}/>
            <IconButton onClick={() => setListListPopupOpen(true)} displayName={'wishlist list'} icon={<FontAwesomeIcon icon={faList} size="2x"/>}/>
            {/* popups which will all be absolutely positioned*/}
            {getAddItemPopup()}
            {getMyAccountPopup()}
            <Modal isOpen={moneyPopupOpen} close={() => setMoneyPopupOpen(false)}>
                <MoneyModal user={user} addError={addError}/>
            </Modal>
            <Modal isOpen={listListPopupOpen} close={() => setListListPopupOpen(false)}>
                <ListList user={user} setVisibleWishlistOwnerId={setVisibleWishlistOwnerId} close={() => setListListPopupOpen(false)}/>
            </Modal>
        </div>
    );
}

