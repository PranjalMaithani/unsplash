const accessKey = process.env.REACT_APP_ACCESS_KEY;
const endpoint = "https://api.unsplash.com/photos";
const endpointSearch = "https://api.unsplash.com/search/photos";

export const fetchPhotos = async (page) => {
  try {
    const fetchedPhotos = await fetch(
      `${endpoint}?page=${page}&per_page=13&tags`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
      }
    );
    const result = await fetchedPhotos.json();
    return result;
  } catch (err) {
    alert("Failed to fetch photos");
  }
};

export const fetchPhotosSearch = async (page, query, orderByLatest) => {
  const order = orderByLatest ? "relevant" : "relevant";
  try {
    const queryFiltered = textToQuery(query);
    const fetchedPhotos = await fetch(
      `${endpointSearch}?page=${page}&per_page=13&query=${queryFiltered}&order_by=${order}`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
      }
    );
    const searchObject = await fetchedPhotos.json();
    return searchObject.results;
  } catch (err) {
    alert("Failed to fetch photos");
  }
};

export const fetchPhotoTags = async (image) => {
  try {
    const fetchedPhoto = await fetch(`${endpoint}/${image.id}`, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
    });
    const result = await fetchedPhoto.json();
    return result.tags;
  } catch (err) {
    alert("Failed to fetch photos");
  }
};

function textToQuery(string) {
  let regex = /\W/;
  return string.replace(regex, "+");
}
