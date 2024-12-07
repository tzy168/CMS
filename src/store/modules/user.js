import { createSlice } from "@reduxjs/toolkit";
import { removeToken } from "../../utils";
import { setToken as _setToken, getToken } from "../../utils";
import { message } from "antd";
import { loginAPI, getProfileAPI } from "../../apis/user";

const userStore = createSlice({
    name: "user",
    initialState: {
        token: getToken() || "",
        userInfo: {}
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload
            _setToken(action.payload)
        },
        setUserInfo: (state, action) => {
            state.userInfo = action.payload
        },
        clearUserInfo: (state) => {
            state.userInfo = {}
            state.token = ""
            removeToken()
        }
    }
})

//解构方法
const { setToken, setUserInfo, clearUserInfo } = userStore.actions

//获取reducer函数
const userReducer = userStore.reducer

// 异步方法  完成登录获取token
const fetchToken = (loginForm) => {
    return async (dispatch) => {
        const res = await loginAPI(loginForm)
        if (res) {
            message.success("登录成功")
            dispatch(setToken(res.data.token))
        } else {
            return
        }

    }
}

const fetchUserInfo = () => {
    return async (dispatch) => {
        const res = await getProfileAPI()
        if (res) {
            dispatch(setUserInfo(res.data))
        } else {
            return
        }
    }
}

export { setToken, fetchToken, fetchUserInfo, setUserInfo, clearUserInfo }


export default userReducer