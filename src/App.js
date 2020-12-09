import './App.css';
import React from 'react';
import { useInfiniteScroll } from './utils';

// move to env variable
const accessKey = "hHYInPsQTpB1kZfbJhhnoq0y1CyB8h6TzStfcD_rf44";
const endpoint = "https://api.unsplash.com/photos";

const IMAGE_WIDTH = 416;

const fetchPhotos = async (page) => {
  const fetchedPhotos = await fetch(`${endpoint}?page=${page}&per_page=12`, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
    }
  });
  const result = await fetchedPhotos.json();
  return result;
}


function App() {
  let fetching = React.useRef(true);

  const [photosArray, setPhotoArray] = React.useState([]);
  const [page, setPage] = React.useState(1);

  const infiniteLoadRef = React.useRef(null);

  React.useEffect(() => {
    const getPhotos = async () => {
      const nextPhotos = await fetchPhotos(page);

      setPhotoArray(prevPhotos => {
        const filteredPhotos = nextPhotos.filter(current => {
          return !(prevPhotos.some(checkPhoto => checkPhoto.id === current.id))
        });
        return ([...prevPhotos, ...filteredPhotos]);
      });
      fetching.current = false;
    }
    getPhotos();
  }, [page]);

  const updatePage = () => {
    if (!fetching.current) {
      fetching.current = true;
      setPage(prevPage => {
        return prevPage + 1;
      });
    }
  }

  useInfiniteScroll(infiniteLoadRef, updatePage);

  function ContainerGrid({ currentArray }) {
    return (
      <div className="containerGrid">
        {currentArray.map(obj => {
          return <img key={obj.id}
            src={obj.urls.regular}
            className="unsplashImage"
            style={{ maxWidth: IMAGE_WIDTH }}
            alt={obj["alt_description"]}
          />
        })}
      </div>
    );
  }

  return (
    <div>
      <div>
        <ContainerGrid currentArray={photosArray} />
      </div>

      <div style={{ border: '1px solid transparent' }} ref={infiniteLoadRef}></div>
      <footer>End</footer>

    </div>
  );
}

export default App;
