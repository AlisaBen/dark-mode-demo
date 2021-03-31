深色模式 demo，方案二：
[prefers-color-scheme](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media/prefers-color-scheme)检测系统主题色，根据 css 媒体查询匹配不同的色值

在 chrome://flags/#enable-force-dark 页面修改 chrome 主题色，reload 后，查看本页面的样式，会自动变换主题色

关键代码：

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
    color: var(--current-primary-color);
    background-color: var(--current-background-color);
}

@media (prefers-color-scheme: dark) {
    :root {
        --current-background-color: var(--dark-background-color);
        --current-primary-color: var(--dark-primary-color);
    }
}

@media (prefers-color-scheme: light) {
    :root {
        --current-background-color: var(--light-background-color);
        --current-primary-color: var(--light-primary-color);
    }
}
```
