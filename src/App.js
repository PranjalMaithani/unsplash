import "./App.css";
import React from "react";
import { useInfiniteScroll } from "./utils";
import { ContainerGrid } from "./components/Grid.js";
import ErrorMessage from "./components/ErrorMessage";
import { fetchPhotos, fetchPhotosSearch } from "./utils/fetchData";
import { removeDulpicateImages } from "./utils/lib";
import { Header } from "./components/Header";
import { GlobalStyle } from "./styles/Global";

import data from "./utils/data";

const screenWidths = [
  data.ONE_COLUMN_SCREEN_WIDTH,
  data.TWO_COLUMNS_SCREEN_WIDTH,
  data.THREE_COLUMNS_SCREEN_WIDTH,
];

const imageWidths = [
  data.IMAGE_WIDTH_1COLUMN,
  data.IMAGE_WIDTH_2COLUMNS,
  data.IMAGE_WIDTH_3COLUMNS,
];

function App() {
  let fetching = React.useRef(true);

  const [photosArray, setPhotosArray] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [searchText, setSearchText] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState(null);

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
          setPhotosArray([]);
          setPhotosArray([]);
        } else {
          setErrorMessage(null);
        }
        setPhotosArray(nextPhotos);
        window.scrollTo(0, 0);
      } else {
        setPhotosArray((prevPhotos) =>
          removeDulpicateImages(prevPhotos, nextPhotos)
        );
      }

      fetching.current = false;
    };

    getPhotos(searchText);
  }, [page, searchText]);

  const updatePage = React.useCallback(() => {
    if (!fetching.current) {
      fetching.current = true;
      setPage((prevPage) => {
        return prevPage + 1;
      });
    }
  }, []);

  const resetData = React.useCallback(() => {
    setErrorMessage(null);
    setPhotosArray([]);
    setSearchText("");
    setPage(1);
  }, []);

  useInfiniteScroll(infiniteLoadRef, updatePage);

  return (
    <>
      <Header
        height={data.HEADER_HEIGHT}
        resetData={resetData}
        searchCallback={(value) => {
          setPage(1);
          setSearchText(value);
        }}
      />
      <div style={{ height: data.HEADER_HEIGHT * 1.5 }}></div>
      {errorMessage && <ErrorMessage message={errorMessage} />}
      <div style={{ minHeight: errorMessage ? 100 : 1600 }}>
        <ContainerGrid
          photosArray={photosArray}
          screenWidths={screenWidths}
          imageWidths={imageWidths}
          minColumns={1}
          maxColumns={3}
          rowGap={data.ROW_GAP}
          columnGap={data.COLUMN_GAP}
        />
      </div>

      <div style={{ height: 10 }} ref={infiniteLoadRef}></div>

      <GlobalStyle />
    </>
  );
}

export default App;
