import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Menu, LayoutGrid, X, ChevronDown, Users, Edit, Eye, Trash2 } from 'lucide-react';
import fetchUserData from './fetchUserData';
import {  NavLink } from "react-router-dom";
// import VoiceLogo from '../../assets/VoiceLogo.png';
// import voicepage from '../../assets/voicepage.png';
import { API_URL } from '../utils/Apiconfig';
import axios from 'axios'; // For API integration
const Voicememo = () => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  // const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [audioName, setAudioName] = useState('');
  const [audioFiles, setAudioFiles] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [frequencyData, setFrequencyData] = useState([]);
  const [isStopped, setIsStopped] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null); // Reference to the audio element
  const [expandedRow, setExpandedRow] = useState(null);
  const [message, setMessage] = useState(null); // Added for feedback messages
  const [deletebutton, setDeletebutton] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const [elapsedTime, setElapsedTime] = useState(0); // Timer state
  const startTimeRef = useRef(null); // Ref to track recording start time
  const durationRef = useRef(null); // Ref to track duration
  const timerRef = useRef(null); // Reference to the timer
  const [designee, setDesignee] = useState("");
  const [share, setShare] = useState("");
  const [notify, setNotify] = useState(true);
  const [people, setPeople] = useState([]);
  const [isMembershipActive, setIsMembershipActive] = useState(false);
  const [membershipDetail, setMembershipDetail] = useState(null);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null); // For handling errors
  const [deletebutton1, setDeletebutton1] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [users, setUsers] = useState([]);
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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedEmail = localStorage.getItem("email");
  
    console.log("krcnjrncirc", storedUser);
    console.log("krcnjrncirc", storedEmail);
  
    setPeople([{ name: `${storedUser} (you)`, email: storedEmail, role: "Owner" }]);
    setUsers([{ name: `${storedUser} (you)`, email: storedEmail, role: "Owner" }]);
  }, []);
  const handleToggleRecording = () => {
    if (!isRecording && !isStopped) {
      // Start recording
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        audioChunks.current = [];
        mediaRecorder.ondataavailable = (event) => {
          audioChunks.current.push(event.data);
          startTimeRef.current = Date.now();
        };

        // Web Audio API for frequency analysis
        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        sourceRef.current = source;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const drawFrequency = () => {
          analyser.getByteFrequencyData(dataArray);
          setFrequencyData([...dataArray]);
          animationFrameRef.current = requestAnimationFrame(drawFrequency);
        };
        drawFrequency();
        setIsRecording(true);
        setShowPopup(true);

        timerRef.current = setInterval(() => {
          setDuration((prevTime) => prevTime + 1);
        }, 1000);
      });
    } else if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/mp3' });
          const url = URL.createObjectURL(audioBlob);
          setAudioURL(url);

          // Calculate duration
          const endTime = Date.now();
          durationRef.current = Math.round((endTime - startTimeRef.current) / 1000);

          setIsRecording(false);
          setIsStopped(true); // Recording stopped
          cancelAnimationFrame(animationFrameRef.current);

          // Stop all audio tracks to turn off the microphone
          if (mediaRecorderRef.current.stream) {
            mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
          }

          if (audioContextRef.current) {
            audioContextRef.current.close();
          }

          // Stop the timer
          clearInterval(timerRef.current);
        };
      }
    } else if (isStopped) {
      // Re-recording
      setIsStopped(false);
      setAudioURL(null); // Clear the previous audio URL
      // setElapsedTime(0); // Reset elapsed time
      setDuration((prevTime) => prevTime + 1);
      console.log(duration);
      console.log(setDuration);

    }
  };
  const handleSubmit = () => {
    // alert(`Designee: ${designee}\nMessage: ${message}\nNotify: ${notify}`);
    setShare(false);
  };

  const handleDesigneeChange = (e) => setDesignee(e.target.value);
  const handleMessageChange = (e) => setMessage(e.target.value);
  const handleNotifyChange = () => setNotify(!notify);
  const fetchAudioFiles = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token found. Please log in.");
        return;
      }

      const response = await axios.get(`${API_URL}/api/voice-memo/get-recordings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setAudioFiles(response.data);
      }
    } catch (error) {
      console.error('Error fetching audio files:', error);
    }
  };

  // const handlePlay = (audio) => {
  //   if (audioRef.current) {
  //     audioRef.current.src = audio.url;
  //     audioRef.current.play();
  //     setCurrentAudio(audio); // Set the current audio being played
  //   }
  // };
  const handlePlay = async (file) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/voice-memo/listen-recording`,
        { voice_id: file._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      const { audio_url, voice_name } = response.data;
  
      if (!audio_url) {
        console.error("Audio URL is missing");
        return;
      }
  
      // Set the current audio for the popup without playing it
      setCurrentAudio({ url: audio_url, name: voice_name });
    } catch (err) {
      console.error("Error fetching audio:", err);
    }
  };
  





  const saveRecording = async () => {
    if (audioName.trim() === '') {
      alert('Please enter a name for the recording.');
      return;
    }

    try {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/mp3' });
      const token = localStorage.getItem("token");

      if (!token) {
        alert('No token found. Please log in.');
        return;
      }

      const finalDuration = duration;

      if (isNaN(duration)) {
        alert('Invalid audio duration.');
        return;
      }

      const formData = new FormData();
      formData.append('voice_name', audioName);
      formData.append('voice_file', audioBlob);
      formData.append('duration', finalDuration);

      const response = await axios.post(
        `${API_URL}/api/voice-memo/upload-voice`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        const { fileName, size, date } = response.data;

        // Update the audio files list with the new recording
        setAudioFiles((prev) => [
          ...prev,
          { name: fileName, size, date, url: audioURL },
        ]);

        setAudioURL(null);
        setAudioName('');
        setShowPopup(false);
        fetchAudioFiles(); // Fetch updated list after saving
        // setDuration(); // Reset timer
        setIsRecording(false);
        
      } else {
        console.error`(Unexpected response: ${response.status})`;
      }
    } catch (error) {
      console.error('Error saving recording:', error.response || error.message);
      alert('Failed to save recording. Please try again.');
    }
  };
  // Fetch audio files on component mount
  useEffect(() => {
    fetchAudioFiles();
  }, []);

  const deleteFile = async (folderId) => {
    const token = localStorage.getItem("token");
    const selectedvoice = folderId;
  
    console.log("Token:", token);
    console.log("File ID to delete:", selectedvoice);
  
    if (!token) {
      setMessage("No token found. Please log in.");
      console.error("Missing token");
      return;
    }
  
    if (!selectedvoice) {
      setMessage("No file selected to delete.");
      console.error("Missing selectedvoice");
      return;
    }
  
    try {
      // Send the voice_id in the JSON body
      const response = await axios.delete(`${API_URL}/api/voice-memo/delete-voice`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // JSON content type
        },
        data: {
          voice_id: selectedvoice, // Add the voice_id in the body
        },
      });
  
      setMessage(response.data.message || "File deleted successfully.");
      fetchAudioFiles();
      setDeletebutton(false);
    } catch (error) {
      console.error("Error response:", error.response || error);
      setMessage(error.response?.data?.message || "Error deleting file.");
    }
  };
  
  
  

  // Helper function to calculate the duration of the audio (returns a number)
  // async function calculateAudioDuration(audioBlob) {
  //   return new Promise((resolve, reject) => {
  //     const audio = new Audio(URL.createObjectURL(audioBlob));
  //     audio.onloadedmetadata = () => {
  //       // Ensure duration is a number before returning it
  //       const duration = audio.duration;
  //       if (!isNaN(duration)) {
  //         resolve(duration);
  //       } else {
  //         reject('Invalid audio duration');
  //       }
  //     };
  //     audio.onerror = (e) => reject('Error loading audio');
  //   });
  // }

  useEffect(() => {
    if (canvasRef.current && frequencyData.length) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);
      frequencyData.forEach((value, index) => {
        const barWidth = (width / frequencyData.length) * 1.5;
        const barHeight = (value / 255) * height;
        const x = index * barWidth;
        ctx.fillStyle = '#4A90E2';
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
      });
    }
  }, [frequencyData]);
  useEffect(() => {
    // fetchAudioFiles(); // Fetch audio files on component mount
  }, []);

  // const getAudioDuration = (url) => {
  //   return new Promise((resolve) => {
  //     const audio = new Audio(url);
  //     audio.onloadedmetadata = () => {
  //       resolve(audio.duration); // Get the duration of the audio file
  //     };
  //   });
  // };

  // useEffect(() => {
  //   const fetchDurations = async () => {
  //     const durations  = {};
  //     for (let file of audioFiles) {
  //       const duration = await getAudioDuration(file.url);
  //       durations[file.url] = duration;
  //     }
  //     setAudioDurations(durations);
  //   };

  //   fetchDurations();
  // }, [audioFiles]);

  const handleToggleRow = (_id) => {
    console.log("Toggling row with id:", _id); // Log the ID when toggling the row
    setExpandedRow((prev) => {
      const newExpandedRow = prev === _id ? null : _id;
      console.log("Updated expandedRow:", newExpandedRow); // Log the new expandedRow value
      return newExpandedRow;
    });
  };
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
  return (
    <div className="mt-2 p-2 sm:p-4 min-h-screen bg-white">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">Your Voice Memo</h1>
        <div
          className="bg-blue-500 w-52 rounded-2xl my-2 p-1 cursor-pointer space-y-3"
       

          onClick={() => {
            if (isMembershipActive) {
              setShowPopup(true);
            } else {
              setDeletebutton1(true);
            }
          }}
        >
          <button className="flex items-center  text-white px-2 py-2">
            {/* <img src={VoiceLogo} alt="" className="h-12 w-12" /> */}
            <p className="text-lg">Record Now</p>
          </button>
          <div className="flex justify-between">
            <p className="text-white  text-sm ml-1">Click to record now</p>
            <ArrowRight className="mr-2 text-white" />
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed top-1/2 sm:top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-3 sm:p-6 shadow-lg rounded-lg w-2/3 sm:w-[25%]">
          <div className="flex justify-between">
            <h2 className="text-xl font-bold">
              {isRecording ? 'Recording in Progress' : 'Ready to Record'}
            </h2>
            <div onClick={() => setShowPopup(false)}>
              <X />
            </div>
          </div>
          <p className="mt-2 text-gray-600">
            {isStopped ? 'Click Re-Record to Restart the Recording.' : isRecording ? 'Recording in progress...' : 'Click Start to begin recording.'}
          </p>

          {/* {isRecording && (
            
          )} */}

          {isRecording && (
            <div className="mt-3">
              <canvas ref={canvasRef} className="w-full h-24 bg-gray-100 rounded-md"></canvas>
            </div>
          )}

          <p className="mt-2 text-gray-600">
            Time: {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, '0')}
          </p>

          <button
            onClick={handleToggleRecording}
            className={`mt-4 px-4 py-2 rounded-md text-white w-full ${isRecording || isStopped ? 'bg-blue-500' : 'bg-blue-500'}`}
          >
            {isStopped ? 'Re-recording' : isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>


          <div className="mt-4">
            <label htmlFor="voice">Enter voice name</label>
            <input
              type="text"
              placeholder="Enter voice memo name"
              value={audioName}
              onChange={(e) => setAudioName(e.target.value)}
              className="p-2 border rounded-md w-full"
            />
            <button
              onClick={saveRecording}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md w-full"
            >
              Save
            </button>
          </div>

          {/* {!isRecording &&  (
            <div className="mt-4">
              <label htmlFor="voice">Enter voice name</label>
              <input
                type="text"
                placeholder="Enter voice memo name"
                value={audioName}
                onChange={(e) => setAudioName(e.target.value)}
                className="p-2 border rounded-md w-full"
              />
              <button
                onClick={saveRecording}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md w-full"
              >
                Save
              </button>
            </div>
          )} */}
        </div>
      )}

      <div className="hidden sm:block mt-4">
        <h2 className="text-xl font-bold">Voices Library</h2>
      </div>

      <div className="flex justify-between items-center mt-8 sm:hidden">
        <h2 className="text-xl font-bold">Voices Library</h2>
        <button
          onClick={() => setViewMode((prev) => (prev === 'list' ? 'grid' : 'list'))}
          className="px-4 py-2 bg-blue-500 text-white rounded-md flex"
        >
          {viewMode === 'list' ? <LayoutGrid className="h-5" /> : <Menu className="h-6" />}
          {viewMode === 'list' ? 'Grid View' : 'List View'}
        </button>
      </div>


      {viewMode === 'list' ? (
        <table className="w-full mt-4 text-left border-collapse shadow">
          <thead>
            <tr className="border bg-gray-100 text-left text-[0.6rem]  md:text-lg shadow-sm ">
              <th className="p-2">Voice Name</th>
              <th className="p-2">Duration</th>

              <th className="p-2">Date Uploaded</th>
              <th className="p-2">File Size</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {audioFiles.map((file, index) => (
              <React.Fragment key={file._id}>
                <tr className=' text-[0.6rem] sm:text-sm' key={index}>
                  <td className=" p-2 flex items-center">
                    <button
                      className="text-gray-500 hover:text-gray-800"
                      onClick={() => handleToggleRow(file._id)} // Pass the correct file._id
                    >
                      <ChevronDown
                        className={`${expandedRow === file._id ? "rotate-180" : ""} h-5`}
                      />
                    </button>
                    {file.voice_name}</td>
                  <td className="p-2">
                    {file.duration} {file.duration !== 1 ? 'sec' : 'sec'}
                  </td>

                  <td className=" p-2">
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
                  </td>
                  <td className=" p-2">{file.file_size} Kb</td>
                  <td className="p-2">


                    <button
                      onClick={() => handlePlay(file)}

                      className="px-2 py-1 bg-blue-500 text-white rounded-md"
                    >
                      Play
                    </button>
                  </td>
                </tr>

                {expandedRow === file._id && (
                  <tr className="bg-white  ">
                    <td colSpan="5" className="p-2">
                      <div className="flex gap-4 items-center">
                        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                          // onClick={() => setShare(true)}
                          onClick={() => setShare(true)}
                        >
                          <Users className='h-4' />
                        </button>

                        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                        // onClick={() => handleEditFile(file)}
                        >
                          <Edit className='h-4' />
                        </button>

                        <button
                          className="flex items-center gap-2 text-gray-600 hover:text-red-500"
                          onClick={() => {
                            //   setDeletebutton(true);
                            //   console.log("Deleting file with ID:", file._id); // Debugging log
                              setSelectedFileId(file._id); // Set the file ID to the state
                            setDeletebutton(true);
                          }}
                        >
                          <Trash2 className='h-4' />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="grid grid-cols-2 gap-y-3 gap-x-2   mt-4">
          {audioFiles.map((file, index) => (
            <div
              key={index}
              className="border p-2 sm:p-4  rounded-md shadow-md flex flex-col justify-between bg-gray-50"
            >
              <h3 className="font-bold ">{file.voice_name}</h3> {/* Updated property */}
              <p className="font-bold  text-sm text-gray-600 mt-1">Time: {file.duration} {file.duration !== 1 ? 'sec' : 'sec'}</p>
              <p className="font-bold text-sm text-gray-600  mt-1">
                Uploaded: {file.date_of_upload && !isNaN(new Date(file.date_of_upload))
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

              <button
                onClick={() => handlePlay(file)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Play
              </button>
            </div>
          ))}
        </div>
      )}

{currentAudio && (
  <div className="absolute top-1/2 md:top-2/3 right-1/2 md:right-[25%] transform translate-x-1/2 -translate-y-1/2 bg-white p-6 shadow-lg rounded-lg w-80">
    <h2 className="text-lg font-bold mb-4 text-black">{currentAudio.name}</h2>

    <div className="audio-container items-center justify-center bg-gray-100 rounded-2xl">
      <audio
        id="audio-player"
        src={currentAudio.url}
        controls
        className="w-full rounded"
        controlsList="nodownload" // Disable download option
      >
        Your browser does not support the audio element.
      </audio>
    </div>

    <button
      onClick={() => setCurrentAudio(null)}
      className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md w-full"
    >
      Close
    </button>
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
                Are you sure to delete this Recording?
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
      {share && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="mt-4 bg-white p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">
                Share <span className="text-blue-600">Recording</span>
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
    </div>
  );

};
export default Voicememo;