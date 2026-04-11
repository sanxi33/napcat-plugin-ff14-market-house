# napcat-plugin-ff14-market-house

一个为 NapCat 设计的 FF14 查价和查房插件。适合已经在群里打本、买房、查板子的玩家，想直接在 QQ 里问一句就拿到结果。

## 适用场景

- 查询某个物品在指定服务器的价格
- 查询某个服务器是否有空房
- 给自己常玩的服设置默认服务器

## 环境要求

- 已部署 NapCat，并了解如何导入插件包 (`.zip`)
- 已知常用服务器名称，例如 `猫小胖`
- 查房时需要知道主城名和房屋尺寸

支持的主城：

- `海都`
- `森都`
- `沙都`
- `白银`
- `雪都`

## 安装步骤

### 1. 下载插件

前往 [Releases](https://github.com/sanxi33/napcat-plugin-ff14-market-house/releases) 页面，下载最新版本的 `napcat-plugin-ff14-market-house.zip`。

### 2. 导入 NapCat

在 NapCat 的插件管理界面中导入 zip 文件，并启用插件。

### 3. 默认配置

插件首次运行将使用以下默认配置：

```json
{
  "enabled": true,
  "commandPrefix": "/",
  "defaultServer": "猫小胖",
  "requestTimeoutMs": 10000,
  "itemDictPath": "./data/item_dict.json"
}
```

大多数情况下只需要按需修改：

- `commandPrefix`
- `defaultServer`

## 使用方法

### 查价

```text
/查价 魔晶石
/查价 魔晶石 猫小胖 HQ
```

如果命令里没写服务器，就会使用 `defaultServer`。

### 查房

```text
/查房 猫小胖 海都 S
/查房 猫小胖 森都 L
```

## 验证安装

发送以下任意一条命令测试插件是否正常工作：

```text
/查价 魔晶石
/查房 猫小胖 海都 S
```

只要有一条正常返回，就说明插件已经基本可用。

## 快捷安装链接

NapCat 版本 ≥ `4.15.19` 时，可点击下方按钮快速跳转至插件安装页面：

<a href="https://napneko.github.io/napcat-plugin-index?pluginId=napcat-plugin-ff14-market-house" target="_blank">
  <img src="https://github.com/NapNeko/napcat-plugin-index/blob/pages/button.png?raw=true" alt="在 NapCat WebUI 中打开" width="170">
</a>

## 数据来源

- [Universalis](https://universalis.app/)：物价查询
- `house.ffxiv.cyou`：房屋查询

## 已知限制

- 插件依赖第三方公开接口，上游变更时可能需要调整
- `house.ffxiv.cyou` 的可用性会直接影响查房结果
- 物品字典是静态文件，游戏版本大变动时可能需要更新

## License

MIT
