import './App.css';
import React from 'react';
import { useInfiniteScroll, useImageLazyLoad } from './utils';
import { masonryColumns, previewHeight } from './masonry.js';
import { Blurhash } from "react-blurhash";

// move to env variable
const accessKey = "hHYInPsQTpB1kZfbJhhnoq0y1CyB8h6TzStfcD_rf44";
const endpoint = "https://api.unsplash.com/photos";

const IMAGE_WIDTH = 416;
const HEIGHT_PER_COLUMN = 2600;
const ROW_GAP = 10;

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

  const gridRef = React.useRef(null);
  const [photosArray, setPhotoArray] = React.useState([]);
  const [page, setPage] = React.useState(1);

  const [columnHeight, setColumnHeight] = React.useState(HEIGHT_PER_COLUMN);
  const [numberOfColumns, setNumberOfColumns] = React.useState(3);

  const [columns, setColumns] = React.useState([]);

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

  React.useEffect(() => {
    if (photosArray.length !== 0)
      setColumns(masonryColumns({ photosArray, numberOfColumns, columnHeight, IMAGE_WIDTH, ROW_GAP }));
    if (gridRef.current)
      setColumnHeight(parseInt(window.getComputedStyle(gridRef.current).getPropertyValue('height')));
  }, [photosArray, columnHeight, numberOfColumns]);

  const updatePage = () => {
    if (!fetching.current) {
      fetching.current = true;
      setColumnHeight(prevState => prevState + HEIGHT_PER_COLUMN);
      setPage(prevPage => {
        return prevPage + 1;
      });
    }
  }


  function Image({ obj }) {
    const [isVisible, imageRef] = useImageLazyLoad();
    console.log(obj.id, isVisible)

    return (
      <div className="image" ref={imageRef}>
        {isVisible ?
          <img src={obj.urls.regular}
            blurhash={obj.blur_hash}
            className="unsplashImage"
            style={{ maxWidth: IMAGE_WIDTH }}
            alt={obj["alt_description"]}
          />
          :
          <Blurhash
            className="unsplashImage"
            alt={obj["alt_description"]}
            hash={obj.blur_hash}
            width={IMAGE_WIDTH}
            height={previewHeight(obj, IMAGE_WIDTH)}
            resolutionX={32}
            resolutionY={32}
            punch={1}
          />}
      </div>);
  }

  useInfiniteScroll(infiniteLoadRef, updatePage);

  function ContainerGrid({ currentArray }) {
    return (
      <div className="grid">
        {currentArray.map((column, index) => {
          return (<div className="container" key={index}>
            {column.map(object => {
              return (<Image key={object.id}
                obj={object}
              />)
            })}
          </div>);
        })}
      </div>
    );
  }

  return (
    <div>
      <div style={{ minHeight: 1600 }}>
        <ContainerGrid currentArray={columns} ref={gridRef} />
      </div>

      <div style={{ border: '1px solid transparent' }} ref={infiniteLoadRef}></div>
      <footer>End</footer>

    </div>
  );
}

export default App;
