# 方案一[program-1]：切换不同的模式，加载不同的 className

深色模式 demo，方案一：
切换不同的模式，加载不同的 className
关键代码：

```javascript
function App() {
  const [mode, setMode] = useState("light");
  return (
    <div className={`App ${mode}`}>
      <div style={{ paddingTop: "50px" }}>
        切换主题模式：
        <Switch
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
        ></Switch>
      </div>
    </div>
  );
}
```

css

```css
:root {
  /* 浅色主题 */
  --light-primary-color: #666;
  --light-background-color: #fff;

  /* 深色主题 */
  --dark-primary-color: #fff;
  --dark-background-color: #282c34;
}

.App {
  min-height: 100vh;
  text-align: center;
}

.light {
  color: var(--light-primary-color);
  background-color: var(--light-background-color);
}
.dark {
  color: var(--dark-primary-color);
  background-color: var(--dark-background-color);
}
```

# 方案二[program-4]:替换变量取值：--current-primary-color

深色模式 demo，方案四：

1. 样式色值固定

```css
.App {
  min-height: 100vh;
  text-align: center;
  color: var(--current-primary-color);
  background-color: var(--current-background-color);
}
```

2. 根据不同的模式，修改变量的取值

```javascript
const setTheme = (themeName) => {
  // 找到样式表中所有以--current开头的变量
  const currentCssVar = Array.from(document.styleSheets).reduce(
    (acc, sheet) =>
      (acc = [
        ...acc,
        ...Array.from(sheet.cssRules).reduce(
          (def, rule) =>
            (def =
              rule.selectorText === ":root"
                ? [
                    ...def,
                    ...Array.from(rule.style).filter((name) =>
                      name.startsWith("--current")
                    ),
                  ]
                : def),
          []
        ),
      ]),
    []
  );

  // 替换--current开头的变量的取值根据模式进行选择
  currentCssVar.forEach((item) => {
    document.documentElement.style.setProperty(
      item,
      `var(--${themeName}${item.substring(9)})`
    );
  });
  console.log(document.documentElement.style);
};

export default setTheme;
```

# 方案三[program-5]：styled-components 注入全局主题，ThemeProvider

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
