import axios from 'axios'
import qs from "qs";

axios.defaults.baseURL = 'http://localhost:8090/user/'
axios.defaults.timeout = 50000
// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
// 请求拦截器

axios.interceptors.request.use(config => {
    return config
})

export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios
            .get(url, {
                params: params
            })
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                reject(err.data)
            })
    })
}
// qs.stringify(data)
export function post(url, data, headers) {
    return new Promise((resolve, reject) => {
        axios
            .post(url, data, { headers: headers })
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}