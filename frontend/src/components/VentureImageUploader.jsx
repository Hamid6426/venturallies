import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import DeleteVentureImage from "./DeleteVentureImage";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export default function VentureImageUploader() {
  const { ventureId } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();

  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const [showCropper, setShowCropper] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing images
  useEffect(() => {
    axiosInstance
      .get(`/ventures/id/${ventureId}`)
      .then((res) => {
        const arr = res.data?.data?.images;
        setUploadedUrls(Array.isArray(arr) ? arr : []);
      })
      .catch(console.error);
  }, [ventureId]);

  // Clean up object URL
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const onSelectFile = (e) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
    setShowCropper(true);
    setError("");
  };

  // This ensures the crop is centered and aspect ratio is set on image load
  const onImageLoad = useCallback((e) => {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
    const aspect = 16 / 9;
    const crop = centerCrop(
      makeAspectCrop({ unit: "%", width: 80 }, aspect, width, height),
      width,
      height
    );
    setCrop(crop);
    imgRef.current = e.currentTarget;
  }, []);

  // Always set completedCrop for canvas preview
  const onCropComplete = (c) => {
    setCompletedCrop(c);
  };

  // Draw the preview canvas whenever crop completes
  useEffect(() => {
    if (
      !completedCrop ||
      !completedCrop.width ||
      !completedCrop.height ||
      !imgRef.current ||
      !previewCanvasRef.current
    ) {
      return;
    }
    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");

    // Set canvas size to final crop
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
  }, [completedCrop, imagePreview]);

  const handleUpload = async () => {
    if (
      !completedCrop ||
      !completedCrop.width ||
      !completedCrop.height ||
      !previewCanvasRef.current
    ) {
      setError("Please crop the image before uploading.");
      return;
    }
    if (uploadedUrls.length >= 4) {
      setError("You can only upload up to 4 images.");
      return;
    }
    setError("");
    setLoading(true);

    previewCanvasRef.current.toBlob(async (blob) => {
      if (!blob) {
        setError("Failed to get cropped image.");
        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append("images", blob, selectedFile.name);

      try {
        const res = await axiosInstance.patch(
          `/ventures/id/${ventureId}/upload-image`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setUploadedUrls(res.data?.data?.images || []);
        setSelectedFile(null);
        setImagePreview(null);
        setShowCropper(false);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Upload failed.");
      } finally {
        setLoading(false);
      }
    }, "image/jpeg");
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setShowCropper(false);
    setError("");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg m-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Upload Venture Images
      </h1>

      {/* File Picker */}
      <div className="mb-4">
        <label
          htmlFor="file-upload"
          className={`inline-block px-6 py-2 bg-green-500 text-white rounded-md cursor-pointer hover:bg-green-600 transition duration-200 ${
            uploadedUrls.length >= 4 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Choose File
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={onSelectFile}
          disabled={uploadedUrls.length >= 4}
          className="hidden"
        />
        {selectedFile && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: {selectedFile.name}
          </p>
        )}
      </div>

      {/* Crop UI */}
      {showCropper && imagePreview && (
        <div className="mb-4">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)} // percentCrop is more reliable for resizing
            onComplete={onCropComplete}
            aspect={16 / 9}
            ruleOfThirds
          >
            <img
              ref={imgRef}
              src={imagePreview}
              onLoad={onImageLoad}
              alt="Crop source"
              style={{ maxWidth: "100%" }}
            />
          </ReactCrop>
          <div className="mt-4 flex items-center space-x-4">
            <button
              onClick={handleUpload}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              {loading ? "Uploading..." : "Upload Cropped"}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
          {/* Show the canvas for debugging */}
          <div className="mt-4">
            <p className="text-xs text-gray-500">Crop preview (what will be uploaded):</p>
            <canvas
              ref={previewCanvasRef}
              style={{
                border: "1px solid #ccc",
                width: completedCrop?.width ?? 0,
                height: completedCrop?.height ?? 0,
                display: completedCrop?.width ? "block" : "none",
              }}
            />
          </div>
        </div>
      )}

      {error && <p className="text-red-500 mb-3">{error}</p>}

      {/* Gallery */}
      {uploadedUrls.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {uploadedUrls.map((url, i) => (
            <div
              key={i}
              className="relative aspect-video overflow-hidden rounded-lg shadow-md"
            >
              <DeleteVentureImage
                imageUrl={`${import.meta.env.VITE_BACKEND_URL}${url}`}
                onDelete={async (fullUrl) => {
                  try {
                    const res = await axiosInstance.patch(
                      `/ventures/${ventureId}/delete-image`,
                      {
                        imageUrl: fullUrl.replace(
                          import.meta.env.VITE_BACKEND_URL,
                          ""
                        ),
                      }
                    );
                    setUploadedUrls(res.data?.data?.images);
                  } catch (err) {
                    console.error("Delete failed:", err);
                  }
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}