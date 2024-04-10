import axios from 'axios'
import qs from "qs";

const url = 'http://172.16.2.128:8090/chat'

// qs.stringify(data)
export function selectRoomHistoryChat(data, token) {
    const header = {
        'Content-Type': 'application/json', // 设置请求头为 JSON 格式
        'token': token,
    }
    return new Promise((resolve, reject) => {
        axios
            .post(url + "/selectRoomHistoryChat", data, {headers: header})
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}

export function chat(data, token) {
    const header = {
        'Content-Type': 'application/json',
        'token': token
    }
    return new Promise((resolve, reject) => {
        axios.post(url + "/toChat", data, {headers: header})
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
}
