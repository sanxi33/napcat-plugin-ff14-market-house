# napcat-plugin-ff14-market-house

在群里直接查 FF14 物价和空房。支持魔晶石价格查询、空地皮查询，不用切窗口开网页，QQ 里敲一条命令就出结果。

## 查价

```text
/查价 魔晶石
/查价 魔晶石 猫小胖 HQ
```

不写服务器就用配置里的默认值。

## 查房

```text
/查房 猫小胖 海都 S
/查房 猫小胖 森都 L
```

支持这些主城：海都、森都、沙都、白银、雪都。

## 安装

去 [Releases](https://github.com/sanxi33/napcat-plugin-ff14-market-house/releases) 下载 `napcat-plugin-ff14-market-house.zip`，然后在 NapCat 插件管理里导入启用就行。

首次运行会用下面这套默认配置，大部分情况改改 `commandPrefix` 和 `defaultServer` 就能用：

```json
{
  "enabled": true,
  "commandPrefix": "/",
  "defaultServer": "猫小胖",
  "requestTimeoutMs": 10000,
  "itemDictPath": "./data/item_dict.json"
}
```

NapCat 版本 ≥ 4.15.19 的话，点这个按钮能直接跳转到插件安装页：

<a href="https://napneko.github.io/napcat-plugin-index?pluginId=napcat-plugin-ff14-market-house" target="_blank">
  <img src="https://github.com/NapNeko/napcat-plugin-index/blob/pages/button.png?raw=true" alt="在 NapCat WebUI 中打开" width="170">
</a>

## 数据来源

- [Universalis](https://universalis.app/)：物价数据
- `house.ffxiv.cyou`：房屋数据

## 注意事项

插件依赖第三方的公开接口，上游接口变更时需要跟着更新。物品字典是静态文件，版本大更新后可能需要同步。

## License

MIT
