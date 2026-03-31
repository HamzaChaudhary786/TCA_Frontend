import axios from "axios";
import { BACKEND_URL } from "../constants/api";

export const uploadFile = async (file) => {
  if (!file) return null;

  const data = new FormData();
  data.append('file', file);
  data.append('resourceType', 'auto');

  try {
    const response = await axios.post(`${BACKEND_URL}/media`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    });

    const result = response.data;

    if (result.secure_url) {
      return result.secure_url;
    } else {
      throw new Error("Invalid response from upload server");
    }
  } catch (error) {
    console.error("Error uploading file to backend: ", error);
    throw new Error(error.response?.data?.error?.message || "Error uploading file");
  }
};
