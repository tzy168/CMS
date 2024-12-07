//封装高阶组件
import { Navigate } from 'react-router-dom'
import { getToken } from '../utils/token'

export default function AuthRoute({ children }) {
    //判断是否登录
    const isLogin = getToken()
    //如果已经登录，就返回children
    return isLogin ? children : <Navigate to="/login" replace />
}