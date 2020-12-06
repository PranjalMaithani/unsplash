import './App.css';
import React from 'react';

import { createApi } from 'unsplash-js';
const accessKey = "hHYInPsQTpB1kZfbJhhnoq0y1CyB8h6TzStfcD_rf44";
const endpoint = "https://api.unsplash.com/photos";


function App() {
  const gridRef = React.useRef();
  const [gridHeight, setGridHeight] = React.useState(5000);
  const [rowGap, setRowGap] = React.useState(10);
  const [photosArray, setPhotoArray] = React.useState([]);
  const [columnLeft, setColumnLeft] = React.useState([]);
  const [columnMid, setColumnMid] = React.useState([]);
  const [columnRight, setColumnRight] = React.useState([]);

  React.useEffect(() => {
    //setGridHeight(parseInt(window.getComputedStyle(gridRef.current).getPropertyValue('height')));
    fetchPhotos();
  }, []);

  React.useEffect(() => {
    assignColumn();
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

  // function RenderSquare({ h }) {
  //   let w = 416;
  //   let c = Math.floor(Math.random() * 4) + 1;
  //   return (<div className={`test test${c}`} style={{ width: `${w}px`, height: `${h}px` }}>
  //   </div>);
  // }

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

  // function Container(props) {
  //   let heightBudget = gridHeight;
  //   console.log(heightBudget);
  //   let h = 0;
  //   let arr = [];
  //   while (heightBudget > h) {
  //     h = Math.floor(Math.random() * 500) + 10;
  //     heightBudget -= (rowGap + h);
  //     arr.push(RenderSquare({ h }))
  //   }
  //   console.log(heightBudget);
  //   return (
  //     <div>
  //       {arr}
  //     </div>
  //   );
  // }

  function assignColumnImages(current, assignerFunction) {

    let heightBudget = gridHeight;
    let h = 0;
    let arr = [];
    while (heightBudget > h && photosArray[current] !== undefined) {
      let imageUrl = photosArray[current].urls.regular;
      h = (photosArray[current].height / photosArray[current].width) * 416;
      heightBudget -= (h + rowGap);
      arr.push(RenderImage({ height: h, url: imageUrl }));
      current++;
      if (photosArray[current])
        h = (photosArray[current].height / photosArray[current].width) * 416;
    }
    assignerFunction(arr);
    return current;
  }

  function assignColumn() {
    let counter = 0;
    if (!photosArray.length)
      return;

    counter = assignColumnImages(counter, (v) => setColumnLeft(v));
    counter = assignColumnImages(counter, (v) => setColumnMid(v));
    counter = assignColumnImages(counter, (v) => setColumnRight(v));

  }

  function Container({ currentArray }) {
    if (!photosArray.length) {
      return null;
    }

    return (
      <div>
        {currentArray}
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
