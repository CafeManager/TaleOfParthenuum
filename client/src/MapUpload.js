import Canvas from "./Canvas";

function MapUpload() {
    return (
        <>
            <div
                style={{
                    width: "200px",
                    height: "200px",
                }}
                className="mx-auto"
            >
                <Canvas> </Canvas>
            </div>
            <h1> This is my map </h1>
        </>
    );
}

export default MapUpload;
