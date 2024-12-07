import React, { useEffect } from 'react';

import { DownOutlined } from '@ant-design/icons'
import { Layout, Menu, Dropdown, Avatar, message, Space } from 'antd';
import { logo } from '../../assets/images';
import { useLocation, useNavigate } from 'react-router-dom';
import './index.scss';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserInfo, clearUserInfo } from '../../store/modules/user';

const { Header } = Layout;

const Pageheader = () => {
    const navigate = useNavigate();
    const location = useLocation(); // 获取当前路径
    const userInfo = useSelector((state) => state.user.userInfo);
    const dispatch = useDispatch();
    const selectedKeys = [location.pathname];

    useEffect(() => {
        dispatch(fetchUserInfo())
    }, [dispatch])

    const items = [
        {
            label: (<span
                className='user-name'
                style={{ background: 'linear-gradient(180deg, #ffffff 0%, #ffe6e6 100%)' }}>
                账号:{userInfo.name}
            </span>),
            key: '0'
        },
        {
            label: '个人中心',
            key: '1',
        },
        {
            label: '退出登录',
            key: '2',
        },
    ];

    const pageItems = [
        {
            label: 'HOME',
            key: '/',
        },
        {
            label: 'ARTICLE',
            key: '/article',
        },
        {
            label: 'PUBLISH',
            key: '/publish',
        },
    ];

    const onClick = (key) => {
        if (key.key === '2') {
            if (window.confirm('确定要退出登录吗？')) {
                dispatch(clearUserInfo());
                navigate('/login');
                message.success('退出成功');
            }
        } else if (key.key === '1') {
            console.log('个人中心');
            navigate('/user')
        }
    };

    return (
        <Header className='header'>
            <img src={logo} style={{ width: '80px', height: '21px' }} alt="logo" />
            <div className="demo-logo" />
            <Menu className='ant-menu'
                theme="light"
                mode="horizontal"
                items={pageItems}
                style={{
                    flex: 1,
                    minWidth: 0,
                    marginLeft: '20px',
                    alignItems: 'center',
                    background: 'linear-gradient(180deg, #ffe6e6 0%, #ffffff 100%)',
                }}
                onClick={(key) => navigate(key.key)}
                selectedKeys={selectedKeys} // 使用 selectedKeys 数组
            />
            <div>
                <Dropdown
                    menu={{
                        items,
                        onClick,
                    }}
                >

                    <Space>
                        <Avatar src={userInfo.photo} size={38} />
                        <DownOutlined />
                    </Space>
                </Dropdown>
            </div>
        </Header>
    );
};

export default Pageheader;