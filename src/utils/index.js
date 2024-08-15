/* eslint-disable camelcase */
const mapDBToModelAlbums = (
  {
    id,
    name,
    year,
    created_at,
    updated_at,
  },
) => (
  {
    id,
    name,
    year,
    createdAt: created_at,
    updatedAt: updated_at,
  });

const mapDBToModelSongs = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
  created_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
  createdAt: created_at,
  updatedAt: updated_at,
});

module.exports = { mapDBToModelAlbums, mapDBToModelSongs };
