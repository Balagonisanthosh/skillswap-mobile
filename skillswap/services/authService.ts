// services/authService.ts
import { api } from "./api";

export const loginUser = async (email: string, password: string) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const registerUser=async(formData:FormData)=>{
  const response =await api.post("/auth/register",formData,{
    headers:{
      "Content-Type":"multipart/form-data",
    }
  })

}

export const updateProfile = async (formData: FormData) => {
  const response = await api.put("/auth/profile", formData);
  return response.data;
};