import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { motion } from "framer-motion";
import fetchUserData from "./fetchUserData";
import { API_URL } from "../utils/Apiconfig";
import {

  ArrowRight,

  Trash2,

  UploadCloud,

  X,

  Eye,

  Edit,

  Folder,

  Users,

  ChevronDown,
  Camera,
  Download,

  Loader2,

  EllipsisVertical,

  Grid,

  Menu,

  LayoutGrid,

} from "lucide-react";



import upload from "../../assets/upload.png";

import axios from "axios";

import mammoth from "mammoth";

import { useParams, NavLink } from "react-router-dom";

import useLoadingStore from "../../store/UseLoadingStore";

const Dashboard = ({ folderId = 1, onFolderSelect }) => {

  const { id: routeFolderId } = useParams();

  const { isLoading, showLoading, hideLoading } = useLoadingStore();

  const activeFolderId = folderId || routeFolderId;

  const [isUploading, setIsUploading] = useState(false);

  const [openMenuId, setOpenMenuId] = useState(() => {
    try {
      const storedValue = localStorage.getItem("openMenuId");
      return storedValue ? JSON.parse(storedValue) : null;
    } catch (error) {
      console.error("Failed to parse openMenuId from localStorage:", error);
      return null;
    }
  });


  const [files, setFiles] = useState([

    {

      name: "Real Estate 4.zip",

      folder: "",

      date: "Feb 6, 2024",

      contact: "rahul",

      tag: "Will",

    },

  ]);

  const [viewMode, setViewMode] = useState("list"); // 'list' or 'grid

  const [fileExtension, setFileExtension] = useState(""); // Store file extension



  const [showOverlay, setShowOverlay] = useState(false);

  const [docContent, setDocContent] = useState(""); // Extracted Word content

  const [fileData, setFileData] = useState(null);

  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [name1, setName1] = useState("");
  const [designers, setDesigners] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState("");

  const [customFileName, setCustomFileName] = useState(""); // State to store the custom file name

  const [inputFileName, setInputFileName] = useState(""); // State to store the current value in input field

  const [uploadStatus, setUploadStatus] = useState("");

  const [tags, setTags] = useState([]);

  const [message, setMessage] = useState(null); // Added for feedback messages

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [uploadQueue, setUploadQueue] = useState([]); // Files currently uploading

  const [editFile, setEditFile] = useState(null); // File being edited

  const [expandedRow, setExpandedRow] = useState(null);

  const [selectedFileId, setSelectedFileId] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);

  const [folders, setFolders] = useState([]);

  const [name, setName] = useState([]);

  const [shareFileVisible, setShareFileVisible] = useState(null); // Track which file's ShareFile is visible

  const [designee, setDesignee] = useState("");

  const [share, setShare] = useState("");

  const [notify, setNotify] = useState(true);

  const [deletebutton, setDeletebutton] = useState(false);

  // const [people, setPeople] = useState([

  //   { name: "Hariom Gupta (you)", email: "hg119147@gmail.com", role: "Owner" },

  //   { name: "Akash", email: "Akahs@gmail.com", role: "" },

  // ]);
  const [people, setPeople] = useState([]);
  const [showDesignerPopup, setShowDesignerPopup] = useState(false); // Toggles the popup visibility
  const [designeeName, setDesigneeName] = useState(""); // Holds the input for designee name
  const [designeePhone, setDesigneePhone] = useState(""); // Holds the input for designee phone number
  const [designeeEmail, setDesigneeEmail] = useState(""); // Holds the input for designee email

  const [need, setNeed] = useState([]);

  const [token, setToken] = useState([]);

  // const [users, setUsers] = useState([

  //   {

  //     name: "Hariom Gupta (you)",

  //     email: "hg119147@gmail.com",

  //     role: "Owner",

  //     permission: "Owner",

  //   },

  //   {

  //     name: "Akash",

  //     email: "Akahs@gmail.com",

  //     role: "User",

  //     permission: "Only View",

  //   },

  // ]);

  const [users, setUsers] = useState([]);

  const [newUser, setNewUser] = useState("");

  const [showDropdown, setShowDropdown] = useState(null);



  const [access, setAccess] = useState(false);
  const [isMembershipActive, setIsMembershipActive] = useState(false);
  const [membershipDetail, setMembershipDetail] = useState(null);
  const [userData, setUserData] = useState(null);
  const [deletebutton1, setDeletebutton1] = useState(false);
  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserData();
        if (!data?.user) {
          throw new Error("Invalid response structure");
        }

        setUserData(data);
        console.log("data", data);
        console.log("data user", data.user);
        setIsMembershipActive(data.user.activeMembership);
        setMembershipDetail(data.user.memberships);
        console.log("details", data.user.membershipDetail);
        console.log("membership", data.user.isMembershipActive);
      } catch (err) {
        console.log(err.message || "Failed to fetch user data");
      }
    };
    getUserData();
  }, []);

  const handleUsersClick = (fileId) => {

    setShareFileVisible((prevId) => (prevId === fileId ? null : fileId)); // Toggle visibility

  };

  const toggleAccess = () => {

    setAccess(true); // Toggle the access state when the folder button is clicked

  };

  const handleDesigneeChange = (e) => setDesignee(e.target.value);

  const handleMessageChange = (e) => setMessage(e.target.value);

  const handleNotifyChange = () => setNotify(!notify);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedEmail = localStorage.getItem("email");

    console.log("krcnjrncirc", storedUser);
    console.log("krcnjrncirc", storedEmail);

    setPeople([{ name: `${storedUser} (you)`, email: storedEmail, role: "Owner" }]);
    setUsers([{ name: `${storedUser} (you)`, email: storedEmail, role: "Owner" }]);
  }, []);





  useEffect(() => {

    fetchFolders();

  }, []);

  useEffect(() => {

    console.log("Selected folderId:", folderId);

  }, [folderId]);



  const toggleViewMode = () => {

    setViewMode(viewMode === "list" ? "grid" : "list");

  };



  const handleDownloadFile = async (file_id) => {

    try {

      const token = Cookies.get('token');



      // Get the download link from the server

      const response = await axios.post(

        `${API_URL}/api/download-file`, // Backend endpoint

        { file_id },

        {

          headers: {

            Authorization: `Bearer ${token}`,

          },

        }

      );



      const { download_url } = response.data;



      // Programmatically trigger the file download

      const link = document.createElement('a');

      link.href = download_url;

      link.setAttribute('download', ''); // Let the browser infer the filename

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

    } catch (error) {

      console.error('Error preparing file download:', error);

      // alert('Error preparing file download. Please try again.');

    }

  };


  const handleAddDesignee = () => {
    if (designeeName && designeePhone && designeeEmail) {
      setDesigners([...designers, designeeName]); // Add the new designer to the list
      setShowDesignerPopup(false); // Close the popup
      setDesigneeName(""); // Reset the input fields
      setDesigneePhone("");
      setDesigneeEmail("");
    } else {
      setError("Please fill out all fields before inviting a designee.");
    }
  };

  const closeOverlay = () => {

    setOverlayVisible(false); // Close the overlay

    setFileData(null); // Reset file data when closing overlay

  };



  const handleSubmit = () => {

    // alert(`Designee: ${designee}\nMessage: ${message}\nNotify: ${notify}`);

    setShare(false);

  };




  const addUser = () => {

    if (newUser.trim() !== "") {

      setUsers([

        ...users,

        {

          name: newUser,

          email: `${newUser.toLowerCase().replace(/\s/g, "")}@gmail.com`,

          role: "User",

          permission: "Only View",

        },

      ]);

      setNewUser("");

    }

  };

  const clear = () => {

    setSelectedFile(null);

    setSelectedFolderId("");

    setCustomFileName("");

    setUploadQueue([]);

    setInputFileName("");

    setEditFile(null);

    setIsUploading(false);

  };

  const clear2 = () => {

    setEditFile(null);

    setSelectedFolderId("");

    setCustomFileName("");

    setTags("");

  };



  const removeUser = (index) => {

    setUsers(users.filter((_, i) => i !== index));

  };



  const updatePermission = (index, permission) => {

    const updatedUsers = [...users];

    updatedUsers[index].permission = permission;

    setUsers(updatedUsers);

    setShowDropdown(null);

  };



  const fetchFolders = async () => {

    setLoading(true);

    try {

      const token = Cookies.get('token');

      if (!token) {

        throw new Error("No token found. Please log in again.");

      }



      const response = await axios.get(

        `${API_URL}/api/get-folders`,

        {

          headers: {

            Authorization: `Bearer ${token}`, // Include token in Authorization header

          },

        }

      );



      const foldersData = response.data.map((folder) => ({

        id: folder._id, // Get _id for folder selection

        name: folder.folder_name,

      }));



      setFolders(foldersData); // Set fetched folders



      // Do not set selectedFolderId automatically on first load

    } catch (error) {

      console.log(error.response?.data?.message || "Error fetching folders.");

    } finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    fetchFolders();

  }, []);

  useEffect(() => {

    if (!activeFolderId) return;



    fetchFolders();



    if (onFolderSelect) {

      onFolderSelect(activeFolderId);

    }

  }, [activeFolderId, onFolderSelect]);



  const handleFolderSelect = (id) => {

    setSelectedFolderId(id); // Only set when the user selects a folder

  };



  const fetchFiles = async () => {

    setLoading(true);

    setError(null);



    try {

      const token = Cookies.get('token');

  



      console.log("tokennnnnnn", token);

      // console.log("useerrrrrrrrid", userId);

      console.log("folderrrrrid", folderId);



      if (!token) {

        throw new Error("No token found. Please log in again.");

      }



   



      if (folderId === 0) {
        const userId = localStorage.getItem("user");
console.log("userrrrrId",userId);

        if (!userId) {

          throw new Error("No userId found. Please log in again.");
  
        }

        console.log("Folder ID is 0, fetching all files for userId:", userId);
        setFiles([]);


        const response = await axios.get(

          `${API_URL}/api/get-all-files`,

          {

            // params: { user_id: userId },  // Correctly pass user_id as a query parameter

            headers: { Authorization: `Bearer ${token}` },

          }

        );

        console.log("API response for all filessssssss:", response.data);

        setNeed(false);

        setFiles(response.data || []);

      }

      else if (folderId === 1) {
        setFiles([]);

        // console.log("Folder ID is 0, fetching all files for userId:", userId);



        const response = await axios.get(

          `${API_URL}/api/default/default-files`

        );

        console.log("API response for defaultttttttttttt:", response.data);

        const filesArray = response.data?.files || []; // Extract the files array

        setFiles(filesArray); // Set only the files array to the state

        setNeed(true);

      }

      else {

        console.log("Fetching files for folderId:", folderId);
        setFiles([]);


        const response = await axios.post(

          `${API_URL}/api/get-files`,

          { folder_id: folderId },

          {

            headers: { Authorization: `Bearer ${token}` },

          }

        );

        console.log("API response for folderId:", response.data);

        setNeed(false);

        setFiles(response.data || []);

      }



    } catch (error) {

      console.error("Error fetching files:", error.response || error.message);

      console.log(error.response?.data?.message || "Error fetching files.");

    } finally {

      setLoading(false);

    }

  };









  const handleRowClick = (fileId) => {

    setExpandedRow(expandedRow === fileId ? null : fileId); // Collapse if already expanded, otherwise expand

  };



  useEffect(() => {

    fetchFiles();

  }, [folderId]);



  const handleUploadClick = () => {

    setIsUploading(true);

  };



  const handleToggleRow = (_id) => {

    console.log("Toggling row with id:", _id); // Log the ID when toggling the row

    setExpandedRow((prev) => {

      const newExpandedRow = prev === _id ? null : _id;

      console.log("Updated expandedRow:", newExpandedRow); // Log the new expandedRow value

      return newExpandedRow;

    });

  };



  const handleFileUpload = (event) => {

    const file = event.target.files[0]; // Select first file

    const customName = editFile?.name || file.name; // Use the custom name if editing, otherwise use the original name



    if (file) {

      setSelectedFile(file);

      setUploadStatus("Preparing file for upload...");

      const fileExtension = file.name.split('.').pop();

      // Save file and extension for later use

      setSelectedFile({ name: file.name, extension: fileExtension, file });

      setUploadQueue((prevQueue) => [

        ...prevQueue,

        { id: customName, name: customName, isUploading: true, progress: 0 },

      ]);

      setUploadStatus("Ready to upload");



      // Add to files state with custom name

      setFiles((prevFiles) => [

        ...prevFiles,

        { name: customName, description: "", tag: "" }, // Add file to the state with custom name

      ]);



      // Simulate upload for the selected file

      simulateUpload({ id: customName, name: customName });

    }

  };



  const simulateUpload = (file) => {

    const fileExtension = extractFileExtension(file.name); // Extract file extension

    const customFileName = `custom_name_${file.id}.${fileExtension}`; // Create custom file name



    const interval = setInterval(() => {

      setUploadQueue((prevQueue) => {

        const updatedQueue = prevQueue.map((item) => {

          if (item.id === file.id) {

            const updatedProgress = Math.min(item.progress + 20, 100);

            if (updatedProgress === 100) {

              clearInterval(interval);

              // Mark file as uploaded

              const updatedFile = {

                ...item,

                isUploading: false,

                progress: 100,

              };



              // Trigger actual upload to server after simulation

              uploadFileToServer(updatedFile, customFileName); // Pass the custom file name to uploadFileToServer

              return updatedFile; // File is uploaded

            }

            return { ...item, progress: updatedProgress };

          }

          return item;

        });

        return updatedQueue;

      });

    }, 500);

  };





  const uploadFileToServer = async () => {

    if (!selectedFile) {

      setUploadStatus("Please select a file.");

      return;

    }



    const updatedFile = files.find((file) => file.name === selectedFile.name);

    if (!updatedFile) {

      setUploadStatus("Error: File not found.");

      return;

    }



    const formData = new FormData();

    const folderToUpload = selectedFolderId || folderId;



    formData.append("file", selectedFile.file);

    formData.append("folder_id", folderToUpload);

    formData.append("tags", updatedFile.tag);

    formData.append("description", updatedFile.description || "");

    formData.append("custom_file_name", customFileName || updatedFile.name);



    try {

      showLoading();

      setIsUploading(true);

      const token = Cookies.get('token');

      if (!token) {

        setUploadStatus("No token found. Please log in.");

        return;

      }



      const response = await axios.post(

        `${API_URL}/api/upload-file`,

        formData,

        {

          headers: {

            "Content-Type": "multipart/form-data",

            Authorization: `Bearer ${token}`,

          },

        }

      );



      setUploadStatus("File uploaded successfully!");

      setSelectedFile(null);

      setSelectedFolderId("");

      setCustomFileName("");

      setUploadQueue([]);

      fetchFiles();

    } catch (error) {

      setUploadStatus("Error uploading file.");

    } finally {

      setIsUploading(false);

      hideLoading();

    }

  };

  // const toggleEllipses = (file) => {

  //   const newOpenMenuId = openMenuId === folderId ? null : folderId;

  //   setOpenMenuId(newOpenMenuId);

  //   localStorage.setItem("openMenuId", JSON.stringify(newOpenMenuId));

  // };



  const handleEditFile = (file) => {

    const fileExtension = file.name.split('.').pop(); // Extract the extension

    setEditFile({

      ...file,

      name: file.name.replace(`.${fileExtension}`, ""), // Remove the extension from the name

      description: file.description,

      tag: file.tag || "",

      extension: fileExtension, // Store the extension

    });

  };


  const toggleEllipses = (fileId) => {
    // Toggle the menu for the specific file by comparing the IDs
    setOpenMenuId((prevId) => (prevId === fileId ? null : fileId));
  };


  const handleSaveEdit = () => {

    if (!editFile) return;



    const updatedFileName = inputFileName ? `${inputFileName}.${editFile.extension}` : `${editFile.name}.${editFile.extension}`;



    // Update the file list with the new name

    setFiles((prevFiles) =>

      prevFiles.map((file) =>

        file.name === editFile.name ? { ...file, name: updatedFileName, ...editFile } : file

      )

    );



    setCustomFileName(updatedFileName); // Update custom file name

    setEditFile(null); // Close the edit modal or reset the form

  };




  const handleDeleteFile = (fileId) => {

    setUploadQueue((prevQueue) =>

      prevQueue.filter((file) => file.id !== fileId)

    );

  };

  const extractFileExtension = (fileName) => {

    const extension = fileName.split('.').pop(); // Extracts file extension

    return extension;

  };

  const deleteFile = async (file_id) => {

    const token = Cookies.get('token');

    const selectedFolder = folderId; // Ensure folderId is set correctly



    // Debugging logs

    console.log("Token:", token);

    console.log("Selected Folder ID:", selectedFolder);

    console.log("File ID to delete33333:", file_id);



    // Check for missing values

    if (!token) {

      setMessage("No token found. Please log in.");

      console.error("Missing token");

      return;

    }

    if (!selectedFolder) {

      setMessage("No folder selected.");

      console.error("Missing folderId");

      return;

    }

    if (!file_id) {

      setMessage("No file selected to delete.");

      console.error("Missing file_id");

      return;

    }



    try {

      const response = await axios.post(

        `${API_URL}/api/delete-file`,

        { folder_id: selectedFolder, file_id },

        {

          headers: { Authorization: `Bearer ${token}` },

        }

      );

      setFiles(files.filter((file) => file._id !== file_id));

      setMessage(response.data.message || "File deleted successfully.");

      setDeletebutton(false);

    } catch (error) {

      setMessage(error.response?.data?.message || "Error deleting file.");

    }

  };



  const fetchFileContent = async (fileId) => {
    try {
      setLoading(true);
      setError("");

      const token = Cookies.get('token');
      console.log("Retrieved Token:", token);

      if (!token) {
        setError("Token is missing. Please log in again.");
        return;
      }

      console.log("defaultttttttttttttt", fileId);

      if (folderId === 1) {
        console.log("defaultttttttttttttttttttt", fileId);
        const response = await axios.get(
          `${API_URL}/api/default/view-file/${fileId}`
        );

        if (response.status !== 200) {
          throw new Error(`Failed to fetch file, status code: ${response.status}`);
        }

        const { file_name, aws_file_link, mime_type } = response.data.file;

        if (!aws_file_link) {
          throw new Error("File URL is missing from the response.");
        }

        setFileData({
          fileName: file_name || "Unknown",
          mimeType: mime_type || "Unknown",
          fileUrl: aws_file_link,
        });

        setShowOverlay(true);
      } else {
        const response = await axios.post(
          `${API_URL}/api/view-file-content`,
          { fileId: fileId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // const toggleEllipses = (fileId) => {
        //   const newOpenMenuId = openMenuId === fileId ? null : fileId; // Toggle menu
        //   setOpenMenuId(newOpenMenuId);
        // };
        console.log("xknwjxbexnbc", response);

        const { file_name, file_url, file_type } = response.data;

        if (!file_url) {
          throw new Error("File URL is missing from the response.");
        }

        setFileData({
          fileName: file_name || "Unknown",
          mimeType: file_type || "Unknown",
          fileUrl: file_url,
        });

        setShowOverlay(true); // Show overlay after fetching file details
      }
    } catch (err) {
      console.error("Error fetching file content:", err);
      setError(
        err.response?.data?.message || "An unexpected error occurred while fetching the file content."
      );
    } finally {
      setLoading(false);
    }
  };




  const renderFileContent = () => {

    if (!fileData || !fileData.fileUrl) return null;



    const { mimeType, fileUrl } = fileData;  // Destructuring to get mimeType and fileUrl from state



    console.log("MIME Type:", mimeType);  // Log MIME type to check if it is image-related

    console.log("File URL:", fileUrl);    // Log the File URL to check



    // Handle Image files (e.g., PNG, JPG, SVG)

    if (mimeType.startsWith("image/") || // Covers common image types

      mimeType === "image/jpeg" ||

      mimeType === "image/jpg" ||

      mimeType === "image/png" ||

      mimeType === "jpg" ||            // Specific check for 'jpg'

      mimeType === "jpeg" ||           // Specific check for 'jpeg'

      mimeType === "png" ||

      mimeType === "image/svg+xml") {

      return (

        <div>

          <img

            src={fileUrl}

            alt="file content"

            style={{ width: "100%", maxHeight: "500px" }}

            onError={(e) => {

              console.error("Error loading image:", e);

              e.target.src = "https://via.placeholder.com/500"; // Fallback if image fails to load

            }}

          />

        </div>

      );

    }



    // Handle PDF files

    if (mimeType === "application/pdf" || mimeType === "pdf") {

      return (

        <iframe

          src={fileUrl}

          title="PDF Document"

          style={{ width: "100%", height: "500px", border: "none" }}

        />

      );

    }



    // Handle Word Documents (.docx) via Google Docs Viewer

    if (

      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||

      mimeType === "application/msword" ||

      mimeType === "docx" // In case backend sends 'docx' instead of full MIME type

    ) {

      const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;



      return (

        <iframe

          src={googleDocsUrl}

          title="Word Document Viewer"

          style={{ width: "100%", height: "500px", border: "none" }}

        />

      );

    }



    // Handle Excel files (e.g., .xlsx, .xls)

    if (

      mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||

      mimeType === "application/vnd.ms-excel"

    ) {

      return (

        <div>

          <p>Spreadsheet detected. Please download to view:</p>

          <a href={fileUrl} target="_blank" rel="noopener noreferrer">

            Download Spreadsheet

          </a>

        </div>

      );

    }



    // Default fallback for unsupported file types

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

          width: "50%",

          height: "auto",

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

          X

        </button>

      </div>

    </div>

  );







  return (

    <div className="mt-2 p-4  min-h-screen bg-white">

      {/* Dashboard Header */}



      {folderId !== 1 && (<div className="flex flex-col">

        <h1 className="text-xl font-bold">Welcome to Cumulus</h1>

        <div

          className="bg-blue-500 w-52 rounded-2xl my-2 p-3"

          onClick={() => {
            if (isMembershipActive) {
              handleUploadClick();
            } else {
              setDeletebutton1(true);
            }
          }}

        >

          <button className="flex items-center bg-blue-500 text-white px-2 py-2">

            <UploadCloud className="mr-2" />

            Upload File

          </button>

          <div className="flex justify-between">

            <p className="text-white text-sm ml-1">Click to drop file now</p>

            <ArrowRight className="ml-2 text-white" />

          </div>

        </div>

      </div>

      )}



      {/* TOGLE BTN */}

      <div className="flex justify-end p-2 md:hidden">

        <button

          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md text-sm  flex text-white"

          onClick={toggleViewMode}

        >

          {viewMode === 'list' ? <LayoutGrid className="h-5" /> : <Menu className="h-5" />}

          {viewMode === "list" ? "Grid View" : "List View"}

        </button>

      </div>

      {/* File List */}

      {viewMode === "list" ? (

        <div className="mt-4 bg-white shadow-md rounded sm:flex">

          <table className="w-full ">

            <thead>

              <tr className="bg-gray-100 text-left text-[0.8rem]  border-black">

                <th className="p-2 md:p-4 font-normal md:text-lg">File Name</th>

                <th className="p-2 md:p-4 font-normal md:text-lg">Folder</th>

                <th className="p-2 md:p-4 font-normal md:text-lg">Date Uploaded</th>

                <th className="p-2 md:p-4 font-normal md:text-lg">Contact </th>

                <th className="p-2 md:p-4 font-normal md:text-lg">Tags</th>

              </tr>

            </thead>

            <tbody>

              {Array.isArray(files) ? (

                // If files is an array, use map

                files.map((file) => {

                  console.log("File Object:", file); // Debugging file object

                  const isExpanded = expandedRow === file._id; // Check if the current row is expanded



                  return (

                    <React.Fragment key={file._id}>

                      {/* Main Row */}

                      <tr className="text-xs sm:text-sm">

                        <td className="p-0 md:p-4 flex items-center gap-0 md:gap-2">

                          <button

                            className="text-gray-500 hover:text-gray-800"

                            onClick={() => handleToggleRow(file._id)} // Toggle specific file row

                          >

                            <ChevronDown className='{isExpanded ? "rotate-180" : ""} h-4 '/>

                          </button>

                          {file.file_name}

                        </td>

                        <td className="p-0 md:p-4 ">{file.folder_name}</td>

                        <td className="p-0 md:p-4">

                          <p className=" text-xs sm:text-sm text-gray-600 mt-1">

                            {file.date_of_upload && !isNaN(new Date(file.date_of_upload))

                              ? new Date(file.date_of_upload).toLocaleString('en-US', {

                                weekday: 'short',

                                year: 'numeric',

                                month: 'short',

                                day: 'numeric',

                                hour: 'numeric',

                                minute: 'numeric',

                                hour12: true, // for 12-hour format, set to `false` for 24-hour

                              })

                              : "Invalid Date"}

                          </p>

                        </td>



                        <td className="p-0 md:p-4">{file.sharing_contacts}</td>

                        <td className="p-0 md:p-4">{file.tags}</td>

                      </tr>



                      {/* Expanded Actions */}

                      {isExpanded && (

                        <tr className="bg-white">

                          <td colSpan="5" className="p-4">

                            <div className="flex gap-4 items-center">

                              {/* Share Button */}



                              {!need && (

                                <>

                                  <button

                                    className="flex items-center gap-2 text-gray-600 hover:text-blue-500"

                                    onClick={() => setShare(true)}

                                  >

                                    <Users className="h-4" />

                                  </button>



                                  <button

                                    className="flex items-center gap-2 text-gray-600 hover:text-blue-500"

                                    onClick={() => setAccess(true)}

                                  >

                                    <Folder className="h-4" />

                                  </button>



                                  <button

                                    className="flex items-center gap-2 text-gray-600 hover:text-blue-500"

                                  // onClick={() => handleEditFile(file)}

                                  >

                                    <Edit className="h-4" />

                                  </button>



                                  <button

                                    className="flex items-center gap-2 text-gray-600 hover:text-red-500"

                                    onClick={() => {

                                      setDeletebutton(true);

                                      console.log("Deleting file with ID:", file._id); // Debugging log

                                      setSelectedFileId(file._id); // Set the file ID to the state

                                    }}

                                  >

                                    <Trash2 className="h-4" />

                                  </button>
                                  <button

                                    className="flex items-center gap-2 text-gray-600 hover:text-blue-500"

                                    onClick={() => handleDownloadFile(file._id)}

                                  >

                                    <Download className="h-4" />

                                  </button>

                                </>

                              )}





                              {/* View Content Button */}

                              <button

                                className="flex items-center gap-2 text-gray-600 hover:text-blue-500"

                                onClick={() => fetchFileContent(file._id)}

                              >

                                <Eye className="h-4" />

                              </button>





                            </div>

                          </td>

                        </tr>

                      )}

                    </React.Fragment>

                  );

                })

              ) : (

                // If files is not an array (single file object), render the row without map

                <React.Fragment key={files._id}>

                  {/* Main Row */}

                  <tr className="text-sm">

                    <td className="p-0 md:p-4 flex items-center gap-0 md:gap-2">

                      <button

                        className="text-gray-500 hover:text-gray-800"

                        onClick={() => handleToggleRow(files._id)} // Toggle specific file row

                      >

                        <ChevronDown className={expandedRow === files._id ? "rotate-180" : ""} />

                      </button>

                      {files.file_name}

                    </td>

                    <td className="p-0 md:p-4">{files.folder_name}</td>

                    <td className="p-0 md:p-4">{files.date_of_upload}</td>

                    <td className="p-0 md:p-4">{files.sharing_contacts}</td>

                    <td className="p-0 md:p-4">{files.tags}</td>

                  </tr>



                  {/* Expanded Actions */}

                  {expandedRow === files._id && (

                    <tr className="bg-white">

                      <td colSpan="5" className="p-4">

                        <div className="flex gap-4 items-center">

                          {/* Share Button */}

                          <button

                            className="flex items-center gap-2 text-gray-600 hover:text-blue-500"

                            onClick={() => setShare(true)}

                          >

                            <Users className="h-4" />

                          </button>



                          {/* Access Button */}

                          <button

                            className="flex items-center gap-2 text-gray-600 hover:text-blue-500"

                            onClick={() => setAccess(true)}

                          >

                            <Folder className="h-4" />

                          </button>



                          {/* Edit Button */}

                          <button

                            className="flex items-center gap-2 text-gray-600 hover:text-blue-500"

                            onClick={() => handleEditFile(files)}

                          >

                            <Edit className="h-4" />

                          </button>



                          {/* View Content Button */}

                          <button

                            className="flex items-center gap-2 text-gray-600 hover:text-blue-500"

                            onClick={() => fetchFileContent(files._id)}

                          >

                            <Eye className="h-4" />

                          </button>



                          {/* Delete Button */}

                          <button

                            className="flex items-center gap-2 text-gray-600 hover:text-red-500"

                            onClick={() => {

                              setDeletebutton(true);

                              console.log("Deleting file with ID:", files._id); // Debugging log

                              setSelectedFileId(files._id); // Set the file ID to the state

                            }}

                          >

                            <Trash2 className="h-4" />

                          </button>



                          {/* Download Button */}

                          <button

                            className="flex items-center gap-2 text-gray-600 hover:text-blue-500"

                            onClick={() => handleDownloadFile(files._id)}

                          >

                            <Download className="h-4" />

                          </button>

                        </div>

                      </td>

                    </tr>

                  )}

                </React.Fragment>

              )}




            </tbody>

          </table>

        </div>

      ) : (<div className="grid grid-cols-2 gap-4 sm:hidden p-4">

        {Array.isArray(files) &&

          files.map((file) => (

            <div

              key={file._id}

              className="bg-gray-50 p-4 rounded  shadow-lg"

            >

              <div className="flex justify-between relative">
                <h3 className="text-lg font-medium">{file.file_name}</h3>

                {/* Ellipsis Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation(); 
                    toggleEllipses(file._id); 
                  }}
                >
                  <EllipsisVertical />
                </button>

                {/* Dropdown Menu */}
                {openMenuId === file._id && (
                  <motion.div
                    className="absolute top-5  mt-2 w-48 bg-white shadow-lg rounded-lg text-black flex flex-col gap-y-2 p-2 z-50 "
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    {/* Share Option */}
                    <button
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                      onClick={() => {
                        setShare(true);
                        setOpenMenuId(null); // Close menu after selecting
                      }}
                    >
                      <Users className="h-4" />
                      Share
                    </button>

                    {/* Access Option */}
                    <button
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                      onClick={() => {
                        setAccess(true);
                        setOpenMenuId(null); // Close menu after selecting
                      }}
                    >
                      <Folder className="h-4" />
                      Access
                    </button>

                    {/* Edit Option */}
                    <button
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                      onClick={() => {
                        handleEditFile(file);
                        setOpenMenuId(null); // Close menu after selecting
                      }}
                    >
                      <Edit className="h-4" />
                      Edit
                    </button>

                    {/* View Content Option */}
                    <button
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                      onClick={() => {
                        fetchFileContent(file._id);
                        setOpenMenuId(null); // Close menu after selecting
                      }}
                    >
                      <Eye className="h-4" />
                      View Content
                    </button>

                    {/* Delete Option */}
                    <button
                      className="flex items-center gap-2 text-gray-600 hover:text-red-500"
                      onClick={() => {
                        setDeletebutton(true);
                        setSelectedFileId(file._id); // Set the file ID to the state
                        setOpenMenuId(null); // Close menu after selecting
                      }}
                    >
                      <Trash2 className="h-4" />
                      Delete
                    </button>

                    {/* Download Option */}
                    <button
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                      onClick={() => {
                        handleDownloadFile(file._id);
                        setOpenMenuId(null); // Close menu after selecting
                      }}
                    >
                      <Download className="h-4" />
                      Download
                    </button>
                  </motion.div>
                )}
              </div>

              <span className="flex items-center gap-2">

                Folder:

                <p className="text-sm text-gray-600">{file.folder_name}</p>

              </span>

              <span className="flex gap-2">Date:<p className=" text-xs text-gray-600  mt-1">

                {file.date_of_upload && !isNaN(new Date(file.date_of_upload))

                  ? new Date(file.date_of_upload).toLocaleString('en-US', {

                    weekday: 'short',

                    year: 'numeric',

                    month: 'short',

                    day: 'numeric',

                    hour: 'numeric',

                    minute: 'numeric',

                    // second: 'numeric',

                    hour12: true, // for 24-hour format

                  })

                  : "Invalid Date"}

              </p>

              </span>

              <span className="flex items-center gap-1">

                Contact:

                <p className="text-xs text-gray-600">{file.folder_contact}</p>

              </span>

              <span className="flex items-center gap-1">

                Tag:

                <p className="text-xs text-gray-600">{file.folder_tag}</p>

              </span>

              <div className="mt-2 flex gap-2">



              </div>

            </div>

          ))}

      </div>)}

      {/* Upload Modal */}

      {isUploading && (

        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">

          <div className="bg-white p-6 mx-2 rounded shadow-lg max-w-sm w-full">

            <div className="flex justify-between items-center mb-4">

              <h2 className="text-lg font-semibold">Upload File</h2>

              <button onClick={() => setIsUploading(false)}>

                <X className="w-5 h-5 text-gray-700 hover:text-red-500" />

              </button>

            </div>

            <div className="border-dashed border-2 border-blue-500 p-4 text-center">

              <div className="flex justify-center">

                <img src={upload} alt="" className="h-10 w-10" />

              </div>

              <label className="block text-gray-600 mb-1">

                Drag your files to start uploading

              </label>

              <div className="relative flex items-center my-2">

                <hr className="flex-grow border-gray-300" />

                <p className="px-2 text-gray-500 text-lg">or</p>

                <hr className="flex-grow border-gray-300" />

              </div>

              <input

                type="file"

                multiple

                onChange={handleFileUpload}

                className="hidden"

                id="file-upload"

              />

              <label

                htmlFor="file-upload"

                className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"

              >

                Browse Files

              </label>

            </div>

            <div className="text-gray-400 text-sm">

              {/* <p>Only support .jpg, .png, .svg and zip files</p> */}

            </div>



            {/* Show Progress Bar for Files Being Uploaded */}

            <div className="mt-4 space-y-2">

              {uploadQueue.map((file) => (

                <div

                  key={file.id}

                  className="flex justify-between items-center"

                >

                  <div className="w-3/4">

                    <p className="font-medium">{file.name}</p>

                    {file.isUploading && (

                      <div className="bg-gray-200 w-full h-2 rounded overflow-hidden">

                        <div

                          className="bg-blue-500 h-2"

                          style={{ width: `${file.progress}%` }}

                        ></div>

                      </div>

                    )}

                  </div>

                  <div className="flex items-center gap-2">

                    {!file.isUploading && (

                      <>

                        <button

                          className="text-blue-500 border-2 border-blue-500 p-0.5 px-2 rounded-md hover:text-blue-700"

                          onClick={() => handleEditFile(file)}

                        >

                          Edit

                        </button>

                        <button

                          className="text-red-500 hover:underline"

                          onClick={() => handleDeleteFile(file.name)}

                        >

                          <Trash2 className="stroke-red-600 h-10" />

                        </button>

                      </>

                    )}

                  </div>

                </div>

              ))}

            </div>



            <div className="flex justify-end gap-2 my-2">

              <button

                onClick={() => clear()}

                className="border-dashed border-2 border-blue-500 text-blue-700 px-4 py-2 rounded hover:bg-blue-500 hover:text-white"

              >

                Cancel

              </button>

              {isLoading ? (<button

                type="submit"

                className="cursor-not-allowed flex justify-center  bg-blue-400  px-7 py-2 rounded-md text-white"

              >

                <Loader2 className="animate-spin h-6 w-6 font-bold" />

              </button>) : (<button

                type="submit"

                className=" bg-blue-500 text-white  px-5 py-2 rounded-md hover:bg-blue-600 transition "

                onClick={uploadFileToServer}

              >

                Done

              </button>

              )}

            </div>

          </div>

        </div>

      )}



      {/* Edit File Modal */}

      {editFile && (

        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full m-2">

            <div className="flex justify-between items-center mb-4">

              <h2 className="text-lg font-semibold">Edit File</h2>

              <button onClick={() => clear()}>

                <X className="w-5 h-5 text-gray-700 hover:text-red-500" />

              </button>

            </div>



            {/* Title Field (instead of File Name) */}

            {/* File Name Input */}

            <input

              type="text"

              value={inputFileName} // Bind the input to `inputFileName` state

              onChange={(e) => setInputFileName(e.target.value)} // Update `inputFileName` state when the user types

              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"

            />



            {/* Description Field */}

            <div className="mt-2">

              <label className="block text-gray-600 mb-1">Description</label>

              <textarea

                value={editFile.description || ""} // Add description if it exists

                onChange={(e) =>

                  setEditFile({ ...editFile, description: e.target.value })

                }

                className="w-full border p-2 rounded"

                rows="1"

              ></textarea>

            </div>



            {/* Folder Dropdown */}

            <div className="mt-2">

              <label className="block text-gray-600 mb-1">Folder</label>

              {loading ? (

                <p>Loading folders...</p>

              ) : error ? (

                <p className="text-red-500">{error}</p>

              ) : (

                <div>

                  {/* If folder is selected, show dropdown to allow folder change */}

                  {selectedFolderId ? (

                    <div className="flex flex-col">

                      <label className="block mb-2">Selected Folder</label>

                      <select

                        value={selectedFolderId}

                        onChange={(e) => setSelectedFolderId(e.target.value)}

                        className="w-full border p-2 rounded"

                      >

                        {folders.map((folder) => (

                          <option key={folder.id} value={folder.id}>

                            {folder.name}

                          </option>

                        ))}

                      </select>

                    </div>

                  ) : (

                    // If no folder is selected, display buttons for folder selection

                    <div className="flex flex-col">

                      <label className="block">

                        Select a Folder to Upload File:

                      </label>

                      <div className="grid grid-cols-3 gap-2">

                        {folders.map((folder) => (

                          <button

                            key={folder.id}

                            className="border p-2 rounded text-center"

                            onClick={() => handleFolderSelect(folder.id)}

                          >

                            {folder.name}

                          </button>

                        ))}

                      </div>

                    </div>

                  )}

                </div>

              )}

            </div>



            {/* Tags Input */}

            <div className="mt-2">

              <label className="block text-gray-600 mb-1">Tags</label>

              <div className="relative">

                <input

                  type="text"

                  value={editFile.tag} // Bind the input value to the editFile.tag state

                  onChange={(e) =>

                    setEditFile({ ...editFile, tag: e.target.value })

                  } // Update tag state when the input changes

                  onKeyDown={(e) => {

                    if (e.key === "Enter" || e.key === "+" || e.key === " ") {

                      e.preventDefault();

                      const newTag = editFile.tag.trim();

                      if (newTag && !editFile.tag.split(",").includes(newTag)) {

                        setTags((prevTags) => [...prevTags, newTag]); // Add new tag to the tags state

                        setEditFile({ ...editFile, tag: "" }); // Clear input field after adding tag

                      }

                    }

                  }}

                  className="w-full border p-2 rounded"

                  placeholder="Add multiple tags"

                />



                <div className="absolute top-1/2 right-2 transform -translate-y-1/2 flex items-center">

                  <button

                    onClick={() => {

                      const newTag = editFile.tag.trim();

                      if (newTag && !editFile.tag.split(",").includes(newTag)) {

                        setEditFile({

                          ...editFile,

                          tag: `${editFile.tag},${newTag}`,

                        });

                      }

                    }}

                    className="text-gray-700 hover:text-blue-500"

                  >

                    +

                  </button>

                </div>

              </div>

              {/* Displaying tags */}

              {editFile.tag && (

                <div className="mt-2 flex flex-wrap gap-2">

                  {editFile.tag.split(",").map((tag, index) => (

                    <span

                      key={index}

                      className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded flex items-center"

                    >

                      {tag.trim()}

                      <button

                        onClick={() => {

                          const tags = editFile.tag

                            .split(",")

                            .filter((t) => t.trim() !== tag.trim());

                          setEditFile({ ...editFile, tag: tags.join(",") });

                        }}

                        className="ml-1 text-red-500 hover:text-red-700"

                      >

                        <X className="w-4 h-4" />

                      </button>

                    </span>

                  ))}

                </div>

              )}

            </div>



            {/* Action Buttons */}

            <div className="flex justify-end gap-2 my-2">

              <button

                onClick={

                  () => clear2() // setSelectedFolderId('');

                }

                className="border-2 border-blue-500 text-gray-700 px-4 py-2 rounded"

              >

                Cancel

              </button>

              <button

                onClick={() => handleSaveEdit(editFile)}

                className="bg-blue-500 text-white px-6 py-2 rounded flex items-center gap-2"

              >

                {/* <ArrowRight className="w-4 h-4" /> */}

                Save

              </button>

            </div>

          </div>

        </div>

      )}



      {share && (

        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">

          <div className="mt-4 bg-white p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-300">

            <div className="flex justify-between items-center mb-4">

              <h2 className="text-2xl font-semibold">

                Share <span className="text-blue-600">File</span>

              </h2>

              <button onClick={() => setShare(null)}>

                <X className="w-5 h-5 text-gray-700 hover:text-red-500" />

              </button>

              {/* <i

                                        className="fas fa-times cursor-pointer bg-black"

                                        onClick={() => setShareFileVisible(null)} // Close form

                                    ></i> */}

            </div>

            <div className="mb-4">

              <input

                type="text"

                placeholder="Add designee, members"

                className="w-full border border-blue-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"

                value={designee}

                onChange={handleDesigneeChange}

              />

            </div>

            <div className="mb-4">

              <h3 className="text-lg font-semibold">People with access</h3>

              {people.map((person, index) => (

                <div className="flex items-center mt-2" key={index}>

                  <img

                    src="https://placehold.co/40x40"

                    alt={`Profile picture of ${person.name}`}

                    className="w-10 h-10 rounded-full mr-3"

                  />

                  <div>

                    <p className="font-semibold">{person.name}</p>

                    <p className="text-sm text-gray-500">{person.email}</p>

                  </div>

                  {person.role && (

                    <span className="ml-auto text-gray-500">{person.role}</span>

                  )}

                </div>

              ))}

            </div>

            <div className="mb-4">

              <textarea

                placeholder="Message"

                className="w-full border border-blue-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"

                value={message}

                onChange={handleMessageChange}

              ></textarea>

            </div>

            <div className="flex items-center mb-4">

              <input

                type="checkbox"

                id="notify"

                checked={notify}

                onChange={handleNotifyChange}

                className="mr-2"

              />

              <label htmlFor="notify" className="text-sm">

                Notify people

              </label>

            </div>

            <div className="flex justify-end">

              <button

                onClick={handleSubmit}

                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"

              >

                Send

              </button>

            </div>

          </div>

        </div>

      )}



      {access && (

        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 ">

          <div className="mt-4 bg-white p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-300">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-3xl font-bold">

                Share <span className="text-blue-500">File</span>

              </h2>

              <button

                onClick={() => setAccess(null)}

                className="p-2 rounded-full "

              >

                <X className="w-6 h-6 text-gray-700 hover:text-red-500" />

              </button>

            </div>



            <div className="mb-6">

              <input

                type="text"

                placeholder="Add designee, members"

                className="w-full p-3 border border-blue-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"

                value={newUser}

                onChange={(e) => setNewUser(e.target.value)}

              />

              <button

                // onClick={addUser}     setShowDesignerPopup(true);

                className="mt-4 w-full p-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"

              >

                Add

              </button>

            </div>



            <div>

              <h3 className="text-xl font-semibold mb-4">People with access</h3>

              {users.map((user, index) => (

                <div

                  key={index}

                  className="flex items-center justify-between mb-4"

                >

                  <div className="flex items-center">

                    <img

                      src="https://placehold.co/40"

                      alt="User avatar"

                      className="w-12 h-12 rounded-full mr-4"

                    />

                    <div>

                      <p className="font-semibold text-lg">{user.name}</p>

                      <p className="text-gray-600 text-sm">{user.email}</p>

                    </div>

                  </div>



                  {user.role === "Owner" ? (

                    <p className="text-gray-500 text-sm">{user.permission}</p>

                  ) : (

                    <div className="relative">

                      <button

                        onClick={() =>

                          setShowDropdown(showDropdown === index ? null : index)

                        }

                        className="text-blue-500 border border-gray-300 rounded-lg px-3 py-2 text-sm"

                      >

                        {user.permission}

                      </button>

                      {showDropdown === index && (

                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-70">

                          <p

                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"

                            onClick={() => updatePermission(index, "Only View")}

                          >

                            Only View

                          </p>

                          <p

                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"

                            onClick={() =>

                              updatePermission(index, "Edit Access")

                            }

                          >

                            Edit Access

                          </p>

                          <p

                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"

                            onClick={() => removeUser(index)}

                          >

                            Remove Access

                          </p>

                        </div>

                      )}

                    </div>

                  )}

                </div>

              ))}

            </div>

          </div>

        </div>

      )}

      {deletebutton && (

        <div

          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"

          role="dialog"

          aria-labelledby="deleteModalLabel"

          aria-describedby="deleteModalDescription"

        >

          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full m-2">

            <div className="flex justify-between items-center mb-4">

              <h2 id="deleteModalLabel" className="text-lg font-semibold">

                Are you sure to delete this file?

              </h2>

            </div>

            <div

              id="deleteModalDescription"

              className="text-sm text-gray-600 mb-4"

            >

              This action cannot be undone. Please confirm if you'd like to

              proceed.

            </div>

            <div className="flex justify-end gap-2 my-2">

              <button

                onClick={() => setDeletebutton(false)}

                className="border-2 border-blue-500 text-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"

              >

                Cancel

              </button>

              <button

                onClick={() => {

                  deleteFile(selectedFileId);

                  setDeletebutton(false);

                }}

                className="bg-blue-500 text-white px-6 py-2 rounded flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"

              >

                Yes

              </button>

            </div>

          </div>

        </div>

      )}
      {deletebutton1 && (
        <div
          className="fixed inset-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"

          role="dialog"
          aria-labelledby="deleteModalLabel"
          aria-describedby="deleteModalDescription"
        >
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full m-2">
            <div className="flex justify-between items-center mb-4">
              <h2 id="deleteModalLabel" className="text-lg font-semibold">
                You have no active membership
              </h2>
            </div>

            <div
              id="deleteModalDescription"
              className="text-sm text-gray-600 mb-4"
            >
              Take a membership to access this feature.
            </div>

            <div className="flex justify-end gap-2 my-2">
              <button
                onClick={() => setDeletebutton1(false)}
                className="border-2 border-blue-500 text-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <NavLink
                to="/Subscription">
                <button className="bg-blue-500 text-white px-6 py-2 rounded flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => setDeletebutton1(false)}>
                  Take Membership
                </button>
              </NavLink>
            </div>
          </div>
        </div>
      )}

      {showDesignerPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-semibold">Add Designee</h3>
              <button
                onClick={() => setShowDesignerPopup(false)}
                className="text-gray-500"
              >
                ✕
              </button>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-center mb-4">
                <div className="w-24 h-24 rounded-full border-dashed border-2 flex items-center justify-center text-gray-500">
                  <Camera className="h-6 w-6" />
                </div>
              </div>
              <label className="block mb-2 text-sm font-medium">
                Enter Designee Name
              </label>
              <input
                type="text"
                placeholder="Designee Name"
                value={designeeName}
                onChange={(e) => setDesigneeName(e.target.value)}
                className="border p-2 rounded w-full mb-3"
              />
              <label className="block mb-2 text-sm font-medium">
                Enter Designee Phone Number
              </label>
              <input
                type="text"
                placeholder="Designee Phone Number"
                value={designeePhone}
                onChange={(e) => setDesigneePhone(e.target.value)}
                className="border p-2 rounded w-full mb-3"
              />
              <label className="block mb-2 text-sm font-medium">
                Enter Designee Email
              </label>
              <input
                type="email"
                placeholder="Designee Email"
                value={designeeEmail}
                onChange={(e) => setDesigneeEmail(e.target.value)}
                className="border p-2 rounded w-full mb-4"
              />
            </div>
            <button
              onClick={handleAddDesignee}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              Invite to Cumulus
            </button>
          </div>
        </div>
      )}

      {loading && <p>Loading...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {showOverlay && renderOverlay()}

    </div>

  );

};



export default Dashboard;
