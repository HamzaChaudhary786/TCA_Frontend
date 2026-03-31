import { toast } from 'react-toastify';

const apiRequest = (apiCall) => {
  return async (...args) => {
    try {
      const response = await apiCall(...args);
      return response?.data;
    } catch (error) {
      console.error(`Error in API call: `, error);
      const errMsg = error?.response?.data?.message || error?.response?.data?.error || (typeof error?.response?.data === 'string' ? error?.response?.data : "An unexpected error occurred");
      toast.error(errMsg);
      throw error;
    }
  };
};

export default apiRequest;
