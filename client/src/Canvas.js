import { useEffect, useRef, useState } from "react";
import dnd from "./static/dnd.png";
import token from "./static/token.jpg";
import useWebSocket from "react-use-websocket";

const baseSettings = {
    hexRadius: 30,
    hexWidth: Math.sqrt(3) * 30,
    hexHeight: 2 * 30,
};

function setupGameBoard(rows, cols, sendData, settings) {
    const { hexRadius, hexWidth, hexHeight } = settings;
    const yOffset = hexRadius * 1.7;

    let gameboard = [];
    for (let row = 0; row < rows; row++) {
        gameboard.push([]);
        for (let col = 0; col < cols; col++) {
            // const x = 2 * col * (hexWidth * 0.9) + (row % 2) * hexWidth;
            // // const y = row * yOffset + yOffset / 2;
            // const y = 2 * row * yOffset + ((row % 2) * yOffset) / 2;
            const x = col * (hexWidth * 0.9);
            const y = row * yOffset + ((col % 2) * yOffset) / 2;

            gameboard[row].push({ x: x, y: y, player: null });
        }
    }
    gameboard[2][2]["player"] = token;

    return gameboard;
}

// const baseSettings = {
//     hexRadius: 30,
//     hexWidth: Math.sqrt(3) * hexRadius,
//     hexHeight: 2 * hexRadius,
// };
function distanceFormula(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function getGridCoordinates(x, y, canvas, gridState) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = x;
    const mouseY = y;
    // const { hexRadius, hexWidth, hexHeight } = baseSettings;

    let closestNode = { x: 0, y: 0 };

    gridState.forEach((row, rowInd) => {
        row.forEach((col, colInd) => {
            let currDistance = distanceFormula(
                mouseX,
                mouseY,
                col["x"],
                col["y"]
            );

            if (
                closestNode["distance"] &&
                currDistance < closestNode["distance"]
            ) {
                closestNode = {
                    row: rowInd,
                    col: colInd,
                    distance: currDistance,
                };
            } else if (!closestNode["distance"]) {
                closestNode = {
                    row: rowInd,
                    col: colInd,
                    distance: currDistance,
                };
            }
        });
    });
    return { col: closestNode["col"], row: closestNode["row"] };
}

function drawHexagon(x, y, canvas, image = null, options = null) {
    const { hexRadius, hexWidth, hexHeight } = baseSettings;
    const yOffset = hexRadius * 1.7;
    let ctx = canvas.getContext("2d");
    let rect = canvas.getBoundingClientRect();
    const canvasX = x;
    const canvasY = y;
    // console.log(rect);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(canvasX + hexRadius, canvasY); //
    for (let i = 1; i <= 6; i++) {
        const angle = (i * 2 * Math.PI) / 6;
        const newX = canvasX + hexRadius * Math.cos(angle);
        const newY = canvasY + hexRadius * Math.sin(angle);
        ctx.lineTo(newX, newY);
    }
    ctx.closePath();
    ctx.stroke();
    if (image) {
        ctx.clip();
        ctx.drawImage(
            image,
            canvasX - hexRadius,
            canvasY - hexRadius,
            hexRadius * 2,
            hexRadius * 2
        );
        ctx.restore();
    }
    if (options) {
        if (options["action"] == "checkLocation") {
            let optionX = options.values.x;
            let optionY = options.values.y;

            if (ctx.isPointInPath(options.values.x, options.values.y)) {
                return true;
            } else {
                return false;
            }
        }
    }
}

// draws from left to right
function drawHexagonalGrid(
    canvas,
    gridState,
    settings = baseSettings,
    options = null
) {
    const { hexRadius, hexWidth, hexHeight } = settings;
    const yOffset = hexRadius * 1.7;

    gridState.forEach((row, rowInd) => {
        row.forEach((col, colInd) => {
            drawHexagon(col.x, col.y, canvas);
        });
    });
}

function setupImage() {
    const playerImage = new Image();
    playerImage.src = token;
    // image.src = link;
    return playerImage;
}

function handleEvent(data, dataSetter) {
    // console.log(data.data);
    let parsedData = JSON.parse(data.data);
    if (parsedData.type == "update") {
        console.log(JSON.parse(parsedData.data));
        dataSetter(JSON.parse(parsedData.data));
    }
    console.log(parsedData);
    console.log(parsedData.type);
}
const WS_URL = "ws://localhost:8000";

