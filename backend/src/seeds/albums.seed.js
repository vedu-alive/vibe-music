import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { config } from "dotenv";

config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    //* Clear existing data
    await Album.deleteMany({});
    await Song.deleteMany({});

    //* First, create all songs
    const createdSongs = await Song.insertMany([
      {
        title: "Hamare Sath Sri Raghunath",
        artist: "Prem bhushan ji maharaj",
        imageUrl: "/cover-images/1.jpg",
        audioUrl: "/songs/Hamare-sath-shree-raghunath.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 272, // 0:39
      },
      {
        title: "Shri Ram Janki Baithe Hai",
        artist: "Lakhbir Singh Lakkha",
        imageUrl: "/cover-images/2.jpg",
        audioUrl: "/songs/Shri-Ram-Janki.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 512, // 0:36
      },
      {
        title: "Namo Namo",
        artist: "Amit Trivedi",
        imageUrl: "/cover-images/3.jpg",
        audioUrl: "/songs/Namo-Namo.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 322, // 0:36
      },
      {
        title: "Mat kar maya ko ahankar",
        artist: "Kabir Café",
        imageUrl: "/cover-images/4.jpg",
        audioUrl: "/songs/Matkar-Maya-Ko-Ahankar.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 365, // 0:39
      },
      {
        title: "Vaishnav Jan",
        artist: "Lata Mangeshkar",
        imageUrl: "/cover-images/4.jpg",
        audioUrl: "/songs/viashnav-jan.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 254, // 0:24
      },
      {
        title: "Ocean Waves",
        artist: "Coastal Drift",
        imageUrl: "/cover-images/9.jpg",
        audioUrl: "/songs/9.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 28, // 0:28
      },
      {
        title: "Crystal Rain",
        artist: "Echo Valley",
        imageUrl: "/cover-images/16.jpg",
        audioUrl: "/songs/16.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 39, // 0:39
      },
      {
        title: "Starlight",
        artist: "Luna Bay",
        imageUrl: "/cover-images/10.jpg",
        audioUrl: "/songs/10.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 30, // 0:30
      },
      {
        title: "Stay With Me",
        artist: "Sarah Mitchell",
        imageUrl: "/cover-images/7.jpg",
        audioUrl: "/songs/1.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 46, // 0:46
      },
      {
        title: "Midnight Drive",
        artist: "The Wanderers",
        imageUrl: "/cover-images/2.jpg",
        audioUrl: "/songs/2.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 41, // 0:41
      },
      {
        title: "Moonlight Dance",
        artist: "Silver Shadows",
        imageUrl: "/cover-images/14.jpg",
        audioUrl: "/songs/14.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 27, // 0:27
      },
      {
        title: "Lost in Tokyo",
        artist: "Electric Dreams",
        imageUrl: "/cover-images/15.jpg",
        audioUrl: "/songs/3.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 24, // 0:24
      },
      {
        title: "Neon Tokyo",
        artist: "Future Pulse",
        imageUrl: "/cover-images/17.jpg",
        audioUrl: "/songs/17.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 39, // 0:39
      },
      {
        title: "Purple Sunset",
        artist: "Dream Valley",
        imageUrl: "/cover-images/12.jpg",
        audioUrl: "/songs/12.mp3",
        plays: Math.floor(Math.random() * 5000),
        duration: 17, // 0:17
      },
    ]);

    //* Create albums with references to song IDs
    const albums = [
      {
        title: "Devotional Songs",
        artist: "Various Artists",
        imageUrl: "/albums/1.jpg",
        releaseYear: 2016,
        songs: createdSongs.slice(0, 5).map((song) => song._id),
      },
      {
        title: "Coastal Dreaming",
        artist: "Various Artists",
        imageUrl: "/albums/2.jpg",
        releaseYear: 2024,
        songs: createdSongs.slice(5, 8).map((song) => song._id),
      },
      {
        title: "Midnight Sessions",
        artist: "Various Artists",
        imageUrl: "/albums/3.jpg",
        releaseYear: 2024,
        songs: createdSongs.slice(8, 11).map((song) => song._id),
      },
      {
        title: "Eastern Dreams",
        artist: "Various Artists",
        imageUrl: "/albums/4.jpg",
        releaseYear: 2024,
        songs: createdSongs.slice(11, 14).map((song) => song._id),
      },
    ];

    //* Insert all albums
    const createdAlbums = await Album.insertMany(albums);

    //* Update songs with their album references
    for (let i = 0; i < createdAlbums.length; i++) {
      const album = createdAlbums[i];
      const albumSongs = albums[i].songs;

      await Song.updateMany(
        { _id: { $in: albumSongs } },
        { albumId: album._id }
      );
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();