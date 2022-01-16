import React, {useEffect, useState} from 'react';


export default function AdminUser(props) {
    const {user, handleClick} = props;

    return (
        <div className="adminUserListItem">
            <div className="name">{user.name}</div>
            <div>Is Admin</div>
            <input type="checkbox" checked={user.checked} onChange={handleClick}/>
        </div>
    );
}

