const {axiosInstance} = require('./index')


// Register a User

export const RegisterUser = async (value) => {
    try{
        const response = await axiosInstance.post("api/users/register", value);
        return response.data;
    }catch(err){
        console.log(err);
    }
}