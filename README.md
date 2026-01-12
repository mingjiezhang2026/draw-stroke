# 一笔画完 - 微信小程序

一个单机益智解谜类微信小程序游戏，玩家需要用一条连续线连接所有节点，不能重复经过。

## 功能特性

- ✅ 核心游戏玩法（一笔画完所有节点）
- ✅ Canvas 2D 绘制（节点、路径、动画）
- ✅ 触摸交互（拖动连线）
- ✅ 关卡系统（JSON配置，可扩展）
- ✅ 本地存储（进度保存）
- ✅ 提示系统（每关一次）
- ✅ 回退功能
- ✅ 成功/失败判定

## 项目结构

```
draw-stroke/
├── app.js                 # 小程序入口
├── app.json              # 小程序配置
├── app.wxss              # 全局样式
├── pages/
│   ├── index/            # 首页
│   │   ├── index.js
│   │   ├── index.wxml
│   │   └── index.wxss
│   └── game/             # 游戏页
│       ├── game.js
│       ├── game.wxml
│       └── game.wxss
├── utils/
│   ├── gameEngine.js     # 核心游戏引擎（路径校验、通关判定）
│   ├── levelEngine.js    # 关卡引擎（加载、校验）
│   ├── canvasDrawer.js   # Canvas绘制模块
│   └── storage.js        # 本地存储管理
└── data/
    └── levels.json       # 关卡数据（JSON配置）
```

## 核心模块说明

### 1. GameEngine (gameEngine.js)

核心游戏逻辑引擎，负责：
- 路径合法性校验
- 通关判定
- 死路检测
- 回退功能
- 提示算法

### 2. LevelEngine (levelEngine.js)

关卡管理系统，负责：
- 关卡数据加载
- 关卡配置校验
- 可解性验证

### 3. CanvasDrawer (canvasDrawer.js)

Canvas绘制模块，负责：
- 节点绘制
- 路径绘制
- 成功/失败动画
- 坐标转换

### 4. Storage (storage.js)

本地存储管理：
- 关卡进度
- 游戏设置
- 提示使用记录

## 关卡数据格式

```json
{
  "levelId": 1,
  "gridSize": [3, 3],
  "startNode": 1,
  "nodes": [
    {"id": 1, "x": 0, "y": 0},
    {"id": 2, "x": 0, "y": 1}
  ],
  "edges": [
    {"from": 1, "to": 2, "bidirectional": true}
  ],
  "targetNodes": [1, 2],
  "rules": {
    "allowBack": true
  }
}
```

## 开发说明

1. **技术栈**：微信小程序原生框架 + Canvas 2D API
2. **开发工具**：微信开发者工具
3. **兼容性**：支持微信小程序基础库 2.19.4+

## 运行项目

1. 使用微信开发者工具打开项目
2. 配置 AppID（可使用测试号）
3. 编译运行

## 后续扩展

- [ ] 更多关卡（100+）
- [ ] 每日一关
- [ ] 音效系统
- [ ] 广告接入
- [ ] 主题皮肤
- [ ] 排行榜（可选）

## 许可证

MIT

