import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
    const [mode, setMode] = useState("light");
    useEffect(() => {
        if (window && window.matchMedia) {
            const mediaQuery = window.matchMedia(
                "(prefers-color-scheme: light)"
            );
            if (mediaQuery && mediaQuery.matches) {
                const listener = () => {
                    setMode(mediaQuery.matches ? "light" : "dark");
                };
                mediaQuery.addEventListener("change", listener);
                return () => {
                    mediaQuery.removeEventListener("change", listener);
                };
            }
        }
    }, []);

    return (
        <div className={`App ${mode}`}>
            <div style={{ paddingTop: "50px" }}>
                通过css媒体查询动态改变网页主题模式，通过
                <span className="App-link">
                    chrome://flags/#enable-force-dark
                </span>
                修改网页主题模式，页面跟随动态变化。
            </div>
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
