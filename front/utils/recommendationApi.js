import axios from 'axios';
export const recommendationApi=axios.create({baseURL:'http://localhost:9000/recommendations',withCredentials:true,timeout:120000});
