import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import DeleteVentureImage from "../../components/DeleteVentureImage";

export default function VentureImageUploader() {
  const { ventureId } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Optional: Fetch already uploaded images on mount
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axiosInstance.get(`/ventures/id/${ventureId}`);
        const images = res?.data?.images;

        if (Array.isArray(images)) {
          setUploadedUrls(images);
        } else {
          console.warn("No images found for this venture.");
          setUploadedUrls([]);
        }
      } catch (err) {
        console.error("Failed to fetch existing images:", err);
      }
    };

    fetchImages();
  }, [ventureId]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files?.[0] || null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      return setError("Please select an image to upload.");
    }

    if (uploadedUrls.length >= 4) {
      return setError("You can only upload up to 4 images.");
    }

    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("images", selectedFile);

    try {
      const res = await axiosInstance.patch(
        `/ventures/id/${ventureId}/upload-image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setUploadedUrls(res.data.images || []);
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Image upload failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Upload Venture Images</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="file-input file-input-bordered w-full"
        disabled={uploadedUrls.length >= 4}
      />

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <button
        className="btn btn-primary mt-4"
        onClick={handleUpload}
        disabled={loading || !selectedFile || uploadedUrls.length >= 4}
      >
        {loading ? "Uploading..." : "Upload Image"}
      </button>

      {uploadedUrls.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {uploadedUrls.map((url, index) => (
            <DeleteVentureImage
              key={index}
              imageUrl={`${import.meta.env.VITE_API_BASE_URL}${url}`}
              onDelete={async (fullUrl) => {
                try {
                  const res = await axiosInstance.patch(
                    `/ventures/${ventureId}/delete-image`,
                    { imageUrl: fullUrl.replace("http://localhost:5000", "") }
                  );
                  setUploadedUrls(res.data.images);
                } catch (err) {
                  console.error("Delete failed:", err);
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
