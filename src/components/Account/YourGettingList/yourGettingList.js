import React, {useEffect, useState} from 'react';
import './yourGettingList.scss'
import {useRecoilValue, useRecoilValueLoadable} from "recoil";
import {yourGettingList, youWantToGetList} from "../../../recoil/selectors";
import {personById} from "../../../recoil/selectorFamilies";
import UserName from "./UserName/userName";
import {useNavigate} from "react-router";

export default function YourGettingList() {
    const yourGettingUpdate = useRecoilValueLoadable(yourGettingList)
    const wantToGetUpdate = useRecoilValueLoadable(youWantToGetList)
    // State values
    const [yourGetting, setYourGetting] = useState([])
    const [wantToGet, setWantToGet] = useState([])
    const navigate = useNavigate()


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

    const handleGoToItem = (e, item) => {
        e.preventDefault()
        navigate(`/${item.wishlistId}/${item.id}`)
    }

    const getYourGettingList = () => {
        return yourGetting.map((item, index) => {
            return <button key={item.id}  onClick={(e) => handleGoToItem(e, item)} className={index%2 === 1 ? "even" : "odd"}>
                <div className="item">{item.name}</div>
                <div className="person"><UserName id={item.ownerId}/></div>
            </button>
        })
    }

    const getWantToGetList = () => {
        return wantToGet.map((item, index) => {
            return <button key={item.id}  onClick={(e) => handleGoToItem(e, item)} className={index%2 === 1 ? "even" : "odd"}>
                <div className="item">{item.name}</div>
                <div className="person"><UserName id={item.ownerId}/></div>
            </button>
        })
    }

    return (
        <div className="yourGettingListContainer">
            <div className="themeList">
                <h2>You're getting</h2>
                <div className="evenHeader">
                    <div className="headerItem">Gift</div>
                    <div className="headerPerson">Person</div>
                </div>
                {getYourGettingList()}
            </div>

            <div className="themeList">
                <h2>You want to get</h2>
                <div className="evenHeader">
                    <div className="headerItem">Gift</div>
                    <div className="headerPerson">Person</div>
                </div>
                {getWantToGetList()}
            </div>
        </div>
    );
}

