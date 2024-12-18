import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import {
  Folder,
  Plus,
  Check,
  Mic,
  CircleArrowUp,
  Users,
  CircleAlertIcon,
  User,
  Camera,
  EllipsisVertical,
  Cross,
  x,
  X,
  LogOut
} from "lucide-react";
import logo from "../../assets/logo.png";
import axios from "axios";
import { Link, Navigate, NavLink, useLocation ,useNavigate } from "react-router-dom";
import fetchUserData from "./fetchUserData";
import { API_URL } from "../utils/Apiconfig";
const Sidebar = ({ onFolderSelect }) => {
  const [deletebutton, setDeletebutton] = useState(false);
  const [deletebutton2, setDeletebutton2] = useState(false);
  const [folders, setFolders] = useState([]);
  
  const location = useLocation(); // Access current URL for routing
  // const [designers, setDesigners] = useState([
  //     "Hariom Gupta",
  //     "Himanshu",
  //     "Designer 3",
  //     "Designer 4",
  // ]);
  const navigate = useNavigate();
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newFolder, setNewFolder] = useState("");
  const [viewAllFolders, setViewAllFolders] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // Added for feedback messages
  const [newDesigner, setNewDesigner] = useState("");
  const [showDesignerInput, setShowDesignerInput] = useState(false);
  // const [viewAllDesigners, setViewAllDesigners] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null); // For handling errors
  const [viewAllDesigners, setViewAllDesigners] = useState(false); // Toggles "View All" and "View Less"
  // const [designers, setDesigners] = useState(["Designer 1", "Designer 2", "Designer 3", "Designer 4"]);
  const [designers, setDesigners] = useState([]);
  const [showDesignerPopup, setShowDesignerPopup] = useState(false); // Toggles the popup visibility
  const [designeeName, setDesigneeName] = useState(""); // Holds the input for designee name
  const [designeePhone, setDesigneePhone] = useState(""); // Holds the input for designee phone number
  const [designeeEmail, setDesigneeEmail] = useState(""); // Holds the input for designee email
  const [isEllipsesOpen, setIsEllipsesOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(false);
  const [isMembershipActive, setIsMembershipActive] = useState(false);
  const [membershipDetail, setMembershipDetail] = useState(null);
  const [deletebutton1, setDeletebutton1] = useState(false);

  async function logout() {
    try {
      // Retrieve token from local storage
      const token = Cookies.get('token');
  
      // Check if token exists
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }
  
      // API endpoint for logout
      const apiUrl = `${API_URL}/api/auth/signout`;
  
      // Set up the headers with Bearer token
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
  
      // Make the API call
      const response = await fetch(apiUrl, { method: 'POST', headers });
  
      // Check if logout was successful
      if (!response.ok) {
        throw new Error("Failed to log out. Please try again.");
      }
  
      // Optionally, clear the token from local storage
      Cookies.remove('token');
      navigate("/Login"); // Redirect to Dashboard
      console.log("Logged out successfully.");
    } catch (error) {
      console.error(error);
    }
  }
  
  


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
        setError(err.message || "Failed to fetch user data");
      }
    };
    getUserData();
  }, []);
  const toggleEllipses = (folderId) => {
    const newOpenMenuId = openMenuId === folderId ? null : folderId;
    setOpenMenuId(newOpenMenuId);
    localStorage.setItem("openMenuId", JSON.stringify(newOpenMenuId));
  };
  // const toggleEllipses = () => {
  //     setIsEllipsesOpen(!isEllipsesOpen);

  // };
  // Fetch folders from API
  const fetchFolders = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('token');

      if (!token) {
        throw new Error("No token found. Please log in again.");
        setDeletebutton1(true);
      }

      const response = await axios.get(
        `${API_URL}/api/get-folders`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        }
      );

      // Extract folder names and _id from the response
      const foldersData = response.data.map((folder) => ({
        id: folder._id, // Get _id for folder selection
        name: folder.folder_name,
      }));

      setFolders(foldersData); // Set fetched folders
    } catch (error) {
      // setError(error.response?.data?.message || "Error fetching folders.");
      setDeletebutton1(true);
    } finally {
      setLoading(false);
    }
  };
  const deleteFile = async (folder) => {
    const token = Cookies.get('token');
    const selectedFolder = folder; // Ensure folderId is set correctly
  
    console.log("Token:", token);
    console.log("Selected Folder ID:", selectedFolder);
  
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
  
    try {
      const response = await axios.post(
        `${API_URL}/api/delete-folder`,
        { folder_id: selectedFolder },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (response.status === 200) {
        setOpenMenuId(false);
        fetchFolders();
        setMessage(response.data.message || "Folder deleted successfully.");
        
      } else {
        setMessage(response.data.message || "Failed to delete the folder.");
        setErrorMessage(response.data.message || "Failed to delete the folder.");
        setOverlayVisible(true);
      }
      setDeletebutton(false);
    } catch (error) {
      console.error("Error deleting folder:", error?.response?.data || error);
      setErrorMessage(
        error.response?.data?.message || "An error occurred while deleting the folder."
      );
      setOverlayVisible(true);
    }
  };
  const closeOverlay = () => {
    setOverlayVisible(false);
    setErrorMessage("");
  };
  
  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserData();
        setUserData(data);
      } catch (err) {
        setError(err.message || "Failed to fetch user data");
      }
    };
    getUserData();
  }, []);
  // Run on component mount
  useEffect(() => {
    fetchFolders();
  }, []);

  // Handle folder selection
  const handleFolderSelect = (folder) => {
    // setSelectedFolder(folder.id); // Set the selected folder's ID
    // console.log(setSelectedFolder);
    if (onFolderSelect) {
      onFolderSelect(folder.id); // Pass the _id of the folder to the parent
    }
  };

  // Add folder
  const handleAddFolder = async () => {
    if (newFolder.trim()) {
      setLoading(true);
      try {
        const token = Cookies.get('token');
        if (!token) {
          throw new Error("No token found. Please log in again.");
        }

        const response = await axios.post(
          `${API_URL}/api/create-folder`,
          { folder_name: newFolder },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const newFolderData = response.data.folder;
        setFolders([
          ...folders,
          { id: newFolderData._id, name: newFolderData.folder_name },
        ]);
        setNewFolder("");
        setShowFolderInput(false);
      } catch (error) {
        setError(error.response?.data?.message || "Error creating folder.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Add Designer
  // const handleAddDesigner = () => {
  //     if (newDesigner.trim()) {
  //         setDesigners([...designers, newDesigner]);
  //         setNewDesigner("");
  //     }
  //     setShowDesignerInput(false);
  // };

  const handleAddDesignee = () => {
    if (designeeName && designeePhone && designeeEmail) {
      setDesigners([...designers, designeeName]); // Add the new designer to the list
      setShowDesignerPopup(false); // Close the popup
      setDesigneeName(""); // Reset the input fields
      setDesigneePhone("");
      setDesigneeEmail("");
    } else {
      alert("Please fill out all fields before inviting a designee.");
    }
  };
  useEffect(() => {
    console.log("Current path:", location.pathname); // Debugging
    if (location.pathname === "/folder/1") {
      console.log("Fetching files for folder 1");
      onFolderSelect(1); // Trigger the function to fetch files for folder 1
    }
  }, [location, onFolderSelect]);
  return (
    <div className="hidden md:flex flex-col w-64 bg-gray-100 p-4 space-y-0 min-h-screen ">
      <div style={{ width: "25vw", maxWidth: "none" }} className="mb-5">
        <img
          src={logo}
          alt="Cumulus Logo"
          style={{ width: "100vw", height: "50px" }}
        />
      </div>

      {/* Folders Section */}
      <div>
        <NavLink
          to="/folder/1"
          className={({ isActive }) =>
            `flex mb-2 cursor-pointer p-2 rounded ${
              isActive ? "bg-blue-500 text-white" : "text-gray-700"
            }`
          }
          onClick={() => {
            console.log("What is Cumulus clicked, sending folderId = 1");
            onFolderSelect(1);
          }}
        >
          <h2 className="ml-3 font-bold">What is Cumulus</h2>
        </NavLink>
        <NavLink
          to="/folder/0"
          className={({ isActive }) =>
            `flex mb-2 cursor-pointer p-2 rounded ${
              isActive ? "bg-blue-500 text-white" : "text-gray-700"
            }`
          }
          onClick={() => {
            console.log("All Files clicked, sending folderId = 0");
            onFolderSelect(0);
          }}
        >
          <h2 className="ml-3">All Files</h2>
        </NavLink>

        <h2 className="font-semibold text-xs mb-2">
          {folders.length} Folders
          {folders.length > 3 && (
            <button
              onClick={() => setViewAllFolders(!viewAllFolders)}
              className="text-blue-500 text-xs float-right"
            >
              {viewAllFolders ? "View Less" : "View All"}
            </button>
          )}
        </h2>
        {loading && <p>Loading folders...</p>}

        <ul>
          {(viewAllFolders ? folders : folders.slice(0, 3)).map((folder) => (
            <NavLink
              key={folder.id}
              to={`/folder/${folder.id}`}
              onClick={(e) => {
                if (openMenuId === folder.id) {
                  e.preventDefault();
                } else {
                  handleFolderSelect(folder);
                }
              }}
              className={({ isActive }) =>
                `py-1 px-2 flex items-center rounded cursor-pointer ${
                  isActive ? "bg-blue-500 text-white" : "text-gray-700"
                }`
              }
            >
              <div className="flex justify-between w-full relative">
                {folder.name}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleEllipses(folder.id); // Handle menu toggle without navigation
                  }}
                >
                  <EllipsisVertical />
                </button>

                {/* Menu Options */}
                {openMenuId === folder.id && (
          <div className="absolute top-full right-0 mt-2 w-32 bg-white shadow-lg rounded-lg text-black">
            <button
              className="w-full px-4 py-2 text-left hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenuId(null);
              }}
            >
              Edit
            </button>
            <button
              className="w-full px-4 py-2 text-left hover:bg-gray-100"
              onClick={(e) => {
                // e.stopPropagation();
                // setOpenMenuId(null);
                setDeletebutton(true); // Open Delete Confirmation Modal
                setSelectedFolder(folder.id); // Set Selected Folder
              }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </NavLink>
          ))}
        </ul>
        {!showFolderInput && (
          <button
            onClick={() => {
              if (isMembershipActive) {
                setShowFolderInput(true);
              } else {
                setDeletebutton2(true);
              }
            }}
            className="flex items-center w-full text-blue-500 mt-2 justify-center border"
          >
            <Plus className="mr-2" />
            Add Folder
          </button>
        )}
  {showFolderInput && (
  <div className="flex items-center mt-2">
    <input
      type="text"
      placeholder="New Folder Name"
      value={newFolder}
      onChange={(e) => setNewFolder(e.target.value)}
      className="border p-2 rounded w-full mr-2"
    />
    <button onClick={handleAddFolder} className="text-green-500 mr-2">
      <Check />
    </button>
    <button
      onClick={() => {
        setShowFolderInput(false); // Close the input box
        setNewFolder(""); // Optionally reset the input
      }}
      className="text-red-500"
    >
      <X />
    </button>
  </div>
)}
        {/* {error && <p className="text-red-500 mt-2">{error}</p>} */}
      </div>

      {/* Designees Section */}
      {/* <div>
                <h2 className="font-semibold text-xs mb-2">
                    {designers.length}+ Designees
                    {designers.length > 3 && (
                        <button
                            onClick={() => setViewAllDesigners(!viewAllDesigners)}
                            className="text-blue-500 text-xs float-right"
                        >
                            {viewAllDesigners ? "View Less" : "View All"}
                        </button>
                    )}
                </h2>
                <ul>
                    {(viewAllDesigners ? designers : designers.slice(0, 3)).map(
                        (designer, index) => (
                            <li
                                key={index}
                                className="text-gray-700 py-1 hover:text-blue-500 flex items-center cursor-pointer"
                            >
                                <User className="mr-2" />
                                {designer}
                            </li>
                        )
                    )}
                </ul>
                {!showDesignerInput && (
                    <button
                        onClick={() => setShowDesignerInput(true)}
                        className="flex items-center w-full text-blue-500 mt-2 justify-center border"
                    >
                        <Plus className="mr-2" />
                        Add Designer
                    </button>
                )}
                {showDesignerInput && (
                    <div className="flex items-center mt-2">
                        <input
                            type="text"
                            placeholder="New Designer Name"
                            value={newDesigner}
                            onChange={(e) => setNewDesigner(e.target.value)}
                            className="border p-2 rounded w-full mr-2"
                        />
                        <button onClick={handleAddDesigner} className="text-green-500">
                            <Check />
                        </button>
                    </div>
                )}
            </div> */}

      {/* Designees Section */}
      <div>
        <h2 className="font-semibold text-xs mb-2">
          {designers.length} Designees
          {designers.length > 3 && (
            <button
              onClick={() => setViewAllDesigners(!viewAllDesigners)}
              className="text-blue-500 text-xs float-right"
            >
              {viewAllDesigners ? "View Less" : "View All"}
            </button>
          )}
        </h2>
        <ul>
          {(viewAllDesigners ? designers : designers.slice(0, 3)).map(
            (designer, index) => (
              <li
                key={index}
                className="text-gray-700 py-1 hover:text-blue-500 flex items-center cursor-pointer"
              >
                <User className="mr-2" />
                {designer}
              </li>
            )
          )}
        </ul>
        {/* Add Designer Button */}
        <button
          onClick={() => {
            if (isMembershipActive) {
              setShowDesignerPopup(true);
            } else {
              setDeletebutton2(true);
            }
          }}
          className="flex items-center w-full text-blue-500 mt-2 justify-center border"
        >
          <Plus className="mr-2" />
          Add Designer
        </button>

        {/* Popup for Adding Designee */}
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
                // onClick={handleAddDesignee}
                onClick={() => setShowDesignerPopup(false)}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
              >
                Invite to Cumulus
              </button>

              
            </div>
            
          </div>
        )}
      </div>

      {/* Tags
            <div>
                <h2 className="font-bold mb-1">Tags</h2>
                <span className="text-gray-700 py-1 px-2 bg-gray-200 rounded-full ">Will</span>
            </div> */}

      {/* Voice memo */}
      <div>
        <h2 className="font-bold mb-1">Voice memo</h2>
        <NavLink
          to="/voicememo"
          className={({ isActive }) =>
            `flex mb-2 cursor-pointer p-2 rounded  ${
              isActive ? "bg-blue-500 text-white" : "text-gray-700"
            }`
          }
        >
          <h2 className="ml-3">Create A Voicememo</h2>
        </NavLink>
      </div>

      {/* Transfer */}
      <div>
        <h2 className="font-bold mb-1">Transfer</h2>
        <div className="text-gray-700 py-1 hover:text-blue-500 cursor-pointer flex">
          <CircleArrowUp />
          <span className="ml-2">Sharing After Death</span>
        </div>
      </div>

      {/* Shared Files */}

      <div>
        <h2 className="font-bold mb-1">Share file</h2>
        <NavLink
          to="/SharedFiles"
          className={({ isActive }) =>
            `flex mb-2 cursor-pointer p-2 rounded  ${
              isActive ? "bg-blue-500 text-white" : "text-gray-700"
            }`
          }
        >
          <h2 className="ml-3">Share With Me</h2>
        </NavLink>
      </div>

      {/* Help & Support */}
      {/* <NavLink to=""> */}
      <div className="mt-auto">
        <div className="text-gray-700 py-1 hover:text-blue-500 cursor-pointer flex">
          <CircleAlertIcon />
          <span className="ml-2">Help & Support</span>
        </div>
      </div>
      <div className="py-60">
      <button
  onClick={logout}
  className="text-gray-700 mt-[60px] hover:text-red-600 cursor-pointer flex font-medium rounded-md  transition duration-300"
>

      {/* Lucide Icon */}
      <LogOut className="w-5 h-5 mr-2" />

      {/* Button Text */}
      <span>Sign Out</span>
    </button>
    </div>
      {/* </NavLink> */}
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
          Are you sure to delete this folder?
        </h2>
      </div>
      <div id="deleteModalDescription" className="text-sm text-gray-600 mb-4">
        This action cannot be undone. Please confirm if you'd like to proceed.
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
            deleteFile(selectedFolder); // Pass Selected Folder ID
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
{overlayVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-11/12 max-w-md rounded-lg shadow-lg p-6 relative">
            {/* Close Button */}
            <button
              onClick={closeOverlay}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Error Message */}
            <p className="text-gray-800 text-center">{errorMessage}</p>

            {/* Close Button (Optional) */}
            <button
              onClick={closeOverlay}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition w-full"
            >
              Close
            </button>
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
                Session Expired
                </h2>
              </div>

              <div
                id="deleteModalDescription"
                className="text-sm text-gray-600 mb-4"
              >
                Your session has been expired
                please re-login to 
              </div>

              <div className="flex justify-end gap-2 my-2">
 <NavLink
          to="/Login">
                <button className="bg-blue-500 text-white px-6 py-2 rounded flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                 onClick={() => setDeletebutton1(false)}>
                  Login
                </button>
                </NavLink>
              </div>
            </div>
          </div>
        )}

{deletebutton2 && (
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
                  onClick={() => setDeletebutton2(false)}
                  className="border-2 border-blue-500 text-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
 <NavLink
          to="/Subscription">
                <button className="bg-blue-500 text-white px-6 py-2 rounded flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                 onClick={() => setDeletebutton2(false)}>
                  Take Membership
                </button>
                </NavLink>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Sidebar;
//SharedFiles
