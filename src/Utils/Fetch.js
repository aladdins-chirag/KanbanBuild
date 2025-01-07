import axios from "axios"

export const Fetch = async (type, url, data) => {
    const res = await axios({
        baseURL: 'http://localhost:5001/api',
        method: type,
        url: url,
        data: data,
        withCredentials: true
    })
    return res.data
}

export const AxiosFetch = axios.create({
    baseURL: 'http://localhost:5001/api',
    withCredentials: true
})