import './App.css';
import React from 'react';
import { useInfiniteScroll } from './utils';

// move to env variable
const accessKey = "hHYInPsQTpB1kZfbJhhnoq0y1CyB8h6TzStfcD_rf44";
const endpoint = "https://api.unsplash.com/photos";

const IMAGE_WIDTH = 416;
const ROW_GAP = 10;
const HEIGHT_INCREMENT = 2600;

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

    const gridRef = React.useRef();
    const [gridHeight, setGridHeight] = React.useState(HEIGHT_INCREMENT);

    const [photosArray, setPhotoArray] = React.useState([]);
    const [page, setPage] = React.useState(0);

    const [columnLeft, setColumnLeft] = React.useState([]);
    const [columnMid, setColumnMid] = React.useState([]);
    const [columnRight, setColumnRight] = React.useState([]);

    const [numberOfColumns, setNumberOfColumns] = React.useState(3);

    const infiniteLoadRef = React.useRef(null);

    React.useEffect(() => {
        const getPhotos = async () => {
            fetching.current = true;
            const nextPhotos = await fetchPhotos(page);
            setPhotoArray(prevPhotos => [...prevPhotos, ...nextPhotos]);
            fetching.current = false;
        }
        getPhotos();
    }, [page]);

    React.useEffect(() => {
        if (numberOfColumns === 3) {
            assignColumns(
                [
                    setColumnLeft,
                    setColumnMid,
                    setColumnRight,
                ], photosArray, IMAGE_WIDTH, gridHeight, ROW_GAP);
        }
        else if (numberOfColumns === 2) {
            assignColumns(
                [setColumnLeft, setColumnMid],
                photosArray, IMAGE_WIDTH, (gridHeight * 1.5), ROW_GAP
            );
            setColumnRight([]);
        }
    }, [photosArray]);


    const updatePage = () => {
        console.log('update page')
        fetching.current = true;
        setGridHeight(gridHeight + HEIGHT_INCREMENT);
        setPage(prevPage => prevPage + 1);
    }

    useInfiniteScroll(infiniteLoadRef, updatePage);

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

        let allColumns = Array.from(Array(setterFunctions.length), () => []);

        let current = 0;
        let currentImage = dataArray[current];
        let numberOfColumns = allColumns.length;
        let remainingHeightBudget = Array(numberOfColumns).fill(heightBudget);
        /* eslint-disable */
        while (dataArray[current] && remainingHeightBudget.some(num => num > previewHeight(currentImage, imageWidth))) {
            allColumns.forEach((column, index) => {
                if (currentImage) {
                    let h = previewHeight(currentImage, imageWidth);
                    if (remainingHeightBudget[index] > h) {
                        column.push(currentImage);
                        remainingHeightBudget[index] -= (h + gap);
                        current++;
                        currentImage = dataArray[current];
                    }
                }

            });
        }
        /* eslint-enable */
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
                        style={{ maxWidth: IMAGE_WIDTH, maxHeight: previewHeight(obj, IMAGE_WIDTH) }}
                        alt={obj["alt_description"]}
                    />
                })}
            </div>
        );
    }

    return (
        <div>
            <div>
                <Grid>

                    <Container currentArray={columnLeft} />
                    <Container currentArray={columnMid} />
                    <Container currentArray={columnRight} />

                </Grid>
            </div>
            <div style={{ border: '1px solid transparent' }} ref={infiniteLoadRef}></div>
            <footer>End</footer>

        </div>
    );
}

export default App;
