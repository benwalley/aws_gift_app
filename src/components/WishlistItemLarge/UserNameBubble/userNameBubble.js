import React, {useEffect, useState} from 'react';
import {DataStore} from "@aws-amplify/datastore";
import {Users} from "../../../models";
import GetNameOrEmail from "../../../helpers/getNameOrEmail";
import './userNameBubble.scss'

export default function UserNameBubble(props) {
    const {id, classString} = props
    const [user, setUser] = useState()

    useEffect(() => {
        updateUser()
    }, [id])

    const updateUser = async () => {
        if(!id) return
        const theUser = await  DataStore.query(Users, id);
        setUser(theUser)
    }

    const getClassName = () => {
        if(classString) return classString
        return 'noClass'
    }

    return (
        <div className="userNameBubble">
            {user && <div className={getClassName()}>
                {GetNameOrEmail(user)}
            </div>}
        </div>
    );
}

