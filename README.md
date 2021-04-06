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