const Canvas = ({ settings = baseSettings }) => {
    const canvasRef = useRef(null);
    const canvasRef2 = useRef(null);
    const [clientMouseDown, setClientMouseDown] = useState(null);
    const [hexGridState, setHexGridState] = useState(
        setupGameBoard(30, 30, null, settings)
    );
    const [actionGridLocation, setActionGridLocation] = useState(null);
    const [mouseDownLocation, setMouseDownLocation] = useState(null);
    const [mouseUpLocation, setMouseUpLocation] = useState(null);
    const [image, setImage] = useState(setupImage());

    const {
        lastJsonMessage,
        lastMessage,
        sendJsonMessage,
        sendMessage,
        readyState,
    } = useWebSocket(WS_URL, {
        onOpen: () => {
            console.log("WebSocket connection established.");
        },
        share: true,
        filter: () => false,
        retryOnError: true,
        shouldReconnect: () => true,
        onMessage: (data) => {
            console.log(JSON.parse(data.data.toString()));
            // if (typeof data.data == "array") {
            console.log(typeof data.data);
            console.log(typeof JSON.parse(data.data));
            console.log(JSON.parse(data.data));
            // console.log(JSON.parse(JSON.parse(data.data)));
            handleEvent(data, setHexGridState);
            // if (JSON.parse(data.data).type == "update") {
            //     setHexGridState(JSON.parse(JSON.parse(data.data).type));
            // }

            // console.log(hexGridState);
            // setHexGridState(JSON.parse(JSON.parse(data.data)));
            // console.log(hexGridState);
            // }
            // console.log(data);
            // // JSON.parse(data.data.toString());
            // console.log(JSON.parse(data.data.toString()));
        },
    });

    function sendData(data) {
        sendJsonMessage(JSON.stringify(data));
    }

    function updateHexGridState(colIndex, rowIndex, newValue) {
        const newArr = hexGridState.map((row) => [...row]);
        newArr[rowIndex][colIndex]["player"] = newValue;
        setHexGridState(newArr);
    }
    useEffect(() => {
        const canvas2 = canvasRef2.current;
        const ctx2 = canvas2.getContext("2d");
        const { hexRadius, hexWidth, hexHeight } = baseSettings;

        let fromCoordinates = null;
        let toCoordinates = null;
        let isPlayerAtStart = false;
        if (mouseDownLocation && mouseUpLocation) {
            fromCoordinates = getGridCoordinates(
                mouseDownLocation.x,
                mouseDownLocation.y,
                canvas2,
                hexGridState
            );
            isPlayerAtStart = hexGridState[fromCoordinates.row][
                fromCoordinates.col
            ]["player"]
                ? true
                : false;
            if (isPlayerAtStart) {
                // let clientX = mouseDownLocation["x"];
                // let clientY = mouseUpLocation["y"];

                toCoordinates = getGridCoordinates(
                    mouseDownLocation.x,
                    mouseDownLocation.y,
                    canvas2,
                    hexGridState
                );
            }
        }

        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        let drawArray = [];
        // console.log(hexGridState);
        hexGridState.forEach((row, rowInd) => {
            row.forEach((col, colInd) => {
                if (col && col["player"]) {
                    const yOffset = hexRadius * 1.7;

                    const x = col.x;
                    const y = col.y;
                    if (clientMouseDown) {
                        let clientX = clientMouseDown["x"];
                        let clientY = clientMouseDown["y"];

                        drawHexagon(clientX, clientY, canvas2, image);
                        drawHexagon(x, y, canvas2, image);
                    } else {
                        drawHexagon(x, y, canvas2, image);
                    }
                    // };
                }
            });
        });
        if (mouseUpLocation) {
            let clientX = mouseUpLocation["x"];
            let clientY = mouseUpLocation["y"];
            toCoordinates = getGridCoordinates(
                clientX,
                clientY,
                canvas2,
                hexGridState
            );
        }
        if (fromCoordinates && toCoordinates) {
            if (isPlayerAtStart) {
                let temp = hexGridState[2][2]["player"];
                updateHexGridState(
                    fromCoordinates.col,
                    fromCoordinates.row,
                    null
                );
                updateHexGridState(toCoordinates.col, toCoordinates.row, image);
                sendData(hexGridState);
            }
            setMouseDownLocation(null);
            setMouseUpLocation(null);
        }
    }, [clientMouseDown, mouseUpLocation, mouseDownLocation, hexGridState]);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const { hexRadius, hexWidth, hexHeight } = baseSettings;

        const backgroundImage = new Image();
        backgroundImage.src = dnd; // Replace with the path to your image
        backgroundImage.onload = function () {
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
            console.log(hexGridState);
            drawHexagonalGrid(canvas, hexGridState);
        };
    }, [mouseDownLocation, mouseUpLocation, hexGridState]);

    const handleMouseDown = (e) => {
        setClientMouseDown({ x: e.pageX, y: e.pageY });
        setMouseDownLocation({ x: e.pageX, y: e.pageY });
        let ctx = canvasRef.current.getContext("2d");
        console.log(e.pageX);
        console.log(e);
        if (clientMouseDown) {
            let clientX = clientMouseDown["x"];
            let clientY = clientMouseDown["y"];

            setClientMouseDown({ x: clientX, y: clientY });
            // setMouseDownLocation({ x: clientX, y: clientY });
        }
    };

    const handleMouseUp = (e) => {
        setMouseUpLocation({ x: e.pageX, y: e.pageY });
        setClientMouseDown(null);
    };

    const handleMouseMove = (e) => {
        if (clientMouseDown) {
            setClientMouseDown({ x: e.pageX, y: e.pageY });
        }
    };

    return (
        <div>
            <canvas
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                ref={canvasRef2}
                style={{ position: "absolute" }}
                width="1900"
                height="1300"
            />
            <canvas
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                ref={canvasRef}
                width="1900"
                height="1300"
            />
        </div>
    );
};

export default Canvas;
