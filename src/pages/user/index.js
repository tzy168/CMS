import React from 'react';
import { useSelector } from "react-redux";
import './index.scss';
import { Avatar } from 'antd';


const User = () => {
    const userInfo = useSelector(state => state.user.userInfo);

    return (
        <div className="user">
            <div className="user-header">
                <Avatar src={userInfo.photo} size={48} className="avatar" />
                <span className="name">{userInfo.name}</span>
            </div>
            <div className="user-info">
                <div>
                    <span className="label">id:</span>
                    <span className="value">{userInfo.id}</span>
                </div>
                <div>
                    <span className="label">phone:</span>
                    <span className="value">{userInfo.mobile}</span>
                </div>
                <div>
                    <span className="label">sex:</span>
                    <span className="value">{userInfo.gender === 1 ? '男' : '女'}</span>
                </div>
                <div>
                    <span className="label">birth:</span>
                    <span className="value">{userInfo.birthday}</span>
                </div>
                <div>
                    <span className="label">intro:</span>
                    <span className="value">{userInfo.intro}</span>
                </div>
            </div>
        </div>
    );
};

export default User;