import React, { useState } from "react";
import { ChevronDown, Grid, List } from "lucide-react";

const SharedFiles = () => {
    const [isGridView, setIsGridView] = useState(false); // Toggle between grid and table view

    // Example data for shared files
    const sharedFiles = [
        {
            id: 1,
            sharedBy: "Jie Yan Song",
            date: "Nov 28, 2024 6:28 pm",
            sharedItem: "Tax_Return_2023.pdf",
            additionalItems: 4,
            modify: "View Access",
        },
        {
            id: 2,
            sharedBy: "Hector Lee",
            date: "Nov 28, 2024 6:28 pm",
            sharedItem: "Car_Insurance_Policy.pdf",
            additionalItems: 4,
            modify: "Edit Access",
        },
        {
            id: 3,
            sharedBy: "Jie Yan Song",
            date: "Nov 28, 2024 6:28 pm",
            sharedItem: "College_Transcript.pdf",
            additionalItems: 4,
            modify: "View Access",
        },
        {
            id: 4,
            sharedBy: "Sam K Young",
            date: "Nov 28, 2024 6:28 pm",
            sharedItem: "Medical_Bills_Q1.pdf",
            additionalItems: 4,
            modify: "Edit Access",
        },
        {
            id: 5,
            sharedBy: "Jie Yan Song",
            date: "Nov 28, 2024 6:28 pm",
            sharedItem: "Lease_Agreement_2024.pdf",
            additionalItems: 4,
            modify: "Edit Access",
        },
    ];

    return (
        <div className="p-6">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-4 ">
                <h1 className="text-xl font-semibold">Shared Files</h1>
                <button
                    onClick={() => setIsGridView(!isGridView)}
                    className="p-2 bg-gray-200 rounded-md hover:bg-gray-300 sm:hidden"
                >
                    {isGridView ? <List size={20} /> : <Grid size={20} />}
                </button>
            </div>

            {/* Large Screen: Table View */}


            {/* Small Screen: Toggle between Table and Grid Views */}
            <div className="sm:block ">
                {!isGridView ? (
                    // Table View for Small Screens
                    <div className="">
                        <table className="w-full  text-left text-gray-600">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                <tr>
                                    <th scope="col" className=" py-3">
                                        Shared By
                                    </th>
                                    <th scope="col" className="px-2 py-3">
                                        Date
                                    </th>
                                    <th scope="col" className="px-2 py-3">
                                        Shared Item
                                    </th>
                                    <th scope="col" className="px-2 py-3">
                                        Modify
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sharedFiles.map((file) => (
                                    <tr
                                        key={file.id}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        <td className="">
                                            {/* <img
                                                src="https://via.placeholder.com/32"
                                                alt={file.sharedBy}
                                                className="w-8 h-8 rounded-full mr-2"
                                            /> */}
                                            <span className="text-xs" >{file.sharedBy}</span>
                                        </td>
                                        <td className="px-3 py-4 text-xs sm:text-sm">{file.date}</td>
                                        <td className="px-3 py-4 text-xs sm:text-sm">
                                            <div className="flex items-center">
                                                <ChevronDown size={16} className=" text-gray-500" />
                                                <div>
                                                    <p>{file.sharedItem}</p>
                                                    <p className="text-xs text-gray-500">
                                                        +{file.additionalItems} Items
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className=" py-4 text-blue-500 cursor-pointer text-xs sm:text-sm">
                                            {file.modify}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                ) : (
                    // Grid View for Small Screens
                    <div className="grid grid-cols-2 gap-2">
                        {sharedFiles.map((file) => (
                            <div
                                key={file.id}
                                className="p-4 bg-white shadow-lg rounded-lg border border-gray-200 hover:bg-gray-50"
                            >
                                <div className="flex items-center mb-4">
                                    <img
                                        src="https://via.placeholder.com/32"
                                        alt={file.sharedBy}
                                        className="w-8 h-8 rounded-full mr-2"
                                    />
                                    <p className="font-medium text-sm">{file.sharedBy}</p>
                                </div>
                                <p className="text-xs text-gray-600 mb-2">
                                    <span className="font-semibold">Date:</span> {file.date}
                                </p>
                                <div className="flex items-center">
                                    {/* <ChevronDown size={16} className="mr-2 text-gray-500" /> */}
                                    <div>
                                        <p className="text-xs">{file.sharedItem}</p>
                                        <p className="text-xs text-gray-500">
                                            +{file.additionalItems} Items
                                        </p>
                                    </div>
                                </div>
                                <p className="mt-2 text-blue-500 text-sm cursor-pointer">
                                    {file.modify}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SharedFiles;