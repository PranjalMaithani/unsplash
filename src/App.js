import "./App.css";
import React from "react";
import { useInfiniteScroll } from "./utils";
import { masonryColumns } from "./utils/masonry.js";
import { ContainerGrid } from "./components/Grid.js";
import ErrorMessage from "./components/ErrorMessage";
import { fetchPhotos, fetchPhotosSearch } from "./utils/fetchData";
import { removeDulpicateImages } from "./utils/lib";
import { useResize } from "./utils/handlers";
import { Header } from "./components/Header";
import { GlobalStyle } from "./styles/Global";

const IMAGE_WIDTH_3COLUMNS = 416;
const IMAGE_WIDTH_2COLUMNS = 463;
const IMAGE_WIDTH_1COLUMN = 760;

const HEIGHT_PER_COLUMN = 2600;
const ROW_GAP = 10;
const COLUMN_GAP = 24;

const TWO_COLUMNS_SCREEN_WIDTH = 975;
const ONE_COLUMN_SCREEN_WIDTH = 765;

const HEADER_HEIGHT = 62;

function App() {
  let fetching = React.useRef(true);

  let screenWidth = useResize(1000);

  const [photosArray, setPhotoArray] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [searchText, setSearchText] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState(null);

  const [columnHeight, setColumnHeight] = React.useState(HEIGHT_PER_COLUMN);
  const [numberOfColumns, setNumberOfColumns] = React.useState(3);
  const [maxImageWidth, setMaxImageWidth] = React.useState(
    IMAGE_WIDTH_3COLUMNS
  );

  const [columns, setColumns] = React.useState([]);

  const infiniteLoadRef = React.useRef(null);

  React.useEffect(() => {
    const getPhotos = async (searchText) => {
      let nextPhotos;
      if (searchText === "") {
        nextPhotos = await fetchPhotos(page);
      } else {
        nextPhotos = await fetchPhotosSearch(page, searchText);
      }
      if (page === 1) {
        if (nextPhotos.length === 0) {
          setErrorMessage("Couldn't find any photos");
          setPhotoArray([]);
          setColumns([]);
        } else {
          setErrorMessage(null);
        }
        setPhotoArray(nextPhotos);
        window.scrollTo(0, 0);
      } else {
        setPhotoArray((prevPhotos) =>
          removeDulpicateImages(prevPhotos, nextPhotos)
        );
      }

      fetching.current = false;
    };

    getPhotos(searchText);
  }, [page, searchText]);

  React.useEffect(() => {
    if (screenWidth > TWO_COLUMNS_SCREEN_WIDTH) {
      setNumberOfColumns(3);
      setMaxImageWidth(IMAGE_WIDTH_3COLUMNS);
    } else if (screenWidth > ONE_COLUMN_SCREEN_WIDTH) {
      setNumberOfColumns(2);
      setMaxImageWidth(IMAGE_WIDTH_2COLUMNS);
    } else {
      setNumberOfColumns(1);
      setMaxImageWidth(IMAGE_WIDTH_1COLUMN);
    }

    if (photosArray.length !== 0) {
      setColumns(
        masonryColumns({
          photosArray,
          numberOfColumns,
          columnHeight,
          IMAGE_WIDTH: IMAGE_WIDTH_3COLUMNS,
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

  const resetData = () => {
    setColumnHeight(HEIGHT_PER_COLUMN);
    setErrorMessage(null);
    setColumns([]);
    setSearchText("");
    setPage(1);
  };

  useInfiniteScroll(infiniteLoadRef, updatePage);

  return (
    <>
      <Header
        height={HEADER_HEIGHT}
        resetData={resetData}
        searchCallback={(value) => {
          setPage(1);
          setSearchText(value);
        }}
      />
      <div style={{ height: HEADER_HEIGHT * 1.5 }}></div>
      {errorMessage && <ErrorMessage message={errorMessage} />}
      <div style={{ minHeight: errorMessage ? 100 : 1600 }}>
        <ContainerGrid
          currentArray={columns}
          maxImageWidth={maxImageWidth}
          gridGap={COLUMN_GAP}
        />
      </div>

      <div
        style={{ border: "1px solid transparent" }}
        ref={infiniteLoadRef}
      ></div>

      <GlobalStyle />
      <footer>End</footer>
    </>
  );
}

export default App;
