import { useState, useEffect } from "react";
import { Folder, Plus, Check, Mic, CircleArrowUp, Users, CircleAlertIcon, User, Camera, EllipsisVertical, Menu, X } from "lucide-react";
import logo from "../../assets/logo.png";
import axios from "axios";
import { Link, Navigate, NavLink, useLocation } from "react-router-dom";

const MobileSidebar = ({ onFolderSelect }) => {
    const [folders, setFolders] = useState([]);
    const location = useLocation(); // Access current URL for routing

    const [isOpen, setIsOpen] = useState(false);
    // const [selectedFolder, setSelectedFolder] = useState(null);
    const [showFolderInput, setShowFolderInput] = useState(false);
    const [newFolder, setNewFolder] = useState("");
    const [viewAllFolders, setViewAllFolders] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // For handling errors
    const [newDesigner, setNewDesigner] = useState("");
    const [showDesignerInput, setShowDesignerInput] = useState(false);
    // const [viewAllDesigners, setViewAllDesigners] = useState(false);

    const [viewAllDesigners, setViewAllDesigners] = useState(false); // Toggles "View All" and "View Less"
    const [designers, setDesigners] = useState(["Designer 1", "Designer 2", "Designer 3", "Designer 4"]); // List of designees
    const [showDesignerPopup, setShowDesignerPopup] = useState(false); // Toggles the popup visibility
    const [designeeName, setDesigneeName] = useState(""); // Holds the input for designee name
    const [designeePhone, setDesigneePhone] = useState(""); // Holds the input for designee phone number
    const [designeeEmail, setDesigneeEmail] = useState(""); // Holds the input for designee email

    const [openMenuId, setOpenMenuId] = useState(
        () => JSON.parse(localStorage.getItem("openMenuId")) || null
    );
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
            const token = localStorage.getItem("token"); // Retrieve token from localStorage
            if (!token) {
                throw new Error("No token found. Please log in again.");
            }

            const response = await axios.get("http://localhost:3000/api/get-folders", {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token in Authorization header
                },
            });

            // Extract folder names and _id from the response
            const foldersData = response.data.map((folder) => ({
                id: folder._id, // Get _id for folder selection
                name: folder.folder_name,
            }));

            setFolders(foldersData); // Set fetched folders
        } catch (error) {
            setError(error.response?.data?.message || "Error fetching folders.");
        } finally {
            setLoading(false);
        }
    };

    // Run on component mount
    useEffect(() => {
        fetchFolders();
    }, []);

    // Handle folder selection
    const handleFolderSelect = (folder) => {
        // setSelectedFolder(folder.id); // Set the selected folder's ID
        // console.log(setSelectedFolder);
        if (onFolderSelect) {
            onFolderSelect(folder.id);  // Pass the _id of the folder to the parent
        }
    };

    // Add folder
    const handleAddFolder = async () => {
        if (newFolder.trim()) {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No token found. Please log in again.");
                }

                const response = await axios.post(
                    "http://localhost:3000/api/create-folder",
                    { folder_name: newFolder },
                    {
                        headers: {
                            Authorization:` Bearer ${token}`,
                        },
                    }
                );

                const newFolderData = response.data.folder;
                setFolders([...folders, { id: newFolderData._id, name: newFolderData.folder_name }]);
                setNewFolder("");
                setShowFolderInput(false);
            } catch (error) {
                setError(error.response?.data?.message || "Error creating folder.");
            } finally {
                setLoading(false);
            }
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
        <>
            {/* Menu Icon to Open Sidebar */}
            <div className="md:hidden z-50">
                <button onClick={() => setIsOpen(true)}>
                    <Menu size={32} className="text-gray-700" />
                </button>
            </div>

            {/* Sidebar */}
            <div
                className={`fixed inset-0 z-40 transform transition-all duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex flex-col w-64 bg-gray-100 p-4 space-y-4 min-h-screen">
                    {/* Close Icon */}
                    <div className="flex justify-between">
                        <div >
                            <img
                                src={logo}
                                alt="Cumulus Logo"
                                style={{ width: '100vw', height: '30px' }}
                            />
                        </div>
                        <button onClick={() => setIsOpen(false)}>
                            <X size={32} />
                        </button>
                    </div>

                    {/* Files Section */}
                    <div>
                        <NavLink
                            to="/folder/1"
                            className={({ isActive }) =>
                                `flex mb-2 cursor-pointer p-2 rounded ${isActive ? "bg-blue-500 text-white" : "text-gray-700"}`
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
                                `flex mb-2 cursor-pointer p-2 rounded ${isActive ? "bg-blue-500 text-white" : "text-gray-700"}`
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
                                        `py-1 px-2 flex items-center rounded cursor-pointer ${isActive ? "bg-blue-500 text-white" : "text-gray-700"}`
                                    }
                                >
                                    <div className="flex justify-between w-full relative">
                                        {folder.name}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setOpenMenuId(folder.id);
                                            }}
                                        >
                                            <EllipsisVertical />
                                        </button>

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
                                                        e.stopPropagation();
                                                        setOpenMenuId(null);
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
                                onClick={() => setShowFolderInput(true)}
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
                                <button onClick={handleAddFolder} className="text-green-500">
                                    <Check />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Add other sections here */}

                    {/* Designees Section */}
                    <div>
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
                        {/* Add Designer Button */}
                        <button
                            onClick={() => setShowDesignerPopup(true)}
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
                                        <button onClick={() => setShowDesignerPopup(false)} className="text-gray-500">
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
                    </div>

                    {/* Voice memo */}
                    <div>
                        <h2 className="font-bold mb-1">Voice memo</h2>
                        <NavLink
                            to="/voicememo"
                            className={({ isActive }) =>
                                `flex mb-2 cursor-pointer p-2 rounded  ${isActive ? "bg-blue-500 text-white" : "text-gray-700"
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
                        <h2 className="font-bold mb-1">Shared Files</h2>
                        <div className="text-gray-700 py-1 hover:text-blue-500 cursor-pointer flex">
                            <NavLink
                                className={({ isActive }) =>
                                    `py-1 px-2 flex items-center rounded cursor-pointer  ${isActive ? "bg-blue-500 text-white" : "text-gray-700"
                                    }`
                                }
                                to="/SharedFiles">
                                <Users />
                                <span className="ml-2">Shared With Me</span>
                            </NavLink>
                        </div>
                    </div>


                    <div className="mt-auto">
                        <div className="text-gray-700 py-1 hover:text-blue-500 cursor-pointer flex">
                            <CircleAlertIcon />
                            <span className="ml-2">Help & Support</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


export default MobileSidebar;