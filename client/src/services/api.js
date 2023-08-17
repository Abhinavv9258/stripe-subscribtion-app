import axios from 'axios';
import {URL} from '../App';

export const addUser = async (data) => {
    try{
        return await axios.post(`${URL}/user/register`, data);
    }catch(error){
        console.log('Error while calling Api', error);
    }
}

export const userLogin = async ({ email, password }) => {
    try{
        // console.log(data);
        // await axios.get(`${URL}/login`, { username, password });
        // console.log(URL);
        await axios.post(`${URL}/user/login`, { email, password });
        // if (response.data.success) {
        //     alert(response.data.message);
        // } else {
        //     alert(response.data.message);
        // }
    }catch(error){
        console.log('Error while calling Api', error);
    }
}


export const findUser = async ({ userId }) => {
    try{
        await axios.get(`${URL}/user/:userId`, { userId });
    }catch(error){
        console.log('Error while calling Api', error);
    }
}