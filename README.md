# napcat-plugin-ff14-market-house

一个给 NapCat 用的 FF14 查价和查房插件。适合已经在群里打本、买房、查板子的玩家，想直接在 QQ 里问一句就拿到结果。

## 这份 README 默认把你当作

- 已经装好了 NapCat，会导入插件 zip
- 会在群里发命令，但不想研究源码
- 只想先查价、查房，不想先配很多东西

## 这个插件适合谁

适合：

- 想在群里快速查物价
- 想查某个服务器有没有空房
- 想把默认服务器固定成自己常玩的服

不太适合：

- 想做复杂行情统计的人
- 不知道自己要查哪个服务器的人

## 装之前要准备什么

这个插件开箱已经能用，不需要 API Key。

你最好先知道：

- 你常查的服务器名，比如 `猫小胖`
- 查房时要填的主城名，比如 `海都 / 森都 / 沙都 / 白银 / 雪都`
- 房屋尺寸 `S / M / L`

## 安装

### 1. 下载插件

从 [Releases](https://github.com/sanxi33/napcat-plugin-ff14-market-house/releases) 下载：

- `napcat-plugin-ff14-market-house.zip`

### 2. 导入 NapCat

在 NapCat 插件管理里导入 zip，并启用插件。

### 3. 先填一个你最常用的服务器

推荐第一次只改这一个配置：

- `defaultServer`

默认配置如下：

```json
{
  "enabled": true,
  "commandPrefix": "球鳖",
  "defaultServer": "猫小胖",
  "requestTimeoutMs": 10000,
  "itemDictPath": "./data/item_dict.json"
}
```

普通用户最常改的只有：

- `commandPrefix`
- `defaultServer`

`itemDictPath` 一般不要动，保持默认即可。

## 怎么用

### 查价

格式：

```text
球鳖 查价 物品名 [服务器] [HQ]
```

示例：

```text
球鳖 查价 魔晶石
球鳖 查价 魔晶石 猫小胖 HQ
```

说明：

- 如果你没写服务器，就会用 `defaultServer`
- `HQ` 是可选项

### 查房

格式：

```text
球鳖 查房 服务器 主城 尺寸
```

示例：

```text
球鳖 查房 猫小胖 海都 S
球鳖 查房 猫小胖 森都 L
```

支持的主城：

- `海都`
- `森都`
- `沙都`
- `白银`
- `雪都`

## 第一次怎么确认自己装好了

先发这两条里任意一条：

```text
球鳖 查价 魔晶石
球鳖 查房 猫小胖 海都 S
```

只要能正常返回，就说明插件已经基本可用。

## 一键跳到 NapCat WebUI 安装页

如果你的 NapCat 版本是 `4.15.19` 或更高，可以直接点下面按钮跳到插件安装界面：

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
