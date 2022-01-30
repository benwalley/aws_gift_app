import React, {useEffect, useState} from 'react';
import {useRecoilValueLoadable} from "recoil";
import {personById} from "../../../../recoil/selectorFamilies";

export default function UserName(props) {
    const {id} = props

    const user = useRecoilValueLoadable(personById(id));
    const [name, setName] = useState('loading...')

    useEffect(() => {
        if(user.state === "hasValue") {
            setName(user.contents.displayName)
        }
    }, [id, user]);

    return (
        <>{name}</>
    );
}

