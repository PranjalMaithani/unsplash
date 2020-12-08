import './App.css';
import React from 'react';

const accessKey = "hHYInPsQTpB1kZfbJhhnoq0y1CyB8h6TzStfcD_rf44";
const endpoint = "https://api.unsplash.com/photos";


function App() {
  const gridRef = React.useRef();
  const [gridHeight, setGridHeight] = React.useState(5600);
  const [rowGap, setRowGap] = React.useState(10);

  const [photosArray, setPhotoArray] = React.useState([]);

  const [columnLeft, setColumnLeft] = React.useState([]);
  const [columnMid, setColumnMid] = React.useState([]);
  const [columnRight, setColumnRight] = React.useState([]);

  const [columnLeftRelated, setColumnLeftRelated] = React.useState([]);
  const [columnMidRelated, setColumnMidRelated] = React.useState([]);
  const [columnRightRelated, setColumnRightRelated] = React.useState([]);


  React.useEffect(() => {
    fetchPhotos();
  }, []);

  React.useEffect(() => {
    assignColumns(
      [
        (v) => setColumnLeft(v),
        (v) => setColumnMid(v),
        (v) => setColumnRight(v),
      ], photosArray, 416, gridHeight, rowGap);

  }, [photosArray]);

  async function fetchPhotos() {
    const fetchedPhotos = await fetch(`${endpoint}?page=1&per_page=30`, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      }
    });
    const result = await fetchedPhotos.json();
    setPhotoArray(result);
  }

  function RenderImage({ url, height }) {
    let w = 416;
    return (<div>
      <img className="unsplashImage" style={{ width: `${w}px`, height: `${height}px` }} src={url} />
    </div>);
  }

  function Grid(props) {
    return (<div className="grid" ref={gridRef}>
      {props.children}
    </div>);
  }

  function previewHeight(image, imageWidth) {
    return (image.height / image.width) * imageWidth;
  }

  function assignColumns(setterFunctions, dataArray, imageWidth, heightBudget, gap) {
    if (!dataArray.length)
      return;

    let allColumns = [[], [], []];

    let current = 0;
    let currentImage = dataArray[current];
    let numberOfColumns = allColumns.length;
    let remainingHeightBudget = Array(numberOfColumns).fill(heightBudget);
    while (dataArray[current] && remainingHeightBudget.some(num => num > previewHeight(currentImage, imageWidth))) {
      allColumns.forEach((column, index) => {

        if (currentImage) {
          const h = previewHeight(currentImage, imageWidth);
          if (remainingHeightBudget[index] > h) {
            column.push(currentImage);
            remainingHeightBudget[index] -= (h + gap);
            current++;
            currentImage = dataArray[current];
          }
        }

      });
    }
    setterFunctions.forEach((setter, index) => setter(allColumns[index]));
    setGridHeight(parseInt(window.getComputedStyle(gridRef.current).getPropertyValue('height')));
  }

  function Container({ currentArray }) {

    return (
      <div className="container">
        {currentArray.map(obj => {
          return <img key={obj.id}
            src={obj.urls.regular}
            className="unsplashImage"
            style={{ "max-width": `416px`, height: `${previewHeight(obj, 416)}` }}
            alt={obj["alt_description"]}
          />
        })}
      </div>
    );
  }

  return (
    <Grid>

      <Container currentArray={columnLeft} />
      <Container currentArray={columnMid} />
      <Container currentArray={columnRight} />
    </Grid>
  );
}

export default App;
