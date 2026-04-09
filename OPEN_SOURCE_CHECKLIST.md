# FF14 Market House Open Source Checklist

## 1. 数据边界

- 不提交现网配置目录
- 不提交测试状态文件和缓存
- 旧项目绝对路径必须移除

## 2. 可运行性

- 仓库内自带 `data/item_dict.json`
- 默认 `itemDictPath` 使用相对路径
- release 包包含字典文件

## 3. 文档

- README 写明查价和查房命令
- README 标明第三方数据源
- README 说明字典是静态资源

## 4. 发布

- 配置 `INDEX_PAT`
- Release zip 内必须包含 `index.mjs`、`package.json`、`data/item_dict.json`
- 确认官方索引 PR 已创建
