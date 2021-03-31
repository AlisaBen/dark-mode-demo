深色模式 demo，方案三：
通过事件监听媒体查询动态的变化，匹配
[prefers-color-scheme](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media/prefers-color-scheme)，进而设置不同的 className,本质和方案二是相同的，只不过结合了 js 的方案

在 chrome://flags/#enable-force-dark 页面修改 chrome 主题色，reload 后，查看本页面的样式，会自动变换主题色

关键代码：

```javascript
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

    return <div className={`App ${mode}`}></div>;
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
