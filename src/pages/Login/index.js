import React from 'react';
import { Button, Form, Input, Card } from 'antd';
import './index.scss'; // 引入 SCSS 文件
import { useDispatch } from 'react-redux';
import { fetchToken } from '../../store/modules/user';
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        await dispatch(fetchToken(values))
        navigate('/')
    };

    return (
        <div className="login-container">
            <Card className="login-card">
                <Form validateTrigger="onBlur" onFinish={(val) => onFinish(val)}>
                    <Form.Item
                        label="Mobile"
                        name="mobile"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Mobile Number!',
                            },
                            {
                                //正则表达式
                                pattern: /^1[3-9]\d{9}$/,
                                message: 'Please input correct mobile number!',
                            }
                        ]}
                        onChange={(val) => console.log()}
                    >
                        <Input placeholder='username' />
                    </Form.Item >

                    <Form.Item
                        label="Code"
                        name="code"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your code!',
                            },
                        ]}
                    >
                        <Input.Password placeholder='password' />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" >
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;