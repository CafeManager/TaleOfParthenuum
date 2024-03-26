import "./App.css";
import {
    Switch,
    Route,
    BrowserRouter,
    Redirect,
    NavBar,
} from "react-router-dom";
import TalesOfParthenuum from "./TalesOfParthenuum";
import Home from "./Home";
import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Canvas from "./Canvas";

// const WS_URL = "ws://talesofparthenuumserver.onrender.com:8000";

function App() {
    const [messages, setMessages] = useState([]);

    function handleCollapse(e) {
        console.log(e);
        let sidebar = e.target;
        sidebar.classList.toggle("side-collapse");
        let arrowCollapse = e.target.children[0];

        if (arrowCollapse.classList.contains("collapse")) {
            arrowCollapse.classList =
                "bx bx-arrow-from-left logo-name__icon collapse";
        } else {
            arrowCollapse.classList = "bx bx-arrow-from-right logo-name__icon";
        }
    }

    return (
        <div className="App h-100">
            <BrowserRouter>
                <div className="side-bar" onClick={handleCollapse}>
                    <button className="logo-name__button">
                        <i
                            className="bx bx-arrow-from-right logo-name__icon"
                            id="logo-name__icon"
                        ></i>
                    </button>

                    <ul className="features-list">
                        <li className="features-item">Character Sheet</li>
                        <li className="features-item">Level Up</li>
                        <li className="features-item">Item</li>
                    </ul>
                </div>
                {/* <button
                    onClick={() => {
                        let x = sendJsonMessage({ message: "test!" });
                        console.log(x);
                    }}
                >
                    send
                </button> */}

                <Canvas></Canvas>
                <div className="character-sheet">
                    <div className="bg-light">
                        <div className="ms-3 my-3 text-start">
                            <i class="fa-solid fa-diamond"></i>
                            <span> Swing sword </span>
                            <br></br>
                            <i class="fa-solid fa-diamond"></i>
                            <span> Sleep </span>
                            <br></br> <i class="fa-solid fa-diamond"></i>
                            <span> Cast spell </span>
                            <br></br> <i class="fa-solid fa-diamond"></i>
                            <span> Somersault </span>
                            <br></br>
                        </div>
                    </div>
                    <button class=" btn btn-primary ">
                        Character Sheet
                        {/* <h1 className="details"> details </h1> */}
                    </button>
                    <button class=" btn btn-danger ms-3">Actions</button>
                </div>
                <Switch>
                    <Route path="/home">
                        <Home />
                    </Route>
                    <Route path="/TalesOfParthenuum">
                        <TalesOfParthenuum />
                    </Route>
                    <Route path="*">
                        <Redirect to="/home" />
                    </Route>
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;
