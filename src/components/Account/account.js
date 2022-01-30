import React, {useEffect, useState} from 'react';
import YourGettingList from './YourGettingList/yourGettingList'
import './account.scss'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useNavigate,
    useMatch,
    Routes,
    useLocation, Outlet
} from "react-router-dom";
//TODO: add ability to make other people Admins

export default function Account() {
    const location = useLocation()

    return (
        <div className="accountContainer">
            <div className="leftContainer">
                <Link to={`/account/account`}>Your Information</Link>
                <Link to={`/account/group`}>Your Group</Link>
                <Link to={`/account/subusers`}>Sub users</Link>
            </div>
            <div className="centerContainer">
                <Outlet/>
            </div>
            <div className="rightContainer">
                <YourGettingList/>
            </div>
        </div>
    );
}
