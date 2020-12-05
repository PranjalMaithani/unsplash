import './App.css';
import React from 'react';

import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: "hHYInPsQTpB1kZfbJhhnoq0y1CyB8h6TzStfcD_rf44",
});

// function App() {

//   const gridRef = React.useRef();
//   const [rowHeight, setRowHeight] = React.useState();
//   const [rowGap, setRowGap] = React.useState();

//   React.useEffect(() => {
//     setRowHeight(parseInt(window.getComputedStyle(gridRef.current).getPropertyValue('grid-auto-rows')));
//     setRowGap(parseInt(window.getComputedStyle(gridRef.current).getPropertyValue('row-gap')));
//   });

//   function RenderSquare() {
//     let w = 250;
//     let h = Math.floor(Math.random() * 4) * 100 + 200;
//     let c = Math.floor(Math.random() * 4) + 1;
//     const rowSpan = Math.ceil((h + rowGap) / (rowHeight + rowGap));

//     return (<div className={`test test${c}`} style={{ width: `${w}px`, height: `${h}px`, gridRowEnd: `span ${rowSpan}` }}>
//     </div>);
//   }

//   function Grid(props) {
//     return (<div className="grid" ref={gridRef}>
//       {props.children}
//     </div>);
//   }

function App() {

  const gridRef = React.useRef();
  const [gridHeight, setGridHeight] = React.useState(2200);
  const [rowGap, setRowGap] = React.useState(10);

  React.useEffect(() => {
    setGridHeight(parseInt(window.getComputedStyle(gridRef.current).getPropertyValue('height')));
  }, []);

  function RenderSquare({ h }) {
    let w = 250;
    let c = Math.floor(Math.random() * 4) + 1;
    // const rowSpan = Math.ceil((h + rowGap) / (rowHeight + rowGap));
    // const finalHeight = Math.ceil((h + rowGap) / (gridHeight + rowGap));
    return (<div className={`test test${c}`} style={{ width: `${w}px`, height: `${h}px` }}>
    </div>);
  }

  function Grid(props) {
    return (<div className="grid" ref={gridRef}>
      {props.children}
    </div>);
  }

  function Container(props) {
    let heightBudget = gridHeight;
    console.log(heightBudget);
    let h = 0;
    let arr = [];
    while (heightBudget > h) {
      h = Math.floor(Math.random() * 500) + 10;
      heightBudget -= (rowGap + h);
      arr.push(RenderSquare({ h }))
    }
    console.log(heightBudget);
    return (
      <div>
        {arr}
      </div>
    );
  }

  return (
    <Grid>
      <Container />
      <Container />
      <Container />
    </Grid>
  );
}

export default App;
