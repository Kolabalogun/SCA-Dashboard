import axios, { AxiosResponse } from "axios";
import { BASE_URL } from ".";

interface User {
  email: string;
  password: string;
  name: string;
  phone: string;
}

interface ApiResponse {
  // Define the structure of your API response
  id: string;
  email: string;
  name: string;
  phone: string;
  password: string;
}

const registerUser = async (user: User): Promise<ApiResponse> => {
  const { email, password, name, phone } = user;
  try {
    const response: AxiosResponse<ApiResponse> = await axios.post(
      `https://us-central1-shayofunmicareagency-928eb.cloudfunctions.net/createUser`,
      {
        email,
        password,
        name,
        phone,
      }
    );

    if (response.status !== 200) {
      throw new Error("Error creating user");
    }

    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error; // Re-throw the error for handling in the calling component
  }
};

export default registerUser;
