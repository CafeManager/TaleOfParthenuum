import { useEffect, useRef, useState } from "react";
import dnd from "./static/dnd.png";
import token from "./static/token.jpg";

const baseSettings = {
    hexRadius: 30,
    hexWidth: Math.sqrt(3) * 30,
    hexHeight: 2 * 30,
};
function setupGameBoard(rows, cols, settings = baseSettings) {
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
    // console.log(gameboard);
    gameboard[2][2]["player"] = token;
    // console.log(gameboard);

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
    console.log(gridState);
    const rect = canvas.getBoundingClientRect();
    const mouseX = x - rect.left;
    const mouseY = y - rect.top;
    const { hexRadius, hexWidth, hexHeight } = baseSettings;

    let closestNode = { x: 0, y: 0 };

    gridState.forEach((row, rowInd) => {
        row.forEach((col, colInd) => {
            // console.log(col);
            let currDistance = distanceFormula(
                mouseX,
                mouseY,
                col["x"],
                col["y"]
            );
            if (rowInd % 10 == 3) {
                if (colInd % 10 == 3) {
                    // closestNode[]
                    // console.log(currDistance);
                }
            }

            if (
                closestNode["distance"] &&
                currDistance < closestNode["distance"]
            ) {
                // console.log("closestUpdate!");
                // console.log(row);
                // console.log(col);

                // console.log(currDistance);
                // closestNode["row"];
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
    console.log(closestNode);
    return { col: closestNode["col"], row: closestNode["row"] };
}

function drawHexagon(x, y, canvas, image = null, options = null) {
    const { hexRadius, hexWidth, hexHeight } = baseSettings;
    const yOffset = hexRadius * 1.7;
    let ctx = canvas.getContext("2d");
    let rect = canvas.getBoundingClientRect();
    const canvasX = x - rect.left;
    const canvasY = y - rect.top;

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
        // console.log("precheck");
        // console.log(options);
        // options: {
        //     action: "checkLocation",
        //     values: {
        //         x: clientMouseDown.x,
        //         y: clientMouseDown.y,
        //     },
        // },
        // console.log(options.options);

        // const x = col * (hexWidth * 0.9);
        // const y = row * yOffset + ((col % 2) * yOffset) / 2;

        if (options["action"] == "checkLocation") {
            let optionX = options.values.x;
            let optionY = options.values.y;
            // let { x, y } = getGridCoordinates(optionX, optionY, canvas);
            // console.log(x);
            // console.log(y);
            if (ctx.isPointInPath(options.values.x, options.values.y)) {
                // drawDraggedHexagon(clientX, clientY);
                console.log("true");
                return true;
            } else {
                return false;
            }
        }
    }
}

// draws from left to right
function drawHexagonalGrid(
    rows,
    cols,
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
    for (let row = 0; row < rows; row++) {
        // setHexGridState((arr) => [...arr, []]);
        for (let col = 0; col < cols; col++) {
            // console.log("iterate");
            // let tempRow = [...hexGridState[row], null];
            // setHexGridState((arr) => [...arr]);
            const x = col * (hexWidth * 0.9);
            const y = row * yOffset + ((col % 2) * yOffset) / 2;

            // console.log(hexGridState[row][col]);
            // console.log(clientMouseDown);
            if (options) {
                if (options["checkLocation"]) {
                    const isInTile = drawHexagon(x, y, canvas, null, {
                        action: "checkLocation",
                        values: {
                            x: options["checkLocation"].x,
                            y: options["checkLocation"].y,
                        },
                    });
                }
            } else {
                drawHexagon(x, y, canvas);
            }
        }
    }
}

function setupImage(link) {
    const playerImage = new Image();
    playerImage.src = link;
    // image.src = link;
    return playerImage;
}

const Canvas = (props) => {
    // console.log("rerender");
    const canvasRef = useRef(null);
    const canvasRef2 = useRef(null);
    const [clientMouseDown, setClientMouseDown] = useState(null);
    const [hexGridState, setHexGridState] = useState(setupGameBoard(30, 30));
    const [actionGridLocation, setActionGridLocation] = useState(null);
    const [mouseDownLocation, setMouseDownLocation] = useState(null);
    const [mouseUpLocation, setMouseUpLocation] = useState(null);
    const [image, setImage] = useState(
        setupImage(hexGridState[2][2]["player"])
    );
    // function drawHex(ctx, x, y) {
    //     ctx.beginPath();
    //     for (let i = 0; i < 6; i++) {
    //         const angle = (Math.PI / 3) * i;
    //         const cx = x + hexWidth * Math.cos(angle);
    //         const cy = y + hexHeight * Math.sin(angle);
    //         ctx.lineTo(cx, cy);
    //     }
    //     ctx.closePath();
    //     ctx.stroke();
    // }
    function updateHexGridState(rowIndex, colIndex, newValue) {
        const newArr = hexGridState.map((row) => [...row]);
        console.log({ rowIndex, colIndex, newValue });
        newArr[rowIndex][colIndex]["player"] = newValue;
        setHexGridState(newArr);
    }
    useEffect(() => {
        const canvas2 = canvasRef2.current;
        const ctx2 = canvas2.getContext("2d");
        const { hexRadius, hexWidth, hexHeight } = baseSettings;
        // draw a hexagon in a coordinate

        // hard coded image check in state manager
        // if (hexGridState[2][2]) {

        // console.log(hexGridState);
        let fromCoordinates = null;
        console.log(mouseDownLocation);
        if (mouseDownLocation) {
            console.log(mouseDownLocation);
            let clientX = mouseDownLocation["x"];
            let clientY = mouseDownLocation["y"];
            fromCoordinates = getGridCoordinates(
                clientX,
                clientY,
                canvas2,
                hexGridState
            );
            console.log(fromCoordinates);
        }
        let toCoordinates = null;
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        let drawArray = [];
        console.log("rere");
        hexGridState.forEach((row, rowInd) => {
            row.forEach((col, colInd) => {
                // console.log(col);
                if (col && col["player"]) {
                    const yOffset = hexRadius * 1.7;
                    const x = canvas2.offsetLeft + rowInd * (hexWidth * 0.9);
                    const y = colInd * yOffset;
                    // console.log("reach");

                    // const playerImage = new Image();
                    // playerImage.src = hexGridState[rowInd][colInd]; // Replace with the path to your image

                    // playerImage.onload = function () {
                    // ctx.drawImage(playerImage, x, y, 100, 100);
                    // drawHexagonalGrid(25, 25);
                    if (mouseDownLocation) {
                        console.log("mousedown");
                        console.log(clientMouseDown);
                        console.log(mouseDownLocation);
                        let clientX = mouseDownLocation["x"];
                        let clientY = mouseDownLocation["y"];
                        console.log(mouseDownLocation);
                        fromCoordinates = getGridCoordinates(
                            clientX,
                            clientY,
                            canvas2,
                            hexGridState
                        );
                        drawHexagon(clientX, clientY, canvas2, image);
                        drawHexagon(x, y, canvas2, image);
                    } else {
                        console.log("drawnyunage");
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
        if (mouseUpLocation && mouseDownLocation) {
            let temp = hexGridState[2][2]["player"];
            console.log(fromCoordinates);
            updateHexGridState(
                fromCoordinates.x,
                fromCoordinates.y,
                hexGridState[2][2]["player"]
            );
        }
    }, [clientMouseDown, mouseUpLocation, mouseDownLocation]);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const { hexRadius, hexWidth, hexHeight } = baseSettings;

        const backgroundImage = new Image();
        backgroundImage.src = dnd; // Replace with the path to your image
        backgroundImage.onload = function () {
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
            drawHexagonalGrid(30, 30, canvas, hexGridState);
        };
    }, [mouseDownLocation, mouseUpLocation, hexGridState]);

    const handleMouseDown = (e) => {
        setClientMouseDown({ x: e.clientX, y: e.clientY });
        setMouseDownLocation({ x: e.clientX, y: e.clientY });
        // let
        let ctx = canvasRef.current.getContext("2d");

        if (clientMouseDown) {
            let clientX = clientMouseDown["x"];
            let clientY = clientMouseDown["y"];
            setClientMouseDown({ x: clientX, y: clientY });
            setMouseDownLocation({ x: clientX, y: clientY });
        }
    };

    const handleMouseUp = (e) => {
        console.log("up");
        setMouseUpLocation({ x: e.clientX, y: e.clientY });
        setClientMouseDown(null);
    };

    const handleMouseMove = (e) => {
        // setActionGridLocation({ x: e.clientX, y: e.clientY });
        if (clientMouseDown) {
            setClientMouseDown({ x: e.clientX, y: e.clientY });
        }
    };

    return (
        <div>
            <canvas
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                // draggable="true"
                // onDrag={handleDrag}
                ref={canvasRef2}
                // style={{ border: "1px solid #ccc" }}
                // id="hexagonCanvas"
                style={{ position: "absolute" }}
                width="1900"
                height="1300"
                {...props}
            />
            <canvas
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                // draggable="true"
                // onDrag={handleDrag}
                ref={canvasRef}
                // style={{ border: "1px solid #ccc" }}
                // id="hexagonCanvas"
                width="1900"
                height="1300"
                {...props}
            />
        </div>
    );
};

export default Canvas;
