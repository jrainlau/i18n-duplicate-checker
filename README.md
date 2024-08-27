# i18n-duplicate-checker

> [中文文档](./README.zh.md)

A VSCode plugin for checking if keys in a specific i18n file are duplicated in the common i18n file.

![demo.gif](./docs/demo.gif)

## Basic Introduction
In general web projects (such as those based on NextJS), i18n entries are stored in specific files in a key-value format, such as:

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

The `common.json` file here is imported by default in all modules. However, in practice, developers often separate the entries of different modules into corresponding i18n files and load them as needed.

As the number of modules and entries increases, many entries corresponding to modules may already exist in `common.json`, making it unnecessary to write them again. This plugin automatically checks if the entries in a module's i18n file are duplicated.

## Plugin Configuration
1. Press the combination `Command + Shift + P` and input `Open workspace settings`;
2. Search for the setting `i18n-duplicate-checker`, find the current extension, and select "Edit in settings.json";
3. Edit the content as follows:
  ```json
  {
    // Specify the path to the common i18n files of the project here
    "i18nDuplicateChecker.commonI18nPaths": [
      "public/locales/en/common.json",
      "public/locales/zh/common.json"
    ],
    // Specify the path to the i18n directory of the project here
    "i18nDuplicateChecker.i18nFolderPath": "public/locales"
  }
  ```
  Save and you're done.

---

If there are new language packs, simply add them to `i18nDuplicateChecker.commonI18nPaths`, like this:
```json
{
  "i18nDuplicateChecker.commonI18nPaths": [
    "public/locales/en/common.json",
    "public/locales/zh/common.json",
    "public/locales/jp/common.json"
  ]
}
```

> The module i18n entries edited in the same language pack directory will automatically associate with the `common.json` in the same language pack.

## Usage
Any JSON file located in the `i18nDuplicateChecker.i18nFolderPath` will be automatically checked in real-time by this plugin, and warnings will be provided for any duplicates. Clicking on the link in the warning will take you to the corresponding common i18n entry.

## License
MIT