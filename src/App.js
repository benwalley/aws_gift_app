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
import {dbUserState, usersGroupsState} from "./recoil/selectors";
import FirstPage from "./components/FirstPage/firstPage";
import currentGroupId from "./recoil/atoms/currentGroupId";
import currentGroupIdState from "./recoil/atoms/currentGroupId";
import currentGroupState from "./recoil/selectors/currentGroup";
import GroupsSection from "./components/Account/Groups/groups";
import {Groups, Users} from "./models";


Amplify.configure(awsconfig);
// TODO: (someday maybe) let users upload profile pic

const AuthStateApp = () => {
    const [authState, setAuthState] = useState()
    const [authUser, setAuthUser] = useState();
    const setAuthUsername = useSetRecoilState(authUserUsername)
    const setAuthEmail = useSetRecoilState(authUserEmail)
    const dbUserUpdate = useRecoilValueLoadable(dbUserState);
    const currentGroupIdUpdate = useRecoilValueLoadable(currentGroupIdState)
    const usersGroupsUpdate = useRecoilValueLoadable(usersGroupsState)
    const [dbUser, setDbUser] = useState()
    const [isValidated, setIsValidated] = useState(false)
    const [groupId, setGroupId] = useState()
    const [groups, setGroups] = useState()
    const setCurrentGroupId = useSetRecoilState(currentGroupIdState)

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

    useEffect(() => {
        if(currentGroupIdUpdate.state === "hasValue") {
            setGroupId(currentGroupIdUpdate.contents);
        }
    }, [currentGroupIdUpdate]);

    useEffect(() => {
        if(usersGroupsUpdate.state === "hasValue") {
            setGroups(usersGroupsUpdate.contents);
        }
    }, [usersGroupsUpdate]);

    useEffect(() => {
        initializeGroups()
    }, [groupId, groups]);

    const initializeGroups = async () => {
        // check if there is a group set.
        if(groupId) {
            // check if the user belongs to this group
            const groupData = await DataStore.query(Groups, groupId);
            if(groupData.memberIds.indexOf(dbUser.id) > -1) {
                // the user is a member of this group, we can continue
                setIsValidated(true)
                localStorage.setItem('wishlistGroup', groupId)
                return
            }
            // The user is not a member of that group. We need to set another group for them.
            const allGroups = await DataStore.query(Groups, c => c.memberIds("contains", dbUser.id));
            if(allGroups && allGroups.length > 0) {
                setCurrentGroupId(allGroups[0].id)
                return;
            }
            setIsValidated(false)
            return;
        }
        // check if there is a group stored in the local storage
        const savedGroupId = localStorage.getItem('wishlistGroup');
        if(savedGroupId) {
            // only set current group id if you are part of that group (because you might have signed out and signed in as another user.
            const currentGroupData = await DataStore.query(Groups, savedGroupId);
            if(!currentGroupData || !dbUser) {
                localStorage.setItem('wishlistGroup', '')
                return;
            }
            if(currentGroupData.memberIds.indexOf(dbUser.id) === -1) {
                // remove saved groupId
                localStorage.setItem('wishlistGroup', '')
            } else {
                setCurrentGroupId(savedGroupId)
            }
        }

        // If there is not a group set in local storage, check if there's only one group
        if(groups && groups.length > 0) {
            setCurrentGroupId(groups[0].id)
            return;
        }

    }

    return authState === AuthState.SignedIn && authUser ? (
        <div className="App">
            {!isValidated ? <FirstPage setIsValidated={setIsValidated}/> :
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
                        <Route path="subusers" element={<SubUsers/>} />
                        <Route path="group" element={<Group/>} />
                        <Route path="groups" element={<GroupsSection/>} />
                    </Route>
                </Routes>
            </Router>}
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
