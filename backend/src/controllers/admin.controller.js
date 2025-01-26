import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";
import fs from "fs/promises";
import { clerkClient } from "@clerk/express";

//* upload file to cloudinary
const uploadToCloudinary = async (file) => {
  try {
    const data = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
      timeout: 6000000,
    });
    await fs.unlink(file.tempFilePath);
    return data.secure_url;
  } catch (error) {
    console.error("erorr in upoading file", error);
    throw new Error("Error uploading file");
  }
};

const deleteSongFromCloudinary = async (audioUrl, imageUrl) => {
  try {
    const audioId = audioUrl.split("/").pop().split(".")[0];
    const imageId = imageUrl.split("/").pop().split(".")[0];
    console.log(audioId, imageId, "ids");
    await cloudinary.uploader.destroy(audioId);
    await cloudinary.uploader.destroy(imageId);
  } catch (error) {
    console.error("error in deleting file", error);
    throw new Error("Error deleting file");
  }
};

export const createSong = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({ message: "Please upload files" });
    }
    const { title, artist, albumId, duration } = req.body;
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const song = new Song({
      title,
      artist,
      audioUrl,
      imageUrl,
      duration,
      albumId: albumId ?? null,
    });
    await song.save();
    //* if songs belongs to an album add it to the album
    if (albumId) {
      const album = await Album.findById(albumId);
      if (album) {
        album.songs.push(song._id);
        await album.save();
      }
    }
    res.status(201).json({ message: "Song created successfully", song });
  } catch (error) {
    next(error);
  }
};

export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const song = await Song.findById(id);
    if (song.albumId) {
      deleteSongFromCloudinary(song.audioUrl, song.imageUrl);
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
      await Song.findByIdAndDelete(id);
      res.status(200).json({ message: "Song deleted successfully" });
    }
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const createAlbum = async (req, res, next) => {
  try {
    const { title, artist, releaseYear } = req.body;
    const { imageFile } = req.files;
    const imageUrl = await uploadToCloudinary(imageFile);
    const album = new Album({ title, artist, imageUrl, releaseYear });
    await album.save();

    res.status(201).json({ message: "Album created successfully", album });
  } catch (error) {
    next(error);
  }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Song.deleteMany({ albumId: id });
    await Album.findByIdAndDelete(id);
    res.status(200).json({ message: "Album deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const checkAdmin = async (req, res, next) => {
  const currentUser = await clerkClient.users.getUser(req.auth.userId);
  const isAdmin = (process.env.ADMIN_EMAIL ==
    currentUser.primaryEmailAddress.emailAddress);
  res.status(200).json({ admin: isAdmin });
};