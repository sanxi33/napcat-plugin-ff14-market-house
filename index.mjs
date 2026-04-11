import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

var EventType = ((EventType2) => {
  EventType2.MESSAGE = 'message';
  return EventType2;
})(EventType || {});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_CONFIG = {
  enabled: true,
  commandPrefix: '/',
  defaultServer: '猫小胖',
  requestTimeoutMs: 10000,
  itemDictPath: './data/item_dict.json'
};

const SERVER_ID_MAP = {
  '红玉海': 1167, '神意之地': 1081, '拉诺西亚': 1042, '幻影群岛': 1044, '萌芽池': 1060,
  '宇宙和音': 1173, '沃仙曦染': 1174, '晨曦王座': 1175, '白银乡': 1172, '白金幻象': 1076,
  '神拳痕': 1171, '潮风亭': 1170, '旅人栈桥': 1113, '拂晓之间': 1121, '龙巢神殿': 1166,
  '梦羽宝境': 1176, '紫水栈桥': 1043, '延夏': 1169, '静语庄园': 1106, '摩杜纳': 1045,
  '海猫茶屋': 1177, '柔风海湾': 1178, '琥珀原': 1179, '水晶塔': 1192, '银泪湖': 1183,
  '太阳海岸': 1180, '伊修加德': 1186, '红茶川': 1201
};

const AREA_MAP = { '海都': 0, '森都': 1, '沙都': 2, '白银': 3, '雪都': 4 };
const SIZE_MAP = { S: 0, M: 1, L: 2 };

export let plugin_config_ui = [];
let currentConfig = { ...DEFAULT_CONFIG };
let itemDict = null;
let logger = null;

function sanitizeConfig(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { ...DEFAULT_CONFIG };
  const out = { ...DEFAULT_CONFIG, ...raw };
  out.enabled = Boolean(out.enabled);
  out.commandPrefix = String(out.commandPrefix || '').trim();
  out.defaultServer = String(out.defaultServer || '猫小胖').trim();
  out.requestTimeoutMs = Math.max(1000, Math.min(30000, Number(out.requestTimeoutMs) || 10000));
  out.itemDictPath = String(out.itemDictPath || DEFAULT_CONFIG.itemDictPath).trim();
  return out;
}

function normalize(text) {
  return String(text || '').trim().toLowerCase().replace(/[！!。,.，？?；;：:“”"'`~·]/g, '').replace(/\s+/g, '');
}

function stripPrefix(text) {
  const trimmed = String(text || '').trim();
  if (!currentConfig.commandPrefix) return trimmed;
  if (trimmed.startsWith(currentConfig.commandPrefix)) return trimmed.slice(currentConfig.commandPrefix.length).trim();
  return trimmed;
}

function resolveItemDictPath() {
  if (path.isAbsolute(currentConfig.itemDictPath)) return currentConfig.itemDictPath;
  return path.resolve(__dirname, currentConfig.itemDictPath);
}

function parseItemDict() {
  try {
    const raw = fs.readFileSync(resolveItemDictPath(), 'utf-8').trim();
    const objectLiteral = raw.startsWith('{') ? raw : `{${raw}}`;
    itemDict = Function(`'use strict'; return (${objectLiteral});`)();
  } catch (error) {
    itemDict = {};
    logger?.warn('item_dict 加载失败', error);
  }
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), currentConfig.requestTimeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`http_${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

async function sendMsg(ctx, event, message) {
  const params = {
    message,
    message_type: event.message_type,
    ...(event.message_type === 'group' && event.group_id ? { group_id: String(event.group_id) } : {}),
    ...(event.message_type === 'private' && event.user_id ? { user_id: String(event.user_id) } : {})
  };
  await ctx.actions.call('send_msg', params, ctx.adapterName, ctx.pluginManager.config);
}

function parseMarketCommand(text) {
  const cleaned = stripPrefix(text);
  if (!normalize(cleaned).includes('查价')) return null;
  const rest = cleaned.slice(cleaned.indexOf('查价') + 2).trim();
  if (!rest) return { error: '格式：/查价 物品名 [服务器] [HQ]' };

  const parts = rest.split(/\s+/).filter(Boolean);
  const itemName = parts[0];
  let server = currentConfig.defaultServer || '猫小胖';
  let hq = false;

  for (const part of parts.slice(1)) {
    if (normalize(part) === 'hq') hq = true;
    else server = part;
  }
  return { itemName, server, hq };
}

function parseHouseCommand(text) {
  const cleaned = stripPrefix(text);
  if (!normalize(cleaned).includes('查房')) return null;
  const rest = cleaned.slice(cleaned.indexOf('查房') + 2).trim();
  const parts = rest.split(/\s+/).filter(Boolean);
  if (parts.length !== 3) return { error: '格式：/查房 服务器 主城(森都/海都/沙都/白银/雪都) 尺寸(S/M/L)' };
  return { server: parts[0], area: parts[1], size: parts[2].toUpperCase() };
}

async function handleMarket(ctx, event, cmd) {
  if (cmd.error) return sendMsg(ctx, event, cmd.error);
  const itemId = Number(itemDict?.[cmd.itemName] || -1);
  if (itemId < 0) return sendMsg(ctx, event, `没找到物品：${cmd.itemName}`);

  try {
    const data = await fetchJson(`https://universalis.app/api/${encodeURIComponent(cmd.server)}/${itemId}`);
    const lines = [];
    let count = 0;
    for (const row of data.listings || []) {
      if (cmd.hq && !row.hq) continue;
      lines.push(`${row.pricePerUnit}×${row.quantity}=${row.total} ${row.hq ? 'HQ' : ''} ${row.retainerName || ''}`.trim());
      count++;
      if (count >= 10) break;
    }
    if (!lines.length) return sendMsg(ctx, event, '未查询到数据（可能不可交易或当前无上架）');
    const ts = data.lastUploadTime
      ? new Date(Number(data.lastUploadTime)).toLocaleString('zh-CN', { hour12: false })
      : '未知';
    return sendMsg(ctx, event, `${cmd.server} 的 ${cmd.itemName}${cmd.hq ? '(HQ)' : ''}\n${lines.join('\n')}\n更新时间：${ts}`);
  } catch (error) {
    logger?.error('查价失败', error);
    return sendMsg(ctx, event, '查价失败，稍后再试');
  }
}

