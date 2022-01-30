import React, {useEffect, useState} from 'react';
import './App.scss';
import Amplify, {Auth, DataStore} from 'aws-amplify';
import {AmplifyAuthContainer, AmplifyAuthenticator, AmplifySignUp} from '@aws-amplify/ui-react';
import {AuthState, onAuthUIStateChange} from '@aws-amplify/ui-components';
import awsconfig from './aws-exports';
import Dashboard from "./components/Dashboard/dashboard";
import Header from "./components/Header/header";
import './colors.scss'
import './global.scss'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FirstTimePopup from "./components/FirstTimePopup/firstTimePopup";
import Modal from "./components/Modal/modal";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import {
   useRecoilValueLoadable, useSetRecoilState,
} from 'recoil';
import {authUserEmail,  authUserUsername, } from './recoil/atoms'
import Account from "./components/Account/account";
import YourInfo from "./components/Account/YourInfo/yourInfo";
import Group from "./components/Account/Group/group";
import SubUsers from "./components/Account/SubUsers/subUsers";
import {dbUserState} from "./recoil/selectors";


Amplify.configure(awsconfig);
// TODO: add list of what you're getting
// TODO: (someday maybe) let users upload profile pic
// TODO: mobile styling
// TODO: add better loading states

const AuthStateApp = () => {
    const [authState, setAuthState] = useState()
    const [authUser, setAuthUser] = useState();
    const setAuthUsername = useSetRecoilState(authUserUsername)
    const setAuthEmail = useSetRecoilState(authUserEmail)
    const [firstTimePopupOpen, setFirstTimePopupOpen] = useState(false) // popup state
    const dbUserUpdate = useRecoilValueLoadable(dbUserState);
    const [dbUser, setDbUser] = useState()

    useEffect(() => {
        return onAuthUIStateChange((nextAuthState, authData) => {
            setAuthState(nextAuthState);
            setAuthUser(authData)
            if(authData) {
                setAuthUsername(authData.username)
                setAuthEmail(authData.attributes.email)
            }
        });
    }, []);

    useEffect(() => {
        if(dbUserUpdate.state === "hasValue") {
            setDbUser(dbUserUpdate.contents);
        }
    }, [dbUserUpdate]);

    // show first time popup if necessary
    useEffect(() => {
        showFirstTimePopupIfNeeded()
    }, [dbUser]);

    const showFirstTimePopupIfNeeded = () => {
        if(!dbUser) return;
        if(!dbUser.groupId || dbUser.displayName === "noname") {
            setFirstTimePopupOpen(true)
        }
    }

    return authState === AuthState.SignedIn && authUser ? (
        <div className="App">
                <Router>
                    <div className="header">
                        <Header/>
                    </div>

                    <Routes>
                        <Route path='/' element={<Dashboard/>}>
                            <Route path='/:wishlistId' element={<Dashboard/>}>
                                <Route path='/:wishlistId/:itemId' element={<Dashboard/>}/>
                            </Route>
                        </Route>
                        <Route path='account' element={<Account/>}>
                            <Route path="account" element={<YourInfo/>} />
                            <Route path="group" element={<Group/>} />
                            <Route path="subusers" element={<SubUsers/>} />
                        </Route>
                    </Routes>

                    <Modal isOpen={firstTimePopupOpen} close={() => setFirstTimePopupOpen(false)}>
                        <FirstTimePopup close={() => setFirstTimePopupOpen(false)}/>
                    </Modal>
                </Router>
            <ToastContainer />
        </div>
    ) : (
        <AmplifyAuthContainer>
            <AmplifyAuthenticator>
                <AmplifySignUp
                    slot="sign-up"
                    usernameAlias="email"
                    formFields={[
                        {type: "email"},
                        {
                            type: "password",
                            label: "Password",
                        }
                    ]}
                />
            </AmplifyAuthenticator>
        </AmplifyAuthContainer>
    );
}

export default AuthStateApp;
