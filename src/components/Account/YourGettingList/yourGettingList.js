import React, {useEffect, useState} from 'react';
import './yourGettingList.scss'
import {useRecoilValueLoadable} from "recoil";
import {yourGettingList, youWantToGetList} from "../../../recoil/selectors";

export default function YourGettingList() {
    const yourGettingUpdate = useRecoilValueLoadable(yourGettingList)
    const wantToGetUpdate = useRecoilValueLoadable(youWantToGetList)
    // State values
    const [yourGetting, setYourGetting] = useState([])
    const [wantToGet, setWantToGet] = useState([])

    useEffect(() => {
        if(yourGettingUpdate.state === "hasValue") {
            setYourGetting(yourGettingUpdate.contents);
        }
    }, [yourGettingUpdate]);

    useEffect(() => {
        if(wantToGetUpdate.state === "hasValue") {
            setWantToGet(wantToGetUpdate.contents);
        }
    }, [wantToGetUpdate]);

    const getYourGettingList = () => {
        return (<div className="list">
            {yourGetting.map((item, index) => {
                return <div>{item.name}</div>
            })}
        </div>)
    }

    const getWantToGetList = () => {
        return (<div className="list">
            {wantToGet.map((item, index) => {
                return <div>{item.name}</div>
            })}
        </div>)
    }

    return (
        <div className="yourGettingListContainer">
            <h2>You're getting</h2>
            {getYourGettingList()}

            <h2>You want to get</h2>
            {getWantToGetList()}
        </div>
    );
}

