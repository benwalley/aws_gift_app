import {DataStore} from "@aws-amplify/datastore";
import {Users} from "../models";


export default async function GetUserById(id) {
    try {
        return await DataStore.query(Users, id);
    } catch (e) {
        console.log(e)
    }
}


