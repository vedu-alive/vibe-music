import {Album} from '../models/album.model.js'
export const getAllAlbums = async (_req, res, next) => {
  try {
    const albums = await Album.find();
    res.status(200).json(albums);
  } catch (error) {
    next(error)
  }
}

export const getAlbumById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const album = await Album.findById(id).populate('songs');
        if (!album) {
            const error = new Error(`Album with id ${id} not found`);
            error.status = 404;
            throw error;
        }
        res.status(200).json(album);
    }
    catch (error) {
        next(error)
    }
}