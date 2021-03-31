import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Switch } from "antd";
import "antd/dist/antd.css";
import setTheme from "./util";

function App() {
    const [mode, setMode] = useState("light");
    useEffect(() => {
        setTheme(mode);
    }, [mode]);
    return (
        <div className={`App`}>
            <div style={{ paddingTop: "50px" }}>
                切换主题模式：
                <Switch
                    onClick={() => setMode(mode === "light" ? "dark" : "light")}
                ></Switch>
                {"当前模式为：" + (mode === "light" ? "浅色模式" : "深色模式")}
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
