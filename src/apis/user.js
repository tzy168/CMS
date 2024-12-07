import { http } from "../utils";

// user相关所有请求
export function loginAPI(formData) {
    return http({
        url: '/authorizations',
        method: 'POST',
        data: formData
    })
}

export function getProfileAPI() {
    return http({
        url: '/user/profile',
        method: 'GET'
    })
}