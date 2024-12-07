import React from 'react';
import { Layout, theme } from 'antd';
import { Outlet } from 'react-router-dom';
import PageHeader from '../../components/header';

const { Content, Footer } = Layout;

const App = () => {
    const {
        token: { borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout>
            <PageHeader />
            <Content
                style={{
                    padding: '0 48px',
                    marginTop: 8,
                }}
            >
                <div
                    style={{
                        padding: 24,
                        minHeight: 380,
                        background: 'linear-gradient(180deg, #ffffff 0%, #ffe6e6 100%)',
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </div>
            </Content>
            <Footer
                style={{
                    textAlign: 'center',
                }}
            >
                tzy ©{new Date().getFullYear()} Created by tzy
            </Footer>
        </Layout>
    );
};
export default App;