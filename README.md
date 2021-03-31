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
