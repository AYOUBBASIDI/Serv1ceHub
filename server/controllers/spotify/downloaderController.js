const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const axios = require('axios');
const search = require('yt-search');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
require('dotenv').config();
const archiver = require('archiver'); // Make sure to install this dependency using npm install archiver


// Define the output folder (global variable)
let outputFolder;
let uniqueId;

// Function to set the output folder
function setOutputFolder(id) {
  outputFolder = `./storage/${id}`;
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
    console.log(`Created output folder: ${outputFolder}`);
  }
}

function zipFolder(id) {
  return new Promise((resolve, reject) => {
    const archive = archiver('zip');
    const zipFileName = `./storage/${id}.zip`;

    const output = fs.createWriteStream(zipFileName);

    output.on('close', () => {
      console.log(`Playlist zipped successfully: ${zipFileName}`);
      resolve(zipFileName);
    });
    
    output.on('error', (err) => {
      console.error('Error closing output stream:', err);
      reject(err);
    });

    archive.directory(outputFolder, false);
    archive.pipe(output);
    archive.finalize();

  });
}

function removeFolder() {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(outputFolder)) {
      fs.rmdir(outputFolder, { recursive: true }, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log(`Removed output folder: ${outputFolder}`);
          resolve();
        }
      });
    } else {
      resolve(); // Folder doesn't exist, nothing to remove
    }
  });
}

// Function to download and convert to MP3
async function downloadAndConvertToMP3(videoId, fileName) {
  return new Promise((resolve, reject) => {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    console.log(`Downloading audio from videoId: ${videoId}`);

    const stream = ytdl(videoUrl, { filter: 'audioonly' });

    const filePath = path.join(outputFolder, `${fileName}.mp3`);

    ffmpeg.setFfmpegPath(ffmpegPath);

    const ffmpegProcess = ffmpeg()
      .input(stream)
      .audioCodec('libmp3lame')
      .toFormat('mp3')
      .on('end', () => {
        // Check if the file exists and has a non-zero size
        const stats = fs.statSync(filePath);
        if (stats.isFile() && stats.size > 0) {
          console.log(`Downloaded and converted ${fileName}.mp3`);
          resolve(filePath);
        } else {
          console.error(`Error: ${fileName}.mp3 is empty or does not exist`);
          reject(new Error(`File ${fileName}.mp3 is empty or does not exist`));
        }
      })
      .on('error', (err) => {
        console.error(`Error downloading and converting: ${err.message}`);
        reject(err);
      })
      .save(filePath);
  });
}

// Function to get Spotify access token
async function getAccessToken() {
  try {
    // Get access token using cURL
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const curlCommand = `curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d "client_id=${clientId}" -d "client_secret=${clientSecret}" -d "grant_type=client_credentials" https://accounts.spotify.com/api/token`;

    const { stdout, stderr } = await new Promise((resolve) => {
      exec(curlCommand, (error, stdout, stderr) => {
        resolve({ stdout, stderr });
      });
    });

    const accessToken = JSON.parse(stdout).access_token;
    return accessToken;
  } catch (error) {
    console.error('Error getting access token:', error.message);
    throw error;
  }
}

// Function to create playlist folder


async function getPlaylistInfo(accessToken, playlistId, res) {
  try {

    // Get playlist details
    const playlistResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const playlist = playlistResponse.data;

    console.log('Playlist Information:');
    console.log(`Name: ${playlist.name}`);
    console.log(`Description: ${playlist.description}`);
    console.log('Tracks:');

    // Iterate through the tracks
    for (const [index, item] of playlist.tracks.items.entries()) {
      const track = item.track;
      console.log(`${index + 1}. ${track.name} - ${track.artists.map(artist => artist.name).join(', ')}`);

      // Search for the track on YouTube
      const searchQuery = `${track.name} - ${track.artists[0].name}`;
      const searchResults = await search(searchQuery);
      const videoId = searchResults.all[0].videoId;
      await downloadAndConvertToMP3(videoId, `${track.name} - ${track.artists[0].name}`);
    }

    await zipFolder(uniqueId); // Zip the folder
    const zipFilePath = `./storage/${uniqueId}.zip`;
    // Provide the zip file path to the client for download
    res.json({ success: true, message: 'Playlist downloaded successfully' });

    // Schedule folder removal after a delay (adjust as needed)
    setTimeout(async () => {
      await removeFolder();
      console.log(`Removed zip folder: ${zipFilePath}`);
    }, 5000); // 5000 milliseconds (5 seconds) delay
  } catch (error) {
    console.error('Error:', error.message);
    res.json({ success: false, error: error.message });
  }
}

const start = async (req, res) => {
    try {
        const accessToken = await getAccessToken();
        const playlistId = req.body.playlistId;
        const uniqueId = Date.now().toString();
        setOutputFolder(uniqueId);
    
        const playlistInfo = await getPlaylistInfo(accessToken, playlistId, res);
        res.json(playlistInfo);
      } catch (error) {
        res.json({ success: false, error: error.message });
      }
}

module.exports = {
    start,
};