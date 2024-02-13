import { useEffect, useRef } from "react";
import dnd from "./static/dnd.png";

const Canvas = (props) => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const hexRadius = 30;
        const hexWidth = Math.sqrt(3) * hexRadius;
        const hexHeight = 2 * hexRadius;

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
        }

        function drawHexagonalGrid(rows, cols) {
            const yOffset = hexRadius * 1.7;

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const x = col * (hexWidth * 0.9);
                    const y = row * yOffset + ((col % 2) * yOffset) / 2;
                    drawHexagon(x, y);
                }
            }
        }

        const backgroundImage = new Image();
        backgroundImage.src = dnd; // Replace with the path to your image
        console.log(dnd);
        backgroundImage.onload = function () {
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
            drawHexagonalGrid(35, 35);
        };
    }, []);

    return (
        <canvas
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
