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
import { useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

// const WS_URL = "ws://talesofparthenuumserver.onrender.com:8000";

const WS_URL = "ws://localhost:8000";
function App() {
    const { lastJsonMessage, sendJsonMessage, sendMessage, readyState } =
        useWebSocket(WS_URL, {
            onOpen: () => {
                console.log("WebSocket connection established.");
            },
            share: true,
            filter: () => false,
            retryOnError: true,
            shouldReconnect: () => true,
        });

    const [messages, setMessages] = useState([]);

    function addName(name) {
        sendJsonMessage({ name });
    }

    return (
        <div className="App">
            <BrowserRouter>
                <nav className="navbar navbar-expand-lg bg-body-tertiary">
                    <div class="container-fluid">
                        <a class="navbar-brand" href="#">
                            Navbar
                        </a>
                        <button
                            class="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarNav"
                            aria-controls="navbarNav"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span class="navbar-toggler-icon"></span>
                        </button>

                        <div class="collapse navbar-collapse" id="navbarNav">
                            <ul class="navbar-nav">
                                <li class="nav-item">
                                    <a
                                        class="nav-link active"
                                        aria-current="page"
                                        href="#"
                                    >
                                        Home
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="#">
                                        Features
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="#">
                                        Pricing
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a
                                        class="nav-link disabled"
                                        aria-disabled="true"
                                    >
                                        Disabled
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <button
                    onClick={() => {
                        let x = sendJsonMessage({ message: "test!" });
                        console.log(x);
                    }}
                >
                    send
                </button>
                <div class="container container-top-fix">
                    <div className="main">
                        <div className="grid-container">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                    {/* <img
                        class="map"
                        draggable="true"
                        src="https://cdn.discordapp.com/attachments/408412703804227594/1132009353675821266/Untitled.png"
                    />
                    <input
                        id="scaler"
                        type="range"
                        min="1"
                        max="10"
                        value="1"
                    />
                    <button class="sheet-button btn btn-primary">
                        Character Sheet
                    </button>
                    <button class="action-button btn btn-danger">
                        Actions
                    </button> */}
                </div>
                <Switch>
                    <Route path="/home">
                        <Home addName={addName} />
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
