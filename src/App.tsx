import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Select, Card, Affix, Anchor, Row, Col, Layout, Button } from "antd";
import { useLocalStorage } from "react-use";
import "antd/dist/antd.css";
import { SketchPicker } from "react-color";
import Preview from "./Preview";
// import setTheme from "./util";
// import styled from "styled-components";
// import { ThemeProvider } from "styled-components";
import { ThemeProvider, useTheme, setTheme, ThemeOptions } from "./lib/index";
const { Link } = Anchor;
// const Button = styled.div`
//     font-size: 1em;
//     margin: 1em;
//     padding: 0.25em 2em;
//     border-radius: 3px;
//     display: inline-block;
//     color: ${(props) => props.theme.fontColor};
//     border: 2px solid ${(props) => props.theme.borderColor};
//     background-color: ${(props) => props.theme.backgroundColor};
// `;
const initialTheme = {
  name: "default",
  variables: {
    "primary-color": "#DB7290",
  },
};
const storageKey = "ant-design-theme";
const initializeTheme = () => {
  const item = localStorage.getItem(storageKey);
  setTheme(item ? JSON.parse(item) : initialTheme);
};

initializeTheme();
const ThemeSelect = () => {
  const [{ name, variables = {}, themes }, setTheme] = useTheme();
  console.log(themes);
  console.log(variables);
  console.log(setTheme);

  const sketchPicker = React.useMemo(
    () => (
      <SketchPicker
        // styles={{
        //   boxShadow: "none",
        // }}
        color={variables["primary-color"]}
        onChange={(value) => {
          setTheme({
            name,
            variables: {
              "primary-color": value.hex,
            },
          });
        }}
      />
    ),
    [name, variables, setTheme]
  );

  const select = React.useMemo(
    () => (
      <Select
        size="small"
        style={{ width: 100 }}
        value={name}
        onChange={(theme) => {
          console.log(themes);
          console.log("onchange");
          console.log(theme);
          console.log(variables);
          setTheme({ name: theme, variables });
        }}
      >
        {themes.map(({ name }) => (
          <Select.Option key={name} value={name}>
            {name}
          </Select.Option>
        ))}
      </Select>
    ),
    [name, variables, themes, setTheme]
  );

  return (
    <Affix offsetTop={24}>
      <Card
        bodyStyle={{ padding: "0px" }}
        title={select}
        extra={
          <Button size="small" onClick={() => setTheme(initialTheme)}>
            Reset
          </Button>
        }
      >
        {sketchPicker}
      </Card>
    </Affix>
  );
};
const componets = ["Color", "Button"];

const content = (
  <Layout style={{ background: "transparent" }}>
    <Layout.Header />
    <Layout.Content style={{ padding: "40px 32px" }}>
      <Row gutter={24}>
        <Col xs={4}>
          <Anchor>
            {componets.map((name) => (
              <Link href={`#${name}`} title={name} />
            ))}
          </Anchor>
        </Col>
        <Col xs={16}>
          <div className="theme-edit">
            <Preview />
          </div>
        </Col>
        <Col xs={4}>
          <ThemeSelect />
        </Col>
      </Row>
    </Layout.Content>
  </Layout>
);
interface RuntimeValue {
  expr: Object;
  default: string;
  node: any;
}
interface Theme {
  name: string;
  variables: Record<string, string | RuntimeValue>;
}
interface AppState {
  mode: string;
  theme: Theme;
}
const App = () => {
  const [theme, setTheme] = useLocalStorage<ThemeOptions>(
    "ant-design-theme",
    initialTheme
  );
  return (
    <ThemeProvider
      theme={theme}
      onChange={(value) => {
        console.log("themeprovider");
        setTheme(value);
      }}
    >
      {content}
    </ThemeProvider>
  );
};

export default App;
