import axios from "axios"
import { FAVORITE_API_URL } from "../config"

export const getAllFavorite = async(userId: string) => {
    try {
        const response = await axios.get(`${FAVORITE_API_URL}/${userId}`);
        return response.data.data;
    } catch (error) {
        console.log(error);
    }
}


export const addTourInFavorite = async(userId: string, tourId: string) => {
    try {
        await axios.post(`${FAVORITE_API_URL}/${userId}/${tourId}`);
    } catch (error) {
        console.log(error)
    }
}

export const removeTourFromFavorite = async(userId: string, tourId: string) => {
    try {
        await axios.delete(`${FAVORITE_API_URL}/${userId}/${tourId}`);
    } catch (error) {
        console.log(error)
    }
}
