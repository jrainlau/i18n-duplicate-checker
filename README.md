# i18n-duplicate-checker

用于检查某个特定 i18n 文件的 key 是否已经和公共 i18n 文件的词条重复的 VSCode 插件。

![demo.gif](./docs/demo.gif)

## 基本介绍
在一般的 Web 项目中（如基于 NextJS 的项目），其 i18n 词条会以 Key-Value 的形式存放于特定文件中，如

`locales/en/common.json`

```json
{
  "TITLE": "Title"
}
```

`locales/zh/common.json`

```json
{
  "TITLE": "标题"
}
```

这里的 `common.json` 默认会被所有模块引入。但是在具体的实践中，开发者往往会把不同模块的词条单独拆成对应的 i18n 文件，再按需加载。

随着模块数量和词条的增加，很多时候模块对应的词条容已经在 `common.json` 中出现过，没必要再写一次。这个插件会自动检查某个模块 i18n 文件中的词条是否已经重复。

## 插件配置
1. 组合键 `Command + Shift + P` 后输入 `Open workspace settings`；
2. 搜索设置 `i18n-duplicate-checker` 找到当前扩展，选择“在 settings.json 中编辑”;
3. 编辑如下内容:
  ```json
  {
    // 这里写项目公共 i18n 文件的路径
    "i18nDuplicateChecker.commonI18nPaths": [
      "public/locales/en/common.json",
      "public/locales/zh/common.json"
    ],
    // 这里写项目 i18n 目录的路径
    "i18nDuplicateChecker.i18nFolderPath": "public/locales"
  }
  ```
  保存即可。

## 使用
任何位于 `i18nDuplicateChecker.i18nFolderPath` 中的 json 文件，都会自动被该插件实时检查，并通过 Warning 予以提示。点击提示上的链接，即可跳转到对应的公共 i18n 词条中。
