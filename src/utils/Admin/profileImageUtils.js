import { toast } from 'react-toastify';
import axios from 'axios';
import { BACKEND_URL } from '../../constants/api';

export const handleProfileImageUpdate = async (
    file,
    setImageUrl,
    setLoading,
    resourceType = 'auto' // 🔥 default to auto
) => {
    if (!file) return;

    if (setLoading) setLoading(true);

    const data = new FormData();
    data.append('file', file);
    data.append('resourceType', resourceType);

    try {
        const response = await axios.post(`${BACKEND_URL}/media`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        });

        const result = response.data;

        console.log("Backend Media Upload Response:", result);

        if (result.secure_url) {
            let fileUrl = result.secure_url;

            setImageUrl(fileUrl);
            return fileUrl;
        } else {
            throw new Error("Invalid response format from upload server");
        }

    } catch (error) {
        console.error("Backend Upload Error:", error);
        toast.error(`Upload failed: ${error.response?.data?.error?.message || error.message}`);
    } finally {
        if (setLoading) setLoading(false);
    }
};