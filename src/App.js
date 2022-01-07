import React, {useEffect, useState} from 'react';
import './App.scss';
import Amplify, {Auth, DataStore} from 'aws-amplify';
import {AmplifyAuthContainer, AmplifyAuthenticator, AmplifySignUp} from '@aws-amplify/ui-react';
import {AuthState, onAuthUIStateChange} from '@aws-amplify/ui-components';
import awsconfig from './aws-exports';
import Dashboard from "./components/Dashboard/dashboard";
import Header from "./components/Header/header";
import './colors.scss'
import {Wishlist, WishlistItems} from "./models";
import createUsersWishlist from "./helpers/createUserWishlist";

Amplify.configure(awsconfig);

const AuthStateApp = () => {
    const [authState, setAuthState] = React.useState();
    const [user, setUser] = React.useState();
    const [myWishlist, setMyWishlist] = useState({})
    const [myWishlistId, setMyWishlistId] = useState(undefined)
    const [myWishlistItems, setMyWishlistItems] = useState([])

    const getMyWishlist = async () => {
        try {
            const myWishlists = await DataStore.query(Wishlist, c => c.ownerId("eq", user.username));
            if(myWishlists && myWishlists.length > 0) {
                setMyWishlistId(myWishlists[0].id)
                setMyWishlist(myWishlists[0])
            } else if (myWishlists && myWishlists.length === 0) {
                // this means the query returned, but there are no wishlists created yet
                const myUserWishlist = await createUsersWishlist(user);
                setMyWishlistId(myUserWishlist.id)
                setMyWishlist(myUserWishlist)
            }

        } catch(e) {
            // do nothing, it should try again
            console.log(e)
        }
    }

    const updateMyWishlistItems = async () => {
        try {
            const wishlistItems = await DataStore.query(WishlistItems, c => c.wishlistID("eq", myWishlistId));
            if(wishlistItems && wishlistItems.length > 0) {
                setMyWishlistItems([...wishlistItems])
            }
            console.log(wishlistItems)

        } catch(e) {
            // do nothing, it should try again
            console.log(e)
        }
    }

    useEffect(() => {
        getMyWishlist();
    }, [user])

    useEffect(() => {
        updateMyWishlistItems();
    }, [myWishlistId])

    useEffect(() => {
        return onAuthUIStateChange((nextAuthState, authData) => {
            setAuthState(nextAuthState);
            setUser(authData)
        });
    }, []);

    // custom sign up function to send custom values
    const handleSignUp = async (formData) => {
        const param = {
            ...formData,
            attributes: {
                ...formData.attributes,
                'custom:isAdmin': 'false',
                'custom:group': formData.username
            }
        }
        return await Auth.signUp(param);
    }

    return authState === AuthState.SignedIn && user ? (
        <div className="App">
            <div className="header">
                <Header user={user} updateMyWishlistItems={updateMyWishlistItems}/>
            </div>

            <Dashboard user={user} myWishlist={myWishlist} myWishlistItems={myWishlistItems} updateMyWishlistItems={updateMyWishlistItems}/>
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
