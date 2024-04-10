import axios from 'axios'
import qs from "qs";

const uri = 'http://172.16.2.128:8090/user'
axios.defaults.timeout = 50000
// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
// 请求拦截器

axios.interceptors.request.use(config => {
    return config
})
// qs.stringify(data)
export function post(url, data, headers) {
    return new Promise((resolve, reject) => {
        axios
            .post(uri + url, data, { headers: headers })
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}