// Service1.js
import React, { useState } from 'react';
import axios from 'axios';
import '../App.css'; // Import Tailwind styles

const Service1 = () => {
  const [isDownloadChecked, setDownloadChecked] = useState(false);
  const apiurl = process.env.SERVICE_HUB_API_URL;
  const downloadPlaylist = async () => {
    const playlistId = prompt('Enter Spotify Playlist ID:');
    try {
      await axios.post('https://serv1cehub-api.vercel.app/servicehub/api/v1/services/service1/', {playlistId});
    } catch (error) {
      console.error('Error using service:', error);
    }
  };

  return (
    <div className="bg-black h-screen min-w-full" >
      <div className="container-fluid">
        <p className='p-4 text-white font-press-start cursor-pointer' onClick={() => window.location.href = "/"}>{"<"} Home</p>
        <div className="row">
          <div id="ms-container">
            <label htmlFor="ms-download">
              <div className="ms-content" onClick={() => downloadPlaylist()}>
                <div className="ms-content-inside">
                  <input
                    type="checkbox"
                    id="ms-download"
                    checked={isDownloadChecked}
                    onChange={() => setDownloadChecked(!isDownloadChecked)}
                  />
                  <div className="ms-line-down-container">
                    <div className="ms-line-down"></div>
                  </div>
                  <div className="ms-line-point"></div>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Service1;
