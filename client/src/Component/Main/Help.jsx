import React, { useState } from "react";
import axios from "axios";

const Help = () => {
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOverlay, setShowOverlay] = useState(false); // For overlay state

  const fetchFileContent = async (fileId) => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        "http://localhost:3000/api/view-file-content",
        { fileId: "6756efaa5464a6a5b3f6a56d" },
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjc0ZGFkZmIyMTFlZWI5YjA1ZDY1MmFmIiwiaWF0IjoxNzMzODIzOTM1LCJleHAiOjE3MzM4MjQ4MzV9.yBmncBz0LV7-UNMhBHVajt0hnuFG4E14fSq9-0Auy9A`, // Replace with actual token
          },
        }
      );

      const { file_name, file_url, file_type } = response.data;

      if (!file_url) {
        throw new Error("File URL is missing from the response.");
      }

      setFileData({
        fileName: file_name || "Unknown",
        mimeType: file_type || "Unknown", // Use mimeType to check file type
        fileUrl: file_url, // Add file URL to the state
      });

      setShowOverlay(true); // Show overlay after fetching file details
    } catch (err) {
      console.error("Error fetching file content:", err);
      setError(
        err.response?.data?.message ||
          "An unexpected error occurred while fetching the file content."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderFileContent = () => {
    if (!fileData || !fileData.fileUrl) return null;

    const { mimeType, fileUrl } = fileData;

    // PDF file preview
    if (mimeType === "pdf" || mimeType === "application/pdf") {
      return (
        <iframe
          src={fileUrl}
          title="PDF Document"
          style={{ width: "100%", height: "500px", border: "none" }}
        />
      );
    }

    // Word document (e.g., .docx) handling
    if (
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/msword"
    ) {
      return (
        <div>
          <p>Word document is detected. Please download to view:</p>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            Download Word Document
          </a>
        </div>
      );
    }

    // Image handling (e.g., .jpg, .png)
    if (mimeType.startsWith("image/")) {
      return <img src={fileUrl} alt="file content" style={{ width: "100%", maxHeight: "500px" }} />;
    }

    return <p>Unsupported file type for viewing.</p>;
  };

  const renderOverlay = () => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          color: "#000",
          padding: "20px",
          borderRadius: "10px",
          maxWidth: "90%",
          maxHeight: "90%",
          overflowY: "auto",
          position: "relative",
        }}
      >
        <h2>Document Viewer</h2>
        {renderFileContent()}
        <button
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "#ff0000",
            color: "#fff",
            border: "none",
            padding: "5px 10px",
            borderRadius: "5px",
          }}
          onClick={() => setShowOverlay(false)}
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <h1>View Document</h1>
      <button onClick={() => fetchFileContent("67485c8277b14c8ac4b751d2")}>
        Load Document
      </button>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {showOverlay && renderOverlay()}
    </div>
  );
};

export default Help;
