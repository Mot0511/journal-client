import axios from "axios";

const get = async (url: string, params?: {}) => {
    const token = localStorage.getItem('token');
    const res = await axios.get(import.meta.env.VITE_BACKEND_URL + url, {
        params: params,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}`}),
        }
    })

    return res.data.data
}

const post = async (url: string, data?: {}) => {
    const token = localStorage.getItem('token');
    const res = await axios.post(import.meta.env.VITE_BACKEND_URL + url, data, {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}`}),
        }
    })

    return res.data.data
}

const deleteR = async (url: string) => {
    const token = localStorage.getItem('token');
    const res = await axios.delete(import.meta.env.VITE_BACKEND_URL + url, {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}`}),
        }
    })

    return res.data.data
}

const put = async (url: string, data?: {}) => {
    const token = localStorage.getItem('token');
    const res = await axios.put(import.meta.env.VITE_BACKEND_URL + url, data, {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}`}),
        }
    })

    return res.data.data
}

export {get, post, deleteR, put}