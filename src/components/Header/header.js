import React, {useEffect, useState} from 'react';
import TextButton from "../Buttons/TextButton";
import IconButton from "../Buttons/IconButton";
import './header.scss'
import SignOut from "../../helpers/signOut";
import ButtonAsText from "../Buttons/ButtonAsText";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDollarSign, faFileInvoiceDollar, faPlus, faList } from '@fortawesome/free-solid-svg-icons'
import AddListItem from "../AddListItem/addListItem";


export default function Header(props) {
    const {user, updateMyWishlistItems} = props
    const [addItemPopupOpen, setAddItemPopupOpen] = useState(false)

    const getAddItemPopup = () => {
        if(addItemPopupOpen) {
            return <AddListItem updateMyWishlistItems={updateMyWishlistItems} user={user} close={(e) => {
                if(e) {
                    e.preventDefault();
                }
                setAddItemPopupOpen(false)}
            }
                />

        }
    }

    return (
        <div className="headerContainer">
            <ButtonAsText displayName={"My Dashboard"}/>
            <ButtonAsText displayName={'Current Wishlist'}/>
            <span className="signOutButton">
               <ButtonAsText onClick={SignOut} displayName={'Sign Out'}/>
            </span>
            {/*<IconButton displayName={'money'} icon={<FontAwesomeIcon icon={faDollarSign} size="2x" />}/>*/}
            <IconButton displayName={'money'} icon={<FontAwesomeIcon icon={faFileInvoiceDollar} size="2x" />}/>
            <IconButton onClick={() => setAddItemPopupOpen(!addItemPopupOpen)} displayName={'add item'} icon={<FontAwesomeIcon icon={faPlus} size="2x"/>}/>
            <IconButton displayName={'wishlist list'} icon={<FontAwesomeIcon icon={faList} size="2x"/>}/>
            {/* popups which will all be absolutely positioned*/}
            {getAddItemPopup()}
        </div>
    );
}

