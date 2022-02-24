import React, {useEffect, useState, useRef, useLayoutEffect} from 'react';
import IconButton from "../Buttons/IconButton";
import './header.scss'
import SignOut from "../../helpers/signOut";
import {Auth} from "aws-amplify";
import ButtonAsText from "../Buttons/ButtonAsText";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faEllipsisV,
    faFileInvoiceDollar,
    faHamburger,
    faList,
    faPlus,
    faUserCircle
} from '@fortawesome/free-solid-svg-icons'
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
    const usernameRef = useRef(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

    useLayoutEffect(() => {
        console.log(usernameRef)
    }, [usernameRef])

    const renderAddItemPopup = () => {
        if (addItemPopupOpen) {
            return(
            <AddListItem
                close={closeAddListItem}
            />)
        }
    }

    const renderWidth = () => {
        console.log(usernameRef)
        return usernameRef.innerWidth;
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
        setMobileMenuOpen(false)
    }

    const renderCurrentUsersName = () => {
        console.log(usernameRef)
        if(!usingUser) return;
        try {
            if(usingUser && usingUser.isSubUser) {
                return <>
                    <span>{GetNameOrEmail(dbUser)}</span>
                    <span>{` (Viewing as ${GetNameOrEmail(usingUser)})`}</span>
                </>
            } else {
                return <span>{GetNameOrEmail(dbUser)}</span>
            }
        } catch(e) {
            console.log(e)
            return "loading..."
        }
    }


    const SignOut = async (e) => {
        e.preventDefault()
        try {
            await Auth.signOut();
            navigate('/')
            window.location.reload()
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }

    const switchToMainUser = () => {
        setUsingUserId(dbUser.id)
    }

    return (
        <div className="headerContainer">
            <div className="mobileHeader">
                {renderWidth()}
                <button type="button" className="menuToggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    <FontAwesomeIcon icon={faEllipsisV} size="2x" />
                </button>
                <div className="userNameSection" ref={usernameRef}>
                    <ButtonAsText  onClick={handleRedirectToHome}  displayName={renderCurrentUsersName()}/>
                    {usingUser && usingUser.isSubUser && <button className="switchToMainUserButton" onClick={switchToMainUser}>Switch to main user</button>}
                </div>
                <div className="myAccountButton">
                    <Link to="/account/account"><FontAwesomeIcon icon={faUserCircle} size="2x"/></Link>
                </div>
                <IconButton onClick={() => setAddItemPopupOpen(!addItemPopupOpen)} displayName={'add item'} icon={<FontAwesomeIcon icon={faPlus} size="2x"/>}/>
                <IconButton onClick={() => setListListPopupOpen(true)} displayName={'wishlist list'} icon={<FontAwesomeIcon icon={faList} size="2x"/>}/>
                <div className="mobileMenu">
                    <Modal isOpen={mobileMenuOpen} close={() => setMobileMenuOpen(false)}>
                        <div className="mobileMenuContent">
                            <ul>
                                <li>
                                    <div className="selectGroup">
                                        <GroupSelect/>
                                    </div>
                                </li>
                                <li>
                                    <div className="userNameSection">
                                        <ButtonAsText  onClick={handleRedirectToHome}  displayName={renderCurrentUsersName()}/>
                                        {usingUser && usingUser.isSubUser && <button className="switchToMainUserButton" onClick={switchToMainUser}>Switch to main user</button>}
                                    </div>
                                </li>
                                <li onClick={() => setMobileMenuOpen(false)}>
                                    <Link to="/account/account">
                                        <FontAwesomeIcon icon={faUserCircle} size="2x" />
                                        <span>Account</span>
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={() => {
                                        setAddItemPopupOpen(!addItemPopupOpen)
                                        setMobileMenuOpen(false)
                                    }}>
                                        <FontAwesomeIcon icon={faPlus} size="2x" />
                                        <span>Add to wishlist</span>
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => {
                                        setListListPopupOpen(true)
                                        setMobileMenuOpen(false)
                                    }}>
                                        <FontAwesomeIcon icon={faList} size="2x" />
                                        <span>All wishlists</span>
                                    </button>
                                </li>
                                <li>
                                    <button onClick={(e) => {
                                        setMoneyPopupOpen(true)
                                        setMobileMenuOpen(false)
                                    }}>
                                        <FontAwesomeIcon icon={faFileInvoiceDollar} size="2x" />
                                        <span>Money</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </Modal>
                </div>
            </div>
            <div className="desktopHeader">
                <div className="selectGroup">
                    <GroupSelect/>
                </div>
                <div className="userNameSection">
                    <ButtonAsText  onClick={handleRedirectToHome}  displayName={renderCurrentUsersName()}/>
                    {usingUser && usingUser.isSubUser && <button className="switchToMainUserButton" onClick={switchToMainUser}>Switch to main user</button>}
                </div>
                <span className="signOutButton">
                   <ButtonAsText onClick={SignOut} displayName={'Sign Out'}/>
                </span>
                <div className="myAccountButton">
                    <Link to="/account/account"><FontAwesomeIcon icon={faUserCircle} size="2x"/></Link>
                </div>

                <IconButton onClick={(e) => setMoneyPopupOpen(true)} displayName={'money'} icon={<FontAwesomeIcon icon={faFileInvoiceDollar} size="2x" />}/>
                <IconButton onClick={() => setAddItemPopupOpen(!addItemPopupOpen)} displayName={'add item'} icon={<FontAwesomeIcon icon={faPlus} size="2x"/>}/>
                <IconButton onClick={() => setListListPopupOpen(true)} displayName={'wishlist list'} icon={<FontAwesomeIcon icon={faList} size="2x"/>}/>
            </div>
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

