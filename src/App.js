import React from 'react';
import './App.scss';
import Amplify, {Auth} from 'aws-amplify';
import {AmplifyAuthContainer, AmplifyAuthenticator, AmplifySignUp} from '@aws-amplify/ui-react';
import {AuthState, onAuthUIStateChange} from '@aws-amplify/ui-components';
import awsconfig from './aws-exports';
import Dashboard from "./components/Dashboard/dashboard";
import Header from "./components/Header/header";
import './colors.scss'

Amplify.configure(awsconfig);

const AuthStateApp = () => {
    const [authState, setAuthState] = React.useState();
    const [user, setUser] = React.useState();

    React.useEffect(() => {
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
                <Header user={user}/>
            </div>

            <Dashboard user={user}/>
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
