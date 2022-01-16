import {DataStore} from "@aws-amplify/datastore";
import {Users} from "../models";


export default async function CreateDBUserFromUser(user) {
    try {
        const userData = {
            "displayName": 'noname',
            "userUsername": user.username,
            "emailAddress": user.attributes.email
        }
        const response = await DataStore.save(
            new Users(userData)
        );
        return response;

    } catch (e) {
        return "failed"
    }
}