async function handleHouse(ctx, event, cmd) {
  if (cmd.error) return sendMsg(ctx, event, cmd.error);
  if (!SERVER_ID_MAP[cmd.server]) return sendMsg(ctx, event, `未知服务器：${cmd.server}`);
  if (AREA_MAP[cmd.area] === undefined) return sendMsg(ctx, event, `未知主城：${cmd.area}`);
  if (SIZE_MAP[cmd.size] === undefined) return sendMsg(ctx, event, `未知尺寸：${cmd.size}`);

  try {
    const url = `https://house.ffxiv.cyou/api/sales?server=${SERVER_ID_MAP[cmd.server]}&ts=${Math.floor(Date.now() / 1000)}`;
    const arr = await fetchJson(url);
    const out = [];
    for (const item of arr || []) {
      if (item.Area === AREA_MAP[cmd.area] && item.Size === SIZE_MAP[cmd.size]) {
        out.push(`${cmd.area}${(item.Slot || 0) + 1}区${item.ID}号，${cmd.size}，价格：${Math.floor((item.Price || 0) / 10000)}万`);
      }
    }
    if (!out.length) return sendMsg(ctx, event, '没有空房了');
    return sendMsg(ctx, event, out.slice(0, 20).join('\n'));
  } catch (error) {
    logger?.error('查房失败', error);
    return sendMsg(ctx, event, '查房失败，稍后再试');
  }
}

export const plugin_init = async (ctx) => {
  logger = ctx.logger;
  plugin_config_ui = ctx.NapCatConfig.combine(
    ctx.NapCatConfig.boolean('enabled', '启用插件', true, '总开关'),
    ctx.NapCatConfig.text('commandPrefix', '命令前缀', '/', '例如：/查价 魔晶石'),
    ctx.NapCatConfig.text('defaultServer', '默认服务器', '猫小胖', '查价默认服'),
    ctx.NapCatConfig.number('requestTimeoutMs', '请求超时(ms)', 10000, '1000-30000'),
    ctx.NapCatConfig.text('itemDictPath', '物品字典路径', DEFAULT_CONFIG.itemDictPath, '仓库内默认提供 ./data/item_dict.json')
  );
  try {
    if (ctx.configPath && fs.existsSync(ctx.configPath)) {
      currentConfig = sanitizeConfig(JSON.parse(fs.readFileSync(ctx.configPath, 'utf-8')));
    }
  } catch {}
  parseItemDict();
  logger?.info('ff14-market-house 已初始化');
};

export const plugin_onmessage = async (ctx, event) => {
  if (!currentConfig.enabled) return;
  if (event.post_type !== EventType.MESSAGE) return;
  const raw = String(event.raw_message || '').trim();
  if (!raw) return;

  const market = parseMarketCommand(raw);
  if (market) return handleMarket(ctx, event, market);

  const house = parseHouseCommand(raw);
  if (house) return handleHouse(ctx, event, house);
};

export const plugin_get_config = async () => currentConfig;
export const plugin_on_config_change = async (ctx, ui, key, value, cur) => {
  currentConfig = sanitizeConfig(cur);
  if (key === 'itemDictPath') parseItemDict();
};
export const plugin_onevent = async () => {};
export const plugin_cleanup = async () => {};
