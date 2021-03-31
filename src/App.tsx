import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Switch } from "antd";
import "antd/dist/antd.css";
import setTheme from "./util";
import styled from "styled-components";
import { ThemeProvider } from "styled-components";

const Button = styled.div`
    font-size: 1em;
    margin: 1em;
    padding: 0.25em 2em;
    border-radius: 3px;
    display: inline-block;
    color: ${(props) => props.theme.fontColor};
    border: 2px solid ${(props) => props.theme.borderColor};
    background-color: ${(props) => props.theme.backgroundColor};
`;

const DefaultTheme = {
    backgroundColor: "white",
    fontColor: "#33997a",
    borderColor: "#33997a",
};
const PinkTheme = {
    backgroundColor: "#DB7290",
    fontColor: "white",
    borderColor: "#ffd7e8",
};

interface AppState {
    mode: string;
}
class App extends React.Component<{}, AppState> {
    constructor(props: any) {
        super(props);
        this.state = {
            mode: "light",
        };
    }
    setMode(mode: string) {
        setTheme(mode);
        this.setState({ mode });
    }
    render() {
        const { mode } = this.state;
        return (
            <div className={`App`}>
                <div style={{ paddingTop: "50px" }}>
                    切换主题模式：
                    <Switch
                        onClick={() =>
                            this.setMode(mode === "light" ? "dark" : "light")
                        }
                    ></Switch>
                    {"当前模式为：" +
                        (mode === "light" ? "浅色模式" : "深色模式")}
                </div>
                <Button>Normal</Button>
                <ThemeProvider
                    theme={mode === "light" ? DefaultTheme : PinkTheme}
                >
                    <Button>Themed</Button>
                </ThemeProvider>

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
}

export default App;
