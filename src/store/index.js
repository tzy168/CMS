//组合redux子模块 + 导出store实例
import userReducer from '../store/modules/user'
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
    reducer: {
        user: userReducer
    }
})

export default store