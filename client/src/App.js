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
import MapUpload from "./MapUpload";

// const WS_URL = "ws://talesofparthenuumserver.onrender.com:8000";

function App() {
    const [messages, setMessages] = useState([]);
    const [actions, setActions] = useState([
        {
            action: "Attack",
            cost: 5,
            description:
                " You make an attack using your currently equipped weapon. Can be used once per turn",
        },
        {
            action: "Follow-up Attack",
            cost: 7,
            description:
                "You make an attack using your currently equipped weapon, can only be used after making an Attack Action.",
        },
        {
            action: "Move",
            cost: 1,
            description:
                "You can move up to your Movement Speed this turn. Can be used once per turn.",
        },
    ]);

    function handleCollapse(e) {
        // alert("Element clicked!");
        console.log(e);
        let sidebar = e.target;
        sidebar.classList.toggle("side-collapse");
        let arrowCollapse = e.target.children[0];
        // e.stopPropagation();
        // e.stopImmediatePropagation();
        if (!arrowCollapse.classList.contains("collapse")) {
            arrowCollapse.classList =
                "bx bx-arrow-from-left logo-name__icon collapse";
        } else {
            arrowCollapse.classList = "bx bx-arrow-from-right logo-name__icon";
        }
    }

    return (
        <div className="App h-100">
            <BrowserRouter>
                <Switch>
                    <Route path="/home">
                        <div
                            className="side-bar"
                            onClick={handleCollapse}
                            style={{ zIndex: 1 }}
                        >
                            <button
                                className="logo-name__button"
                                onClick={handleCollapse}
                            >
                                <i
                                    className="bx bx-arrow-from-right logo-name__icon"
                                    id="logo-name__icon"
                                ></i>
                            </button>

                            <ul className="features-list">
                                <li className="features-item">
                                    Character Sheet
                                </li>
                                <li className="features-item">Level Up</li>
                                <li className="features-item">Item</li>
                            </ul>
                        </div>

                        <Canvas></Canvas>
                        <div className="character-sheet">
                            <div className="bg-light active">
                                <div
                                    className="ms-3 my-3 text-start collapse"
                                    id="collapseExample"
                                >
                                    {actions.map((e) => {
                                        return (
                                            <>
                                                <i class="fa-solid fa-diamond"></i>
                                                <span>
                                                    {e.action} - {e.cost} ap
                                                </span>
                                                <br></br>
                                            </>
                                        );
                                    })}
                                </div>
                            </div>
                            <button
                                class=" btn btn-primary "
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseExample"
                                aria-expanded="false"
                                aria-controls="collapseExample"
                            >
                                Character Sheet
                            </button>
                            <button class=" btn btn-danger ms-3">
                                Actions
                            </button>
                        </div>
                        <Home />
                    </Route>
                    <Route path="/GenerateMap">
                        <MapUpload> </MapUpload>
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
