import { toast } from 'react-toastify';

export const handleProfileImageUpdate = async (file, setImageUrl, setLoading, resourceType = 'image') => {
    if (!file) return;

    if (setLoading) setLoading(true);

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'first_preset');
    data.append('cloud_name', 'dsp3nipez');

    try {
        const cloudinary_image_response = await fetch(
            `https://api.cloudinary.com/v1_1/dsp3nipez/${resourceType}/upload`,
            {
                method: "POST",
                body: data
            }
        );

        const uploadImageUrl = await cloudinary_image_response.json();

        if (!cloudinary_image_response.ok) {
            console.error("Cloudinary Error Detailed:", uploadImageUrl);
            throw new Error(uploadImageUrl.error?.message || "Cloudinary upload failed");
        }

        console.log("Cloudinary Response:", uploadImageUrl);

        if (uploadImageUrl.secure_url) {
            setImageUrl(uploadImageUrl.secure_url);
            return uploadImageUrl.secure_url;
        }
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        toast.error(`Upload failed: ${error.message}`);
    } finally {
        if (setLoading) setLoading(false);
    }
};
