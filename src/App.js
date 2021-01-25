import "./App.css";
import React from "react";
import { useInfiniteScroll } from "./utils";
import { masonryColumns } from "./masonry.js";
import { ContainerGrid } from "./components.js";
import { fetchPhotos } from "./utils/fetchData";
import { useResize } from "./utils/handlers";

const IMAGE_WIDTH = 416;
const HEIGHT_PER_COLUMN = 2600;
const ROW_GAP = 10;
const COLUMN_GAP = 24;
const TWO_COLUMNS_SCREEN_WIDTH = 950;

function App() {
  let fetching = React.useRef(true);

  let screenWidth = useResize(1000);

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

      setPhotoArray((prevPhotos) => {
        const filteredPhotos = nextPhotos.filter((current) => {
          return !prevPhotos.some((checkPhoto) => checkPhoto.id === current.id);
        });
        return [...prevPhotos, ...filteredPhotos];
      });
      fetching.current = false;
    };
    getPhotos();
  }, [page]);

  React.useEffect(() => {
    if (screenWidth > TWO_COLUMNS_SCREEN_WIDTH) {
      setNumberOfColumns(3);
    } else {
      setNumberOfColumns(2);
    }

    if (photosArray.length !== 0) {
      setColumns(
        masonryColumns({
          photosArray,
          numberOfColumns,
          columnHeight,
          IMAGE_WIDTH,
          ROW_GAP,
        })
      );
    }
  }, [photosArray, columnHeight, numberOfColumns, screenWidth]);

  const updatePage = () => {
    if (!fetching.current) {
      fetching.current = true;
      setColumnHeight((prevState) => prevState + HEIGHT_PER_COLUMN);
      setPage((prevPage) => {
        return prevPage + 1;
      });
    }
  };

  useInfiniteScroll(infiniteLoadRef, updatePage);

  return (
    <div>
      <div ref={gridRef} style={{ minHeight: 1600, width: "100%" }}>
        <ContainerGrid
          currentArray={columns}
          maxImageWidth={IMAGE_WIDTH}
          gridGap={COLUMN_GAP}
        />
      </div>

      <div
        style={{ border: "1px solid transparent" }}
        ref={infiniteLoadRef}
      ></div>
      <footer>End</footer>
    </div>
  );
}

export default App;
