import Axios from 'axios'

const api = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_APP_URL + '/api',
})

export default api
