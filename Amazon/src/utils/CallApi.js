import axios from 'axios'
import {BASE_URL} from "./constsnts"

const config = {
    headers:{
        "Content-Type":"application/json",
        "Accept":"application/json"
    }
}


const CallApi = async (resource) => {
    const {data} = await axios.get(`${BASE_URL}/${resource}`,);
    return data;
}

export default CallApi
