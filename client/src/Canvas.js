import { useEffect, useRef, useState } from "react";
import dnd from "./static/dnd.png";
import token from "./static/token.jpg";

function setupGameBoard(rows, cols) {
    let gameboard = [];
    for (let row = 0; row < rows; row++) {
        gameboard.push([]);
        for (let col = 0; col < cols; col++) {
            gameboard[row].push(null);
        }
    }
    // console.log(gameboard);
    gameboard[2][2] = token;

    return gameboard;
}

// const baseSettings = {
//     hexRadius: 30,
//     hexWidth: Math.sqrt(3) * hexRadius,
//     hexHeight: 2 * hexRadius,
// };
const baseSettings = {
    hexRadius: 30,
    hexWidth: Math.sqrt(3) * 30,
    hexHeight: 2 * 30,
};

function drawHexagon(x, y, canvas, image = null, options = null) {
    const { hexRadius, hexWidth, hexHeight } = baseSettings;
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
        if (options["action"] == "checkLocation") {
            // console.log("check");
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

const Canvas = (props) => {
    // console.log("rerender");
    const canvasRef = useRef(null);
    const canvasRef2 = useRef(null);
    const [clientMouseDown, setClientMouseDown] = useState(null);
    const [hexGridState, setHexGridState] = useState(setupGameBoard(30, 30));
    const [actionGridLocation, setActionGridLocation] = useState(null);
    const [mouseDownLocation, setMouseDownLocation] = useState(null);
    const [mouseUpLocation, setMouseUpLocation] = useState(null);
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

    useEffect(() => {
        const canvas2 = canvasRef2.current;
        const ctx2 = canvas2.getContext("2d");
        const { hexRadius, hexWidth, hexHeight } = baseSettings;
        // draw a hexagon in a coordinate

        // hard coded image check in state manager
        // if (hexGridState[2][2]) {
        const yOffset = hexRadius * 1.7;
        const x = canvas2.offsetLeft + 2 * (hexWidth * 0.9);
        const y = +2 * yOffset + ((10 % 2) * yOffset) / 2;

        console.log(hexGridState);
        hexGridState.forEach((row, rowInd) => {
            row.forEach((col, colInd) => {
                console.log(col);
                if (col) {
                    console.log("reach");
                    const playerImage = new Image();
                    playerImage.src = hexGridState[rowInd][colInd]; // Replace with the path to your image

                    playerImage.onload = function () {
                        // ctx.drawImage(playerImage, x, y, 100, 100);
                        // drawHexagonalGrid(25, 25);
                        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
                        if (clientMouseDown) {
                            let clientX = clientMouseDown["x"];
                            let clientY = clientMouseDown["y"];
                            drawHexagon(clientX, clientY, canvas2, playerImage);
                            drawHexagon(x, y, canvas2, playerImage);
                        } else {
                            drawHexagon(x, y, canvas2, playerImage);
                        }
                    };
                }
            });
        });
        // console.log("reach");
        // }
    }, [clientMouseDown]);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const { hexRadius, hexWidth, hexHeight } = baseSettings;

        // draw a dragging tile
        // function drawDraggedHexagon(x, y) {
        //     console.log(x);
        //     console.log(y);

        //     ctx.beginPath();
        //     ctx.moveTo(x + hexRadius, y);
        //     for (let i = 1; i <= 6; i++) {
        //         const angle = (i * 2 * Math.PI) / 6;
        //         const newX = x + hexRadius * Math.cos(angle);
        //         const newY = y + hexRadius * Math.sin(angle);
        //         ctx.lineTo(newX, newY);
        //     }
        //     ctx.closePath();
        //     ctx.stroke();
        // }

        // draws a hexagon at x y location
        // function drawHexagon(x, y) {
        //     ctx.beginPath();
        //     ctx.moveTo(x + hexRadius, y);
        //     for (let i = 1; i <= 6; i++) {
        //         const angle = (i * 2 * Math.PI) / 6;
        //         const newX = x + hexRadius * Math.cos(angle);
        //         const newY = y + hexRadius * Math.sin(angle);
        //         ctx.lineTo(newX, newY);
        //     }
        //     ctx.closePath();
        //     ctx.stroke();
        //     if (clientMouseDown) {
        //         let clientX = clientMouseDown["x"];
        //         let clientY = clientMouseDown["y"];

        //         if (ctx.isPointInPath(clientX, clientY)) {
        //             // drawDraggedHexagon(clientX, clientY);
        //         }
        //     }
        // }

        // draws from left to right
        function drawHexagonalGrid(rows, cols, options = null) {
            const yOffset = hexRadius * 1.7;

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
                    if (clientMouseDown) {
                        const isInTile = drawHexagon(x, y, canvas, null, {
                            action: "checkLocation",
                            values: {
                                x: clientMouseDown.x,
                                y: clientMouseDown.y,
                            },
                        });
                        // console.log(isInTile);
                        if (isInTile) {
                            setActionGridLocation({ x: col, y: row });
                        }
                        if (actionGridLocation) {
                            // console.log(actionGridLocation);
                        }
                    } else {
                        drawHexagon(x, y, canvas);
                    }
                    // if (hexGridState[row][col]) {
                    //     console.log("reach");
                    //     const playerImage = new Image();
                    //     playerImage.src = hexGridState[row][col]; // Replace with the path to your image
                    //     console.log(dnd);
                    //     playerImage.onload = function () {
                    //         // ctx.drawImage(playerImage, x, y, 100, 100);
                    //         // drawHexagonalGrid(25, 25);
                    //         drawTokenHexagon(x, y, playerImage);
                    //     };
                    // }
                }
            }
        }

        const backgroundImage = new Image();
        backgroundImage.src = dnd; // Replace with the path to your image
        console.log(dnd);
        backgroundImage.onload = function () {
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
            drawHexagonalGrid(30, 30);
        };
    }, [mouseDownLocation, mouseUpLocation]);

    const handleMouseDown = (e) => {
        console.log("mousedown");
        setClientMouseDown({ x: e.clientX, y: e.clientY });
        setMouseDownLocation({ x: e.clientX, y: e.clientY });
        // let
        let ctx = canvasRef.current.getContext("2d");

        if (clientMouseDown) {
            let clientX = clientMouseDown["x"];
            let clientY = clientMouseDown["y"];
            setClientMouseDown({ x: clientX, y: clientY });
            setMouseDownLocation({ x: e.clientX, y: e.clientY });
        }
        // const ctx = canvas.getContext("2d");

        // let selectedHexagon = drawHexagon(35, 35, {
        //     x: e.clientX,
        //     y: e.clientY,
        // });
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
