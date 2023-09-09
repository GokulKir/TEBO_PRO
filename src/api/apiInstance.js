import axios from 'axios';

const apiInstance = axios.create({
    timeout : 10000 ,
    baseURL : "https://tebo.domainenroll.com",
})


export default apiInstance