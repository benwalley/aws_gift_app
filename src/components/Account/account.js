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

export default function Account() {
    const location = useLocation()

    return (
        <div className="accountContainer">
            <div className="leftContainer">
                <Link to={`/account/account`}>Your Information</Link>
                <Link to={`/account/subusers`}>Sub users</Link>
                <Link to={`/account/group`}>Current Group</Link>
                <Link to={`/account/groups`}>Groups</Link>
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
