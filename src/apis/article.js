import { http } from "../utils";

export function getArticleListAPI(params) {
    return http({
        url: '/mp/articles',
        method: 'GET',
        params
    })
}

export function getChannelListAPI() {
    return http({
        url: '/channels',
        method: 'GET'
    })
}

export function createArticleAPI(data) {
    return http({
        url: '/mp/articles?draft=false',
        method: 'POST',
        data
    })
}

export function deleteArticleAPI(id) {
    return http({
        url: `/mp/articles/${id}`,
        method: 'DELETE'
    })
}

export function editArticleAPI(id, data) {
    return http({
        url: `/mp/articles/${id}`,
        method: 'PUT',
        data
    })
}

export function getAritcleDetailAPI(id) {
    return http({
        url: `/mp/articles/${id}`,
        method: 'GET'
    })
}
