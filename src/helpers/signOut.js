import {Auth} from "aws-amplify";

export default async function SignOut(e) {
    e.preventDefault()
    try {
        await Auth.signOut();
        window.location.reload();
    } catch (error) {
        console.log('error signing out: ', error);
    }
}


