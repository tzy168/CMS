import axios from 'axios';
import { getToken, removeToken } from './index';
import { message } from 'antd'; // 引入 Ant Design 的 message 组件
import router from '../router';


const http = axios.create({//创建axios实例
    baseURL: 'http://geek.itheima.net/v1_0', // 1 传入基础路径
    timeout: 5000, // 2 (5s) 请求超时时间
});

// 请求拦截器
http.interceptors.request.use((config) => {
    const token = getToken(); // 从本地存储中获取 token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // 将 token 添加到请求头
    }
    return config; // 返回修改后的配置 继而进行发送请求
}, (error) => {
    return Promise.reject(error); // 处理请求错误
    //Promise.reject(error) 是一个 Promise 对象，用于拒绝（reject）一个 Promise 对象。
    //当你调用 Promise.reject(error) 时，它会创建一个新的 Promise 对象，并将其状态设置为 rejected，同时将错误信息 error 传递给相应的错误处理函数。
});

// 响应拦截器
http.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response) {// 服务器响应了错误的状态码，处理错误信息
            const { status, data } = error.response;
            if (status === 400) {
                message.error(data.message || '请求失败，请检查输入');
                return null
            } else if (status === 401) {
                message.error(data.message || '用户信息验证失败，请重新登录');
                removeToken();
                router.navigate('/login');
                window.location.reload();
                return null
            }
            return Promise.reject(error); // 返回 rejected promise，让调用者可以继续处理
        }
    }
);

export { http };