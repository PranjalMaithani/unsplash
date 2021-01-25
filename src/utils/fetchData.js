const accessKey = process.env.REACT_APP_ACCESS_KEY;
const endpoint = "https://api.unsplash.com/photos";

export const fetchPhotos = async (page) => {
  const fetchedPhotos = await fetch(`${endpoint}?page=${page}&per_page=13`, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
    },
  });
  const result = await fetchedPhotos.json();
  return result;
};
