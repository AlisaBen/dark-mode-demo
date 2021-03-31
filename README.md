深色模式 demo，方案五：
采用[styled-components](https://medium.com/itsoktomakemistakes/%E5%9C%A8-react-styled-components-%E9%80%8F%E9%81%8E-themeprovider-%E4%BE%86%E6%9B%B4%E6%8F%9B%E7%B6%B2%E9%A0%81%E8%89%B2%E5%BD%A9%E4%B8%BB%E9%A1%8C%E6%A8%A3%E5%BC%8F-62be72b9c7ea)进行换肤

通过 ThemeProvider 外层包裹全局主题组件，将变量作为全局参数传递

```javascript
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

<ThemeProvider theme={mode === "light" ? DefaultTheme : PinkTheme}>
    <Button>Themed</Button>
</ThemeProvider>;
```
