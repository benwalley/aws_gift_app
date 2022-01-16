import React, {useEffect, useState} from 'react';
import './App.scss';
import Amplify, {Auth, DataStore} from 'aws-amplify';
import {AmplifyAuthContainer, AmplifyAuthenticator, AmplifySignUp} from '@aws-amplify/ui-react';
import {AuthState, onAuthUIStateChange} from '@aws-amplify/ui-components';
import awsconfig from './aws-exports';
import Dashboard from "./components/Dashboard/dashboard";
import Header from "./components/Header/header";
import './colors.scss'
import {Users, Wishlist, WishlistItems} from "./models";
import createUsersWishlist from "./helpers/createUserWishlist";
import CreateDBUserFromUser from "./helpers/createDBUserFromUser";
import FirstTimePopup from "./components/FirstTimePopup/firstTimePopup";
import Modal from "./components/Modal/modal";

Amplify.configure(awsconfig);
// TODO: when you add "invites" it creates a "user" and when they first log in, it looks to see if a group exists. (if multiple, they can choose one)
// TODO: style gottena nd wats to get indicators
// todo: add number of comments to side list
// TODO: add list of what you're getting
// TODO: (maybe) let users upload profile pic
// TODO: Add priority, and let people sort list by priority (or price)

const AuthStateApp = () => {
    const [authState, setAuthState] = useState();
    const [authUser, setAuthUser] = useState(); //
    // The currently visible wishlist
    const [visibleWishlistOwnerId, setTheVisibleWishlistOwnerId] = useState(undefined); // owner of the wishlist currently being displayed
    const [visibleWishlist, setVisibleWishlist] = useState(undefined); // data for the wishlist currently being displayed
    const [visibleWishlistItems, setVisibleWishlistItems] = useState([]); // item in current wishlist
    // The currently visible large wishlist item
    const [largeWishlistItemData, setLargeWishlistItemData] = useState(undefined)
    const [largeWishlistItemId, setLargeWishlistItemId] = useState(undefined)

    const [dbUser, setDbUser] = useState(undefined); // The user data from the DB
    const [usingUser, setUsingUser] = useState(undefined); // The current user who you are using. (could be a subuser)
    const [firstTimePopupOpen, setFirstTimePopupOpen] = useState(false) // popup state
    const [errorsContent, setErrorsContent] = useState([]) // Error messages
    const [successContent, setSuccessContent] = useState([]) // Error messages
    const [currentPage, setCurrentPage] = useState('/')

    // Whenever page is loaded, check if there is a DB user created, and if not, create one and show startup screen.
    useEffect(() => {
        doInitialize(); // do initialization once the authorized user is set
    }, [authUser, currentPage])



    useEffect(() => {
        updateVisibleWishlist()
    }, [largeWishlistItemId, visibleWishlistOwnerId])

    useEffect(() => {
        updateVisibleItemData()
    }, [largeWishlistItemId])

    useEffect(() => {
        return onAuthUIStateChange((nextAuthState, authData) => {
            setAuthState(nextAuthState);
            setAuthUser(authData)
        });
    }, []);

    const setVisibleWishlistOwnerId = (id) => {
        setTheVisibleWishlistOwnerId(id)
        setLargeWishlistItemId(undefined);
    }

    // Do all initialization, like creating the user and such.
    const doInitialize = async () => {
        if(!authUser) return;
        // create the DB user, or set it
        try {
            const theDbUser = await updateDBUser(); // set dbUser state, and create the user if needed.
            const newWishlist = await createUserWishlistIfNeeded(theDbUser)
            setVisibleWishlistOwnerId(theDbUser.id)
            await updateVisibleWishlist(theDbUser.id)
        } catch(e) {

        }
    }
    // should only be done once when the page is loaded
    const createUserWishlistIfNeeded = async (newDbUser) => {
        if(!newDbUser) newDbUser = dbUser;
        if(!newDbUser || !newDbUser.id) return;
        try {
           const wishlists = await DataStore.query(Wishlist, c => c.ownerId("eq", newDbUser.id));
           if(!wishlists || wishlists.length === 0 ) {
            //   create an empty wishlist for the user
               const newWishlist = await createUsersWishlist(newDbUser.id)
               return newWishlist
            }
           return wishlists[0]
        } catch(e) {

        }
    }

    const addError = (string, timeout) => {
        if(!timeout) timeout = 5000
        const errorsCopy = [...errorsContent];
        errorsCopy.push(string)
        setErrorsContent([...errorsCopy])
        setTimeout(() => {
            const eCopy = [...errorsContent];
            const index = eCopy.indexOf(string);
            if(index) {
                eCopy.splice(index, 1)
                setErrorsContent([...eCopy])
            }
        }, timeout)

    }

    const addSuccess = (string, timeout) => {
        if(!timeout) timeout = 5000
        const successCopy = [...successContent];
        successCopy.push(string)
        setSuccessContent([...successCopy])
        setTimeout(() => {
            const sCopy = [...successContent];
            const index = sCopy.indexOf(string);
            if(index) {
                sCopy.splice(index, 1)
                setSuccessContent([...sCopy])
            }
        }, timeout)

    }

    const setUsingUserId = async (id) => {
        const dbUser = await DataStore.query(Users, id);
        setUsingUser(dbUser)
    }

    const updateDBUser = async () => {
        if(!authUser || !authUser.username) return;
        try {
            let userVar
            const dbUser = await DataStore.query(Users, c => c.emailAddress("eq", authUser.attributes.email));
            if(dbUser && dbUser.length > 0) {
                setDbUser(dbUser[0])
                setUsingUser(dbUser[0])
                userVar = dbUser[0]
            } else {
                // if this is their first time, create the user, and let them pick their stuff
                const newUser = await CreateDBUserFromUser(authUser)
                setDbUser(newUser)
                setUsingUser(newUser)
                userVar = newUser;
            }

            if(!userVar.groupId) {
                setFirstTimePopupOpen(true)
            }
            return userVar
        } catch(e) {
            console.log(e)
        }
    }

    const updateVisibleWishlist = async (ownerId) => {
        if(!ownerId) ownerId = visibleWishlistOwnerId
        try {
            const usersWishlists = await DataStore.query(Wishlist, c => c.ownerId("eq", ownerId));
            if(usersWishlists && usersWishlists.length > 0) {
                setVisibleWishlist(usersWishlists[0])
                await updateVisibleWishlistItems(usersWishlists[0].id);
                await updateVisibleItemData()
            } else if (usersWishlists && usersWishlists.length === 0) {
                // this means the query returned, but there are no wishlists created yet
                const newWishlist = await createUsersWishlist(ownerId);
                setVisibleWishlist(newWishlist)
                await updateVisibleWishlistItems(newWishlist.id);
                await updateVisibleItemData()
            }

        } catch(e) {
            // do nothing, it should try again
            console.log(e)
        }
    }

    const updateVisibleWishlistItems = async (id) => {
        try {
            const wishlistId = id ?? visibleWishlist.id
            const wishlistItems = await DataStore.query(WishlistItems, c => c.wishlistId("eq", wishlistId));
            setVisibleWishlistItems([...wishlistItems])

        } catch(e) {
            // do nothing, it should try again
            console.log(e)
        }
    }

    const updateVisibleItemData = async () => {
        try {
            if(!largeWishlistItemId) setLargeWishlistItemData({});
            const largeWishlistItem = await DataStore.query(WishlistItems, largeWishlistItemId);
            setLargeWishlistItemData(largeWishlistItem)
        } catch(e) {
            console.log(e)
        }

    }

    // custom sign up function to send custom values
    //TODO: I don't think I need this anymore
    const handleSignUp = async (formData) => {
        const param = {
            ...formData,
            attributes: {
                ...formData.attributes
            }
        }
        return await Auth.signUp(param);
    }

    return authState === AuthState.SignedIn && authUser ? (
        <div className="App">
            <div className="header">
                <Header
                    setDashboardWishlist={setVisibleWishlist}
                    user={dbUser}
                    authUser={authUser}
                    visibleWishlist={visibleWishlist}
                    updateVisibleWishlist={updateVisibleWishlist}
                    visibleWishhlistOwnerId={visibleWishlistOwnerId}
                    setVisibleWishlistOwnerId={setVisibleWishlistOwnerId}
                    setLargeWishlistItemId={setLargeWishlistItemId}
                    updateDBUser={updateDBUser}
                    usingUser={usingUser}
                    setUsingUserId={setUsingUserId}
                    addError={addError}
                    addSuccess={addSuccess}
                    setCurrentPage={setCurrentPage}
                />
            </div>

            <Dashboard
                user={dbUser}
                dbUser={dbUser}
                visibleWishlist={visibleWishlist}
                visibleWishlistItems={visibleWishlistItems}
                updateVisibleWishlist={updateVisibleWishlist}
                largeWishlistItemData={largeWishlistItemData}
                setLargeWishlistItemId={setLargeWishlistItemId}
                usingUser={usingUser}
                setUsingUserId={setUsingUserId}
                addError={addError}
                addSuccess={addSuccess}
            />
            <Modal isOpen={firstTimePopupOpen} close={() => setFirstTimePopupOpen(false)}>
                <FirstTimePopup close={() => setFirstTimePopupOpen(false)} user={dbUser} updateDBUser={updateDBUser} addSuccess={addSuccess} addError={addError}/>
            </Modal>
            {errorsContent && errorsContent.length > 0 && <div className="errorsDiv">
                {errorsContent.map((error, index) => {
                    return <div key={index} >{error}</div>
                })}
            </div>}
            {successContent && successContent.length > 0 && <div className="successDiv">
                {successContent.map((success, index) => {
                    return <div key={index} >{success}</div>
                })}
            </div>}
        </div>
    ) : (
        <AmplifyAuthContainer>
            <AmplifyAuthenticator>
                <AmplifySignUp
                    slot="sign-up"
                    usernameAlias="email"
                    formFields={[
                        { type: "email" },
                        {
                            type: "password",
                            label: "Password",
                        }
                    ]}
                    handleSignUp={handleSignUp}
                />
            </AmplifyAuthenticator>
        </AmplifyAuthContainer>
    );
}

export default AuthStateApp;
