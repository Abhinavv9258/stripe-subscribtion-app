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
        await axios.post(`${URL}/user/login`, { email, password });
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