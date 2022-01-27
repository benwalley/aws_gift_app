import React, {useEffect, useState} from 'react';
import './yourGettingList.scss'
import {useRecoilValue} from "recoil";
import {yourGettingList, youWantToGetList} from "../../../recoil/selectors";

export default function Dropdowns() {
    const yourGetting = useRecoilValue(yourGettingList)
    const wantToGet = useRecoilValue(youWantToGetList)

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

