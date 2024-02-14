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
    gameboard[10][10] = token;

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

const Canvas = (props) => {
    const canvasRef = useRef(null);
    const [clientMouseDown, setClientMouseDown] = useState(null);
    const [hexGridState, setHexGridState] = useState(setupGameBoard(25, 25));

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
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const { hexRadius, hexWidth, hexHeight } = baseSettings;

        // draw a dragging tile
        function drawDraggedHexagon(x, y) {
            console.log(x);
            console.log(y);
            ctx.beginPath();
            ctx.moveTo(x + hexRadius, y);
            for (let i = 1; i <= 6; i++) {
                const angle = (i * 2 * Math.PI) / 6;
                const newX = x + hexRadius * Math.cos(angle);
                const newY = y + hexRadius * Math.sin(angle);
                ctx.lineTo(newX, newY);
            }
            ctx.closePath();
            ctx.stroke();
        }

        function drawTokenHexagon(x, y, image) {
            console.log(image);
            ctx.beginPath();
            ctx.moveTo(x + hexRadius, y);
            for (let i = 1; i <= 6; i++) {
                const angle = (i * 2 * Math.PI) / 6;
                const newX = x + hexRadius * Math.cos(angle);
                const newY = y + hexRadius * Math.sin(angle);
                ctx.lineTo(newX, newY);
            }
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(
                image,
                x - hexRadius,
                y - hexRadius,
                hexRadius * 2,
                hexRadius * 2
            );
        }

        // draws a hexagon at x y location
        function drawHexagon(x, y) {
            ctx.beginPath();
            ctx.moveTo(x + hexRadius, y);
            for (let i = 1; i <= 6; i++) {
                const angle = (i * 2 * Math.PI) / 6;
                const newX = x + hexRadius * Math.cos(angle);
                const newY = y + hexRadius * Math.sin(angle);
                ctx.lineTo(newX, newY);
            }
            ctx.closePath();
            ctx.stroke();
            if (clientMouseDown) {
                // console.log(clientMouseDown);
                let clientX = clientMouseDown["x"];
                let clientY = clientMouseDown["y"];
                // console.log(clientX);
                // console.log(clientY);
                if (ctx.isPointInPath(clientX, clientY)) {
                    drawDraggedHexagon(clientX, clientY);
                }
            }
        }

        // draws from left to right
        function drawHexagonalGrid(rows, cols, options = null) {
            const yOffset = hexRadius * 1.7;

            for (let row = 0; row < rows; row++) {
                // setHexGridState((arr) => [...arr, []]);
                for (let col = 0; col < cols; col++) {
                    console.log("iterate");
                    // let tempRow = [...hexGridState[row], null];
                    // setHexGridState((arr) => [...arr]);
                    const x = col * (hexWidth * 0.9);
                    const y = row * yOffset + ((col % 2) * yOffset) / 2;

                    // console.log(hexGridState[row][col]);

                    drawHexagon(x, y);
                    if (hexGridState[row][col]) {
                        console.log("reach");
                        const playerImage = new Image();
                        playerImage.src = hexGridState[row][col]; // Replace with the path to your image
                        console.log(dnd);
                        playerImage.onload = function () {
                            // ctx.drawImage(playerImage, x, y, 100, 100);
                            // drawHexagonalGrid(25, 25);
                            drawTokenHexagon(x, y, playerImage);
                        };
                    }
                }
            }
        }

        const backgroundImage = new Image();
        backgroundImage.src = dnd; // Replace with the path to your image
        console.log(dnd);
        backgroundImage.onload = function () {
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
            drawHexagonalGrid(25, 25);
        };
    }, [clientMouseDown]);

    const handleMouseDown = (e) => {
        console.log("mousedown");
        setClientMouseDown({ x: e.clientX, y: e.clientY });
        // let
        let ctx = canvasRef.current.getContext("2d");

        if (clientMouseDown) {
            let clientX = clientMouseDown["x"];
            let clientY = clientMouseDown["y"];
            setClientMouseDown({ x: clientX, y: clientY });
        }
        // const ctx = canvas.getContext("2d");

        // let selectedHexagon = drawHexagon(35, 35, {
        //     x: e.clientX,
        //     y: e.clientY,
        // });
    };

    const handleMouseUp = (e) => {
        setClientMouseDown(null);
    };

    const handleMouseMove = (e) => {
        if (clientMouseDown) {
            setClientMouseDown({ x: e.clientX, y: e.clientY });
        }
    };

    return (
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
    );
};

export default Canvas;
