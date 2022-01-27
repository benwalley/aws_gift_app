import React, {useEffect, useState} from 'react';
import IconButton from "../Buttons/IconButton";
import './header.scss'
import SignOut from "../../helpers/signOut";
import ButtonAsText from "../Buttons/ButtonAsText";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faFileInvoiceDollar, faList, faPlus} from '@fortawesome/free-solid-svg-icons'
import AddListItem from "../AddListItem/addListItem";
import MyAccountPopup from "../MyAccountPopup/myAccountPopup";
import Modal from "../Modal/modal";
import MoneyModal from "../MoneyModal/moneyModal";
import ListList from "../ListList/listList";
import GetNameOrEmail from "../../helpers/getNameOrEmail";
import {Link, useNavigate} from "react-router-dom";
import {DataStore} from "@aws-amplify/datastore";
import {Users, Wishlist} from "../../models";
import {useRecoilState, useRecoilValue} from "recoil";
import {dbUserState, usingUserState} from "../../recoil/selectors";
import createUsersWishlist from "../../helpers/createUserWishlist";


export default function Header(props) {
    const {} = props;

    const usingUser = useRecoilValue(usingUserState);
    const dbUser = useRecoilValue(dbUserState);

    const [addItemPopupOpen, setAddItemPopupOpen] = useState(false)
    const [myAccountPopupOpen, setMyAccountPopupOpen] = useState(false)
    const [moneyPopupOpen, setMoneyPopupOpen] = useState(false)
    const [listListPopupOpen, setListListPopupOpen] = useState(false)
    const navigate = useNavigate()

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

    const renderMyAccountPopup = () => {
        if(myAccountPopupOpen) {
            return <MyAccountPopup
                close={closeAccountPopup}
            />
        }
    }

    const closeAccountPopup = (e) => {
        if(e) e.preventDefault();
        setMyAccountPopupOpen(false)
    }
    //
    const handleRedirectToHome = async (e) => {
        try {
            e.preventDefault();
            let wishlist = await DataStore.query(Wishlist, c => c.ownerId("eq", dbUser.id));
            if(!wishlist || wishlist.length === 0) {
                // we need to create their wishlist
                wishlist = await createUsersWishlist(dbUser)
                navigate(`/${wishlist.id}`)
            }
            try {
                navigate(`/${wishlist[0].id}`)
            } catch(e) {
                console.log(e)
            }

        } catch(e) {
            console.log(e)
        }
    }

    const renderCurrentUsersName = () => {
        console.log(usingUser)
        if(!usingUser) return;
        try {
            if(usingUser && usingUser.isSubUser) {
                return (`${GetNameOrEmail(usingUser)} (Viewing as ${ GetNameOrEmail(usingUser)})`)
            } else {
                return GetNameOrEmail(usingUser)
            }
        } catch(e) {
            console.log(e)
            return "loading..."
        }

    }

    return (
        <div className="headerContainer">
            <ButtonAsText onClick={handleRedirectToHome} displayName={"My Dashboard"}/>
            <ButtonAsText  onClick={handleRedirectToHome}  displayName={renderCurrentUsersName()}/>
            <div className="myAccountButton">
                <Link to="/account/account">My Account</Link>
                {/*<ButtonAsText onClick={() => setMyAccountPopupOpen(true)} displayName={'My Account'}/>*/}
            </div>
            <span className="signOutButton">
               <ButtonAsText onClick={SignOut} displayName={'Sign Out'}/>
            </span>
            <IconButton onClick={(e) => setMoneyPopupOpen(true)} displayName={'money'} icon={<FontAwesomeIcon icon={faFileInvoiceDollar} size="2x" />}/>
            <IconButton onClick={() => setAddItemPopupOpen(!addItemPopupOpen)} displayName={'add item'} icon={<FontAwesomeIcon icon={faPlus} size="2x"/>}/>
            <IconButton onClick={() => setListListPopupOpen(true)} displayName={'wishlist list'} icon={<FontAwesomeIcon icon={faList} size="2x"/>}/>
            {/* popups which will all be absolutely positioned*/}
            {renderAddItemPopup()}
            {renderMyAccountPopup()}
            <Modal isOpen={moneyPopupOpen} close={() => setMoneyPopupOpen(false)}>
                <MoneyModal/>
            </Modal>
            <Modal isOpen={listListPopupOpen} close={() => setListListPopupOpen(false)}>
                <ListList close={() => setListListPopupOpen(false)}/>
            </Modal>
        </div>
    );
}

