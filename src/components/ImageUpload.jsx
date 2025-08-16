import React, { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function ImageUpload({ onUploadSuccess }) {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const { token } = useAuth();
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // Local preview
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image to upload.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      onUploadSuccess(response.data.url);
      alert("Image uploaded successfully!");
    } catch (err) {
      setError("Image upload failed. Please try again.");
      console.error("Upload Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border border-dashed border-gray-300 rounded-lg text-center">
      {preview && <img src={preview} alt="Preview" className="w-40 h-40 rounded-full mx-auto mb-4 object-cover" />}
      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
        className="text-sm block w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <button
        onClick={handleUpload}
        disabled={!file || loading || !token}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {loading ? "Uploading..." : "Upload Image"}
      </button>
    </div>
  );
}
