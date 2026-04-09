# napcat-plugin-ff14-market-house

一个 NapCat 原生插件，提供 FF14 物价查询和房屋查询能力。

## 功能

- `查价 物品 [服务器] [HQ]`
- `查房 服务器 主城 尺寸`
- 支持默认服务器配置
- 内置物品字典，开箱可用

## 数据来源

- [Universalis](https://universalis.app/)：物价查询
- `house.ffxiv.cyou`：房屋查询

## 配置

```json
{
  "enabled": true,
  "commandPrefix": "球鳖",
  "defaultServer": "猫小胖",
  "requestTimeoutMs": 10000,
  "itemDictPath": "./data/item_dict.json"
}
```

- `enabled`：是否启用
- `commandPrefix`：命令前缀，留空时可直接触发
- `defaultServer`：默认查价服务器
- `requestTimeoutMs`：请求超时，范围 `1000-30000`
- `itemDictPath`：物品字典路径，默认使用仓库内置的 `./data/item_dict.json`

## 使用示例

```text
球鳖 查价 魔晶石
球鳖 查价 魔晶石 猫小胖 HQ
球鳖 查房 猫小胖 海都 S
```

## 安装

1. 下载当前仓库 [Releases](https://github.com/sanxi33/napcat-plugin-ff14-market-house/releases) 中的 `napcat-plugin-ff14-market-house.zip`
2. 在 NapCat 插件管理中导入压缩包
3. 启用插件后按需修改默认服务器

## 发布产物

发布包包含：

- `index.mjs`
- `package.json`
- `data/item_dict.json`

## 已知限制

- 依赖第三方公开接口，上游变更时可能需要调整
- `house.ffxiv.cyou` 的可用性会直接影响查房结果
- 物品字典为静态文件，若游戏版本变更需要更新字典

## License

MIT
