// game.js - 微信小游戏入口文件
// 一笔画完小游戏 - 精美UI版本

const GameEngine = require('./utils/gameEngine.js');
const levelEngine = require('./utils/levelEngine.js');
const storage = require('./utils/storage.js');

// 获取系统信息
const systemInfo = wx.getSystemInfoSync();
const screenWidth = systemInfo.windowWidth;
const screenHeight = systemInfo.windowHeight;
const dpr = systemInfo.pixelRatio || 2; // 像素比，用于高清屏幕
const safeAreaTop = systemInfo.safeArea ? systemInfo.safeArea.top : 0; // 安全区域顶部

// rpx转px
const rpx = (value) => value * screenWidth / 750;

// 创建画布 - 高DPI支持
const canvas = wx.createCanvas();
const ctx = canvas.getContext('2d');

// 设置Canvas为高清模式
canvas.width = screenWidth * dpr;
canvas.height = screenHeight * dpr;
ctx.scale(dpr, dpr); // 缩放绑定上下文，让绑制坐标仍使用逻辑像素

// 初始化存储
storage.init();

// ========== 游戏状态 ==========
let currentLevelId = storage.getCurrentLevel() || 1;
let gameEngine = null;
let levelConfig = null;
let gameStatus = 'loading'; // loading | menu | playing | success | fail
let isDrawing = false;
let lastTouchNode = null;
let hintNode = null;
let hintUsed = false;
let musicEnabled = true;
let loadingProgress = 0;
let loadingText = '正在加载...';

// ========== 按压状态 ==========
let pressedButton = null;
let touchStartPos = null;

// ========== 颜色主题 (明亮清新风格) ==========
const colors = {
  bgTop: '#4A90A4',      // 清新蓝绿色
  bgMiddle: '#5BA3B5',   // 明亮蓝色
  bgBottom: '#6DB5C7',   // 浅蓝色
  
  nodeDefault: '#7BC4D4',
  nodeDefaultBorder: '#9DD5E1',
  nodeVisited: '#FF6B8A',
  nodeStart: '#FFD93D',
  nodeStartGlow: 'rgba(255, 217, 61, 0.4)',
  
  edgeDefault: '#8ECFDE',
  edgeVisited: '#FF6B8A',
  edgeHint: '#6DD5A0',
  
  text: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.85)',
  textMuted: 'rgba(255, 255, 255, 0.65)',
  textHint: 'rgba(255, 255, 255, 0.55)',
  
  primary: '#FF6B8A',
  primaryLight: '#FF8FA5',
  accent: '#FFD93D',
  success: '#6DD5A0',
  
  cardBg: 'rgba(255, 255, 255, 0.15)',
  cardBorder: 'rgba(255, 255, 255, 0.25)',
  buttonBg: 'rgba(255, 255, 255, 0.2)',
  buttonBgPressed: 'rgba(255, 255, 255, 0.35)',
  
  hintBg: 'rgba(255, 217, 61, 0.25)',
  hintBorder: 'rgba(255, 217, 61, 0.45)',
  undoBg: 'rgba(109, 213, 160, 0.25)',
  undoBorder: 'rgba(109, 213, 160, 0.45)',
  
  loadingBg: '#4A90A4',
  loadingBarBg: 'rgba(255, 255, 255, 0.2)',
  loadingBarFill: '#FFD93D'
};

// ========== UI尺寸 ==========
const ui = {
  nodeRadius: rpx(28),
  touchRadius: rpx(60),
  circleBtn: rpx(100),      // 顶部圆形按钮（返回、音乐）
  actionBtn: rpx(130),      // 提示/撤销按钮 - 再加大
  mainBtn: rpx(160),        // 重新开始按钮 - 再加大
  iconSize: rpx(64),        // 图标尺寸 - 再加大
  mainIconSize: rpx(80)     // 主图标尺寸 - 再加大
};

// ========== 游戏区域 ==========
let canvasArea = {};
let nodePositions = {};

// ========== 音频管理 ==========
let menuBgm = null;
let gameBgm = null;
let currentBgmType = null;

function initAudio() {
  const settings = storage.getSettings();
  musicEnabled = settings.music !== false;
}

function createAudio(src) {
  try {
    const audio = wx.createInnerAudioContext();
    audio.src = src;
    audio.loop = true;
    audio.volume = 0.5;
    audio.obeyMuteSwitch = false;
    return audio;
  } catch (e) {
    return null;
  }
}

function playMenuBgm() {
  if (!musicEnabled) return;
  if (currentBgmType === 'menu') return;
  
  if (gameBgm) { gameBgm.pause(); gameBgm.seek(0); }
  if (!menuBgm) { menuBgm = createAudio('subpackages/audio/menu_bgm.mp3'); }
  if (menuBgm) { menuBgm.play(); currentBgmType = 'menu'; }
}

function playGameBgm() {
  if (!musicEnabled) return;
  if (currentBgmType === 'game') return;
  
  if (menuBgm) { menuBgm.pause(); menuBgm.seek(0); }
  if (!gameBgm) { gameBgm = createAudio('subpackages/audio/game_bgm.mp3'); }
  if (gameBgm) { gameBgm.play(); currentBgmType = 'game'; }
}

function stopAllBgm() {
  if (menuBgm) { menuBgm.pause(); menuBgm.seek(0); }
  if (gameBgm) { gameBgm.pause(); gameBgm.seek(0); }
  currentBgmType = null;
}

function toggleMusic() {
  musicEnabled = !musicEnabled;
  storage.updateSettings({ music: musicEnabled });
  
  if (musicEnabled) {
    gameStatus === 'menu' ? playMenuBgm() : playGameBgm();
  } else {
    stopAllBgm();
  }
  render();
}

// ========== 绘制辅助函数 ==========

function drawGradientBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, screenHeight);
  gradient.addColorStop(0, colors.bgTop);
  gradient.addColorStop(0.5, colors.bgMiddle);
  gradient.addColorStop(1, colors.bgBottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, screenWidth, screenHeight);
}

function drawDecorationCircles() {
  ctx.beginPath();
  ctx.arc(screenWidth + rpx(40), rpx(-50), rpx(150), 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(233, 69, 96, 0.1)';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(rpx(-30), screenHeight * 0.4, rpx(100), 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 215, 0, 0.1)';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(screenWidth + rpx(25), screenHeight * 0.85, rpx(125), 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(76, 175, 80, 0.1)';
  ctx.fill();
}

function drawRoundRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

function drawText(text, x, y, options = {}) {
  const { size = rpx(32), color = colors.text, align = 'center', baseline = 'middle', weight = 'normal', shadow = false } = options;
  
  ctx.save();
  
  // 使用更清晰的字体
  ctx.font = `${weight} ${Math.round(size)}px "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  
  // 可选的文字阴影增强可读性
  if (shadow) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
  }
  
  ctx.fillText(text, x, y);
  ctx.restore();
}

// ========== 图标绘制（Canvas路径替代SVG）==========

function drawIconArrowLeft(x, y, size, color = '#FFFFFF') {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.12;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  const s = size * 0.6;  // 放大图标
  // 箭头
  ctx.beginPath();
  ctx.moveTo(x + s * 0.3, y - s * 0.5);
  ctx.lineTo(x - s * 0.3, y);
  ctx.lineTo(x + s * 0.3, y + s * 0.5);
  ctx.stroke();
  
  // 横线
  ctx.beginPath();
  ctx.moveTo(x - s * 0.3, y);
  ctx.lineTo(x + s * 0.6, y);
  ctx.stroke();
  
  ctx.restore();
}

function drawIconVolumeOn(x, y, size, color = '#FFFFFF') {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = size * 0.1;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  const s = size * 0.55;  // 放大图标
  
  // 喇叭
  ctx.beginPath();
  ctx.moveTo(x - s * 0.3, y - s * 0.3);
  ctx.lineTo(x - s * 0.6, y - s * 0.3);
  ctx.lineTo(x - s * 0.6, y + s * 0.3);
  ctx.lineTo(x - s * 0.3, y + s * 0.3);
  ctx.lineTo(x + s * 0.1, y + s * 0.6);
  ctx.lineTo(x + s * 0.1, y - s * 0.6);
  ctx.closePath();
  ctx.fill();
  
  // 声波
  ctx.beginPath();
  ctx.arc(x + s * 0.2, y, s * 0.35, -Math.PI * 0.4, Math.PI * 0.4);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(x + s * 0.2, y, s * 0.6, -Math.PI * 0.4, Math.PI * 0.4);
  ctx.stroke();
  
  ctx.restore();
}

function drawIconVolumeOff(x, y, size, color = '#FFFFFF') {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = size * 0.1;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  const s = size * 0.55;  // 放大图标
  
  // 喇叭
  ctx.beginPath();
  ctx.moveTo(x - s * 0.3, y - s * 0.3);
  ctx.lineTo(x - s * 0.6, y - s * 0.3);
  ctx.lineTo(x - s * 0.6, y + s * 0.3);
  ctx.lineTo(x - s * 0.3, y + s * 0.3);
  ctx.lineTo(x + s * 0.1, y + s * 0.6);
  ctx.lineTo(x + s * 0.1, y - s * 0.6);
  ctx.closePath();
  ctx.fill();
  
  // X号
  ctx.beginPath();
  ctx.moveTo(x + s * 0.3, y - s * 0.3);
  ctx.lineTo(x + s * 0.7, y + s * 0.3);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(x + s * 0.7, y - s * 0.3);
  ctx.lineTo(x + s * 0.3, y + s * 0.3);
  ctx.stroke();
  
  ctx.restore();
}

function drawIconLightbulb(x, y, size, color = '#FFD700') {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.1;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  const s = size * 0.55;  // 放大图标
  
  // 灯泡上半部分
  ctx.beginPath();
  ctx.arc(x, y - s * 0.15, s * 0.5, Math.PI * 0.8, Math.PI * 0.2, true);
  ctx.stroke();
  
  // 灯泡下部连接
  ctx.beginPath();
  ctx.moveTo(x - s * 0.3, y + s * 0.25);
  ctx.lineTo(x - s * 0.3, y + s * 0.05);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(x + s * 0.3, y + s * 0.25);
  ctx.lineTo(x + s * 0.3, y + s * 0.05);
  ctx.stroke();
  
  // 底部横线
  ctx.beginPath();
  ctx.moveTo(x - s * 0.25, y + s * 0.4);
  ctx.lineTo(x + s * 0.25, y + s * 0.4);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(x - s * 0.2, y + s * 0.6);
  ctx.lineTo(x + s * 0.2, y + s * 0.6);
  ctx.stroke();
  
  ctx.restore();
}

function drawIconRefresh(x, y, size, color = '#FFFFFF') {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.12;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  const s = size * 0.55;  // 放大图标
  
  // 上半圆弧带箭头
  ctx.beginPath();
  ctx.arc(x, y, s * 0.5, -Math.PI * 0.8, Math.PI * 0.1);
  ctx.stroke();
  
  // 上箭头
  ctx.beginPath();
  ctx.moveTo(x + s * 0.5, y - s * 0.3);
  ctx.lineTo(x + s * 0.5, y + s * 0.1);
  ctx.lineTo(x + s * 0.2, y - s * 0.1);
  ctx.stroke();
  
  // 下半圆弧带箭头
  ctx.beginPath();
  ctx.arc(x, y, s * 0.5, Math.PI * 0.2, Math.PI * 1.1);
  ctx.stroke();
  
  // 下箭头
  ctx.beginPath();
  ctx.moveTo(x - s * 0.5, y + s * 0.3);
  ctx.lineTo(x - s * 0.5, y - s * 0.1);
  ctx.lineTo(x - s * 0.2, y + s * 0.1);
  ctx.stroke();
  
  ctx.restore();
}

function drawIconUndo(x, y, size, color = '#81C784') {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.1;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  const s = size * 0.55;  // 放大图标
  
  // 箭头
  ctx.beginPath();
  ctx.moveTo(x - s * 0.5, y - s * 0.1);
  ctx.lineTo(x - s * 0.5, y + s * 0.4);
  ctx.lineTo(x - s * 0.1, y + s * 0.4);
  ctx.stroke();
  
  // 弧线
  ctx.beginPath();
  ctx.arc(x + s * 0.1, y, s * 0.5, Math.PI * 1.2, Math.PI * 0.3, true);
  ctx.stroke();
  
  ctx.restore();
}

// ========== 按钮绘制 ==========

function drawCircleIconButton(x, y, radius, iconType, buttonId, isActive = true) {
  const isPressed = pressedButton === buttonId;
  const scale = isPressed ? 0.92 : 1;
  const actualRadius = radius * scale;
  
  ctx.save();
  
  ctx.fillStyle = isPressed ? colors.buttonBgPressed : (isActive ? colors.buttonBg : 'rgba(255, 255, 255, 0.05)');
  ctx.beginPath();
  ctx.arc(x, y, actualRadius, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.globalAlpha = isActive ? 1 : 0.5;
  const iconSize = ui.iconSize * scale;
  
  switch (iconType) {
    case 'arrowLeft': drawIconArrowLeft(x, y, iconSize); break;
    case 'volumeOn': drawIconVolumeOn(x, y, iconSize); break;
    case 'volumeOff': drawIconVolumeOff(x, y, iconSize); break;
  }
  
  ctx.restore();
}

function drawPrimaryButton(x, y, width, height, text, buttonId) {
  const isPressed = pressedButton === buttonId;
  const scale = isPressed ? 0.98 : 1;
  const offsetY = isPressed ? rpx(2) : 0;
  
  ctx.save();
  
  const actualX = x + (width * (1 - scale)) / 2;
  const actualY = y + offsetY;
  const actualW = width * scale;
  const actualH = height * scale;
  
  ctx.shadowColor = 'rgba(255, 107, 138, 0.4)';
  ctx.shadowBlur = isPressed ? rpx(10) : rpx(20);
  ctx.shadowOffsetY = isPressed ? rpx(4) : rpx(8);
  
  const gradient = ctx.createLinearGradient(actualX, actualY, actualX + actualW, actualY + actualH);
  gradient.addColorStop(0, colors.primary);
  gradient.addColorStop(1, colors.primaryLight);
  ctx.fillStyle = gradient;
  
  drawRoundRect(actualX, actualY, actualW, actualH, actualH / 2);
  ctx.fill();
  
  ctx.restore();
  
  drawText(text, x + width / 2, y + height / 2 + offsetY, { size: rpx(34), weight: '600' });
  drawText('→', x + width - rpx(50), y + height / 2 + offsetY, { size: rpx(36), color: 'rgba(255, 255, 255, 0.8)' });
}

function drawSecondaryButton(x, y, width, height, text, buttonId) {
  const isPressed = pressedButton === buttonId;
  const scale = isPressed ? 0.98 : 1;
  
  const actualX = x + (width * (1 - scale)) / 2;
  const actualW = width * scale;
  const actualH = height * scale;
  
  ctx.fillStyle = isPressed ? colors.buttonBgPressed : colors.buttonBg;
  drawRoundRect(actualX, y, actualW, actualH, actualH / 2);
  ctx.fill();
  
  ctx.strokeStyle = colors.cardBorder;
  ctx.lineWidth = 1;
  ctx.stroke();
  
  drawText(text, x + width / 2, y + height / 2, { size: rpx(28), color: colors.textSecondary });
}

function drawActionButton(centerX, centerY, radius, iconType, label, bgColor, borderColor, buttonId, disabled = false) {
  const isPressed = pressedButton === buttonId && !disabled;
  const scale = isPressed ? 0.92 : 1;
  const actualRadius = radius * scale;
  
  ctx.save();
  
  if (disabled) ctx.globalAlpha = 0.35;
  
  ctx.fillStyle = isPressed ? 'rgba(255, 255, 255, 0.25)' : bgColor;
  ctx.beginPath();
  ctx.arc(centerX, centerY, actualRadius, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = rpx(2);
  ctx.stroke();
  
  const iconSize = ui.iconSize * scale;
  switch (iconType) {
    case 'lightbulb': drawIconLightbulb(centerX, centerY, iconSize); break;
    case 'undo': drawIconUndo(centerX, centerY, iconSize); break;
  }
  
  ctx.restore();
  
  ctx.save();
  if (disabled) ctx.globalAlpha = 0.35;
  drawText(label, centerX, centerY + radius + rpx(20), { size: rpx(22), color: colors.textSecondary, weight: '400' });
  ctx.restore();
}

function drawMainActionButton(centerX, centerY, radius, iconType, label, buttonId) {
  const isPressed = pressedButton === buttonId;
  const scale = isPressed ? 0.92 : 1;
  const actualRadius = radius * scale;
  const offsetY = isPressed ? rpx(2) : 0;
  
  ctx.save();
  
  ctx.shadowColor = 'rgba(255, 107, 138, 0.5)';
  ctx.shadowBlur = isPressed ? rpx(8) : rpx(15);
  ctx.shadowOffsetY = isPressed ? rpx(3) : rpx(6);
  
  const gradient = ctx.createLinearGradient(
    centerX - actualRadius, centerY - actualRadius + offsetY,
    centerX + actualRadius, centerY + actualRadius + offsetY
  );
  gradient.addColorStop(0, colors.primary);
  gradient.addColorStop(1, colors.primaryLight);
  ctx.fillStyle = gradient;
  
  ctx.beginPath();
  ctx.arc(centerX, centerY + offsetY, actualRadius, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
  
  const iconSize = ui.mainIconSize * scale;
  if (iconType === 'refresh') {
    drawIconRefresh(centerX, centerY + offsetY, iconSize);
  }
  
  drawText(label, centerX, centerY + radius + rpx(20) + offsetY, { 
    size: rpx(22), color: 'rgba(255, 255, 255, 0.85)', weight: '500' 
  });
}

// ========== 菜单页面 ==========

function drawMenuMusicButton() {
  const x = screenWidth - rpx(85);
  const y = safeAreaTop + rpx(80);  // 根据安全区域调整
  const iconType = musicEnabled ? 'volumeOn' : 'volumeOff';
  drawCircleIconButton(x, y, rpx(50), iconType, 'menuMusic', true);
}

function drawLogo() {
  const logoX = screenWidth / 2;
  const logoY = screenHeight * 0.2;
  
  ctx.save();
  const iconSize = rpx(80);
  
  ctx.strokeStyle = colors.primary;
  ctx.lineWidth = rpx(6);
  ctx.lineCap = 'round';
  
  ctx.beginPath();
  ctx.moveTo(logoX - iconSize * 0.5, logoY - iconSize * 0.3);
  ctx.lineTo(logoX + iconSize * 0.2, logoY + iconSize * 0.3);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(logoX - iconSize * 0.3, logoY + iconSize * 0.4);
  ctx.lineTo(logoX + iconSize * 0.5, logoY - iconSize * 0.2);
  ctx.stroke();
  
  const nodes = [
    { x: logoX - iconSize * 0.5, y: logoY - iconSize * 0.3, color: colors.accent },
    { x: logoX + iconSize * 0.5, y: logoY - iconSize * 0.2, color: colors.primary },
    { x: logoX - iconSize * 0.3, y: logoY + iconSize * 0.4, color: colors.accent }
  ];
  
  nodes.forEach(node => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, rpx(10), 0, Math.PI * 2);
    ctx.fillStyle = node.color;
    ctx.fill();
  });
  
  ctx.restore();
  
  drawText('一笔连线趣', logoX, logoY + rpx(100), { size: rpx(64), weight: '700' });
  drawText('One Stroke', logoX, logoY + rpx(150), { size: rpx(28), color: 'rgba(255, 255, 255, 0.5)' });
}

function drawLevelCard() {
  const cardWidth = rpx(500);
  const cardHeight = rpx(240);  // 增加卡片高度
  const cardX = (screenWidth - cardWidth) / 2;
  const cardY = screenHeight * 0.40;  // 略微上移
  
  ctx.fillStyle = colors.cardBg;
  drawRoundRect(cardX, cardY, cardWidth, cardHeight, rpx(24));
  ctx.fill();
  
  ctx.strokeStyle = colors.cardBorder;
  ctx.lineWidth = rpx(1);
  ctx.stroke();
  
  // 居中显示当前关卡
  drawText('当前关卡', cardX + cardWidth / 2, cardY + rpx(50), { size: rpx(28), color: colors.textSecondary });
  drawText(String(currentLevelId), cardX + cardWidth / 2, cardY + rpx(110), { size: rpx(72), weight: '700', color: colors.primary });
  
  const passedLevels = storage.getPassedLevels();
  const totalLevels = levelEngine.getTotalLevels();
  const progress = totalLevels > 0 ? passedLevels.length / totalLevels : 0;
  
  const barWidth = cardWidth - rpx(80);
  const barHeight = rpx(12);
  const barX = cardX + rpx(40);
  const barY = cardY + rpx(170);  // 调整进度条位置
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  drawRoundRect(barX, barY, barWidth, barHeight, barHeight / 2);
  ctx.fill();
  
  if (progress > 0) {
    const gradient = ctx.createLinearGradient(barX, barY, barX + barWidth * progress, barY);
    gradient.addColorStop(0, colors.primary);
    gradient.addColorStop(1, colors.primaryLight);
    ctx.fillStyle = gradient;
    drawRoundRect(barX, barY, Math.max(barWidth * progress, barHeight), barHeight, barHeight / 2);
    ctx.fill();
  }
  
  // 已通关文案位置调整，留足间距
  drawText(`已通关 ${passedLevels.length} / ${totalLevels} 关`, cardX + cardWidth / 2, cardY + rpx(210), { size: rpx(24), color: colors.textMuted });
}

function drawMenu() {
  drawGradientBackground();
  drawDecorationCircles();
  drawMenuMusicButton();
  drawLogo();
  drawLevelCard();
  
  const btnWidth = rpx(500);
  const btnHeight = rpx(110);
  const btnX = (screenWidth - btnWidth) / 2;
  const btnY = screenHeight * 0.68;
  drawPrimaryButton(btnX, btnY, btnWidth, btnHeight, '开始游戏', 'menuStart');
  
  drawText('一笔画完所有路径，每条线只能走一次', screenWidth / 2, screenHeight - rpx(80), { size: rpx(24), color: colors.textHint });
  
  playMenuBgm();
}

// ========== 游戏页面 ==========

function calculateGameArea() {
  const headerH = safeAreaTop + rpx(140);  // 考虑安全区域
  const footerH = rpx(340);  // 适应更大的底部按钮
  const padding = rpx(30);
  
  const availableHeight = screenHeight - headerH - footerH;
  const size = Math.min(availableHeight - padding * 2, screenWidth - padding * 2);
  
  canvasArea = {
    x: (screenWidth - size) / 2,
    y: headerH + (availableHeight - size) / 2,
    width: size,
    height: size
  };
}

function calculateNodePositions() {
  if (!levelConfig) return;
  
  const [gridCols, gridRows] = levelConfig.gridSize || [4, 4];
  const innerPadding = rpx(60);
  const size = Math.min(canvasArea.width, canvasArea.height) - innerPadding * 2;
  
  const cellWidth = size / (gridCols - 1 || 1);
  const cellHeight = size / (gridRows - 1 || 1);
  
  const offsetX = canvasArea.x + innerPadding;
  const offsetY = canvasArea.y + innerPadding;
  
  nodePositions = {};
  levelConfig.nodes.forEach(node => {
    nodePositions[node.id] = {
      x: offsetX + node.x * cellWidth,
      y: offsetY + node.y * cellHeight
    };
  });
}

function findNodeByPosition(x, y) {
  if (!levelConfig) return null;
  
  for (let node of levelConfig.nodes) {
    const pos = nodePositions[node.id];
    if (!pos) continue;
    const dx = x - pos.x;
    const dy = y - pos.y;
    if (Math.sqrt(dx * dx + dy * dy) <= ui.touchRadius) {
      return node.id;
    }
  }
  return null;
}

function drawGameHeader() {
  const y = safeAreaTop + rpx(60);  // 根据安全区域调整
  const btnRadius = rpx(45);  // 加大按钮半径
  
  drawCircleIconButton(rpx(80), y, btnRadius, 'arrowLeft', 'gameBack', true);
  
  const badgeWidth = rpx(160);
  const badgeHeight = rpx(52);
  const badgeX = (screenWidth - badgeWidth) / 2;
  const badgeY = y - badgeHeight / 2;
  
  ctx.save();
  ctx.shadowColor = 'rgba(255, 107, 138, 0.4)';
  ctx.shadowBlur = rpx(12);
  ctx.shadowOffsetY = rpx(4);
  
  const gradient = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeWidth, badgeY + badgeHeight);
  gradient.addColorStop(0, colors.primary);
  gradient.addColorStop(1, colors.primaryLight);
  ctx.fillStyle = gradient;
  
  drawRoundRect(badgeX, badgeY, badgeWidth, badgeHeight, rpx(26));
  ctx.fill();
  ctx.restore();
  
  drawText(`Level ${currentLevelId}`, screenWidth / 2, y, { size: rpx(28), weight: '600' });
  
  const musicIconType = musicEnabled ? 'volumeOn' : 'volumeOff';
  drawCircleIconButton(screenWidth - rpx(80), y, btnRadius, musicIconType, 'gameMusic', musicEnabled);
}

function drawCanvasWrapper() {
  const wrapperPadding = rpx(20);
  const wrapperX = canvasArea.x - wrapperPadding;
  const wrapperY = canvasArea.y - wrapperPadding;
  const wrapperW = canvasArea.width + wrapperPadding * 2;
  const wrapperH = canvasArea.height + wrapperPadding * 2;
  
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = rpx(30);
  ctx.shadowOffsetY = rpx(10);
  
  ctx.fillStyle = colors.cardBg;
  drawRoundRect(wrapperX, wrapperY, wrapperW, wrapperH, rpx(32));
  ctx.fill();
  
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = rpx(2);
  ctx.stroke();
  ctx.restore();
  
  ctx.fillStyle = 'rgba(0, 60, 80, 0.5)';  // 半透明深色，与明亮背景形成对比
  drawRoundRect(canvasArea.x, canvasArea.y, canvasArea.width, canvasArea.height, rpx(24));
  ctx.fill();
}

function getEdgeKey(from, to) {
  return from < to ? `${from}-${to}` : `${to}-${from}`;
}

function drawEdge(fromNodeId, toNodeId, isVisited, isHint = false, isAvailable = false) {
  const fromPos = nodePositions[fromNodeId];
  const toPos = nodePositions[toNodeId];
  if (!fromPos || !toPos) return;

  ctx.save();
  
  if (isHint) {
    // 提示边 - 绿色高亮
    ctx.strokeStyle = colors.success;
    ctx.lineWidth = rpx(8);
    ctx.shadowColor = colors.success;
    ctx.shadowBlur = rpx(12);
  } else if (isVisited) {
    // 已走过的边 - 红色实线
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = rpx(8);
    ctx.shadowColor = colors.primary;
    ctx.shadowBlur = rpx(10);
  } else if (isAvailable) {
    // 可以走的边 - 亮色虚线
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = rpx(5);
    ctx.setLineDash([rpx(10), rpx(6)]);
  } else {
    // 未走过的边 - 暗色虚线
    ctx.strokeStyle = colors.edgeDefault;
    ctx.lineWidth = rpx(4);
    ctx.setLineDash([rpx(8), rpx(6)]);
  }
  
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(fromPos.x, fromPos.y);
  ctx.lineTo(toPos.x, toPos.y);
  ctx.stroke();
  
  ctx.restore();
}

function drawNode(nodeId, isInPath, isStart, isHintNode, isCurrent) {
  const pos = nodePositions[nodeId];
  if (!pos) return;

  ctx.save();
  const radius = ui.nodeRadius;
  
  // 当前位置特效
  if (isCurrent) {
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius + rpx(15), 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(233, 69, 96, 0.25)';
    ctx.fill();
  }
  
  // 起点发光
  if (isStart && !isInPath) {
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius + rpx(10), 0, Math.PI * 2);
    ctx.fillStyle = colors.nodeStartGlow;
    ctx.fill();
  }
  
  // 提示节点发光
  if (isHintNode) {
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius + rpx(14), 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(76, 175, 80, 0.3)';
    ctx.fill();
  }
  
  // 节点主体
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
  
  if (isStart) {
    ctx.fillStyle = colors.accent;
    ctx.shadowColor = colors.accent;
    ctx.shadowBlur = rpx(15);
  } else if (isInPath) {
    ctx.fillStyle = colors.primary;
    ctx.shadowColor = colors.primary;
    ctx.shadowBlur = rpx(10);
  } else if (isHintNode) {
    ctx.fillStyle = colors.success;
  } else {
    ctx.fillStyle = colors.nodeDefault;
  }
  ctx.fill();
  
  ctx.shadowBlur = 0;
  ctx.lineWidth = rpx(3);
  ctx.strokeStyle = isStart ? '#FFF8DC' : isInPath ? '#FF8A9B' : colors.nodeDefaultBorder;
  ctx.stroke();
  
  // 起点中心标记
  if (isStart && !isInPath) {
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, rpx(6), 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
  }
  
  // 在节点上显示ID
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${Math.round(rpx(22))}px "PingFang SC", "Helvetica Neue", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // 添加文字描边使其更清晰
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.lineWidth = 2;
  ctx.strokeText(String(nodeId), pos.x, pos.y);
  ctx.fillText(String(nodeId), pos.x, pos.y);
  
  ctx.restore();
}

function drawGameFooter(state) {
  const footerY = screenHeight - rpx(280);  // 增加底部区域高度
  const footerH = rpx(320);  // 增加高度适应更大按钮
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  drawRoundRect(0, footerY, screenWidth, footerH, rpx(40));
  ctx.fill();
  
  const btnY = footerY + rpx(110);  // 调整按钮垂直位置
  const centerX = screenWidth / 2;
  const spacing = rpx(180);  // 增加按钮间距
  
  drawActionButton(
    centerX - spacing, btnY, 
    ui.actionBtn / 2, 'lightbulb', '提示',
    colors.hintBg, colors.hintBorder,
    'gameHint', hintUsed
  );
  
  drawMainActionButton(
    centerX, btnY - rpx(15),
    ui.mainBtn / 2, 'refresh', '重新开始',
    'gameRestart'
  );
  
  drawActionButton(
    centerX + spacing, btnY,
    ui.actionBtn / 2, 'undo', '撤销',
    colors.undoBg, colors.undoBorder,
    'gameUndo', state.currentPath.length <= 1
  );
  
  // 进度显示
  const tipY = screenHeight - rpx(40);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = rpx(1);
  ctx.beginPath();
  ctx.moveTo(rpx(40), tipY - rpx(25));
  ctx.lineTo(screenWidth - rpx(40), tipY - rpx(25));
  ctx.stroke();
  
  // 显示边的完成进度
  const visitedEdges = state.visitedEdges ? state.visitedEdges.length : 0;
  const totalEdges = state.totalEdges || levelConfig.edges.length;
  drawText(`路径进度: ${visitedEdges} / ${totalEdges}`, screenWidth / 2, tipY, { size: rpx(24), color: colors.textMuted });
}

function drawGame() {
  drawGradientBackground();
  
  if (!levelConfig || !gameEngine) {
    drawText('加载中...', screenWidth / 2, screenHeight / 2, { size: rpx(36) });
    return;
  }
  
  const state = gameEngine.getState();
  const visitedEdgesSet = new Set(state.visitedEdges || []);
  const currentNode = state.currentPath.length > 0 ? state.currentPath[state.currentPath.length - 1] : null;
  
  drawGameHeader();
  drawCanvasWrapper();
  
  // 获取从当前节点可以走的边
  const availableEdges = new Set();
  if (currentNode && gameEngine) {
    const availableNeighbors = gameEngine.getAvailableEdges(currentNode);
    availableNeighbors.forEach(neighbor => {
      availableEdges.add(getEdgeKey(currentNode, neighbor));
    });
  }
  
  // 绘制未走过的边
  levelConfig.edges.forEach(edge => {
    const edgeKey = getEdgeKey(edge.from, edge.to);
    if (!visitedEdgesSet.has(edgeKey)) {
      const isAvailable = availableEdges.has(edgeKey);
      drawEdge(edge.from, edge.to, false, false, isAvailable);
    }
  });
  
  // 绘制已走过的边（按路径顺序）
  if (state.currentPath.length > 1) {
    for (let i = 0; i < state.currentPath.length - 1; i++) {
      const fromNode = state.currentPath[i];
      const toNode = state.currentPath[i + 1];
      drawEdge(fromNode, toNode, true, false, false);
    }
  }
  
  // 绘制提示边
  if (hintNode && state.currentPath.length > 0) {
    const lastNode = state.currentPath[state.currentPath.length - 1];
    drawEdge(lastNode, hintNode, false, true, false);
  }
  
  // 绘制节点（起点由玩家选择的第一个节点决定）
  const actualStartNode = state.currentPath.length > 0 ? state.currentPath[0] : null;
  levelConfig.nodes.forEach(node => {
    const isInPath = state.currentPath.includes(node.id);
    const isStart = node.id === actualStartNode;
    const isHint = node.id === hintNode;
    const isCurrent = node.id === currentNode;
    drawNode(node.id, isInPath, isStart, isHint, isCurrent);
  });
  
  drawGameFooter(state);
  
  playGameBgm();
}

// ========== 结果页面 ==========

function drawResult() {
  drawGradientBackground();
  drawDecorationCircles();
  
  const centerY = screenHeight * 0.38;
  
  if (gameStatus === 'success') {
    drawText('🎉', screenWidth / 2, centerY - rpx(60), { size: rpx(120) });
    drawText('恭喜通关！', screenWidth / 2, centerY + rpx(50), { size: rpx(48), weight: '700' });
    drawText(`第 ${currentLevelId} 关完成`, screenWidth / 2, centerY + rpx(100), { size: rpx(28), color: colors.textSecondary });
    
    const nextLevel = currentLevelId + 1;
    const btnY = centerY + rpx(180);
    const btnWidth = rpx(360);
    
    if (nextLevel <= levelEngine.getTotalLevels()) {
      drawPrimaryButton((screenWidth - btnWidth) / 2, btnY, btnWidth, rpx(90), '下一关', 'resultNext');
    }
    
    drawSecondaryButton((screenWidth - btnWidth) / 2, btnY + rpx(110), btnWidth, rpx(80), '返回菜单', 'resultMenu');
    
  } else if (gameStatus === 'fail') {
    drawText('😢', screenWidth / 2, centerY - rpx(60), { size: rpx(120) });
    drawText('无路可走', screenWidth / 2, centerY + rpx(50), { size: rpx(48), weight: '700' });
    drawText('别灰心，再试一次吧！', screenWidth / 2, centerY + rpx(100), { size: rpx(28), color: colors.textSecondary });
    
    const btnY = centerY + rpx(180);
    const btnWidth = rpx(360);
    
    drawPrimaryButton((screenWidth - btnWidth) / 2, btnY, btnWidth, rpx(90), '再试一次', 'resultRetry');
    drawSecondaryButton((screenWidth - btnWidth) / 2, btnY + rpx(110), btnWidth, rpx(80), '返回菜单', 'resultMenu');
  }
}

// ========== 游戏逻辑 ==========

function loadLevel(levelId) {
  try {
    currentLevelId = levelId;
    levelConfig = levelEngine.getLevel(levelId);
    gameEngine = new GameEngine(levelConfig);
    gameStatus = 'playing';
    hintUsed = false;
    hintNode = null;
    
    calculateGameArea();
    calculateNodePositions();
    render();
  } catch (e) {
    console.error('[Game] 加载关卡失败:', e);
    gameStatus = 'menu';
    render();
  }
}

function handleTouchNode(nodeId) {
  if (!nodeId || !gameEngine) return;
  
  // 检查是否可以移动到该节点
  if (!gameEngine.canMove(nodeId)) {
    return; // 边已走过或不是邻居，不执行任何操作
  }
  
  // 执行移动
  const moved = gameEngine.moveTo(nodeId);
  if (moved) {
    vibrate();
    checkGameStatus();
    hintNode = null;
    render();
  }
}

function checkGameStatus() {
  if (!gameEngine) return;
  
  const state = gameEngine.getState();
  
  if (state.status === 'success') {
    gameStatus = 'success';
    storage.markLevelPassed(currentLevelId);
    const nextLevel = currentLevelId + 1;
    if (nextLevel <= levelEngine.getTotalLevels()) {
      storage.setCurrentLevel(nextLevel);
    }
  } else if (state.status === 'fail') {
    gameStatus = 'fail';
  }
}

function undo() {
  if (gameEngine && gameStatus === 'playing') {
    gameEngine.undo();
    hintNode = null;
    render();
  }
}

function getHint() {
  if (!gameEngine || gameStatus !== 'playing' || hintUsed) return;
  
  const hint = gameEngine.getHint();
  if (hint) {
    hintUsed = true;
    hintNode = hint;
    render();
    setTimeout(() => { hintNode = null; render(); }, 3000);
  }
}

function restart() {
  if (gameEngine) {
    gameEngine.reset();
    gameStatus = 'playing';
    hintUsed = false;
    hintNode = null;
    render();
  }
}

function vibrate() {
  try {
    const settings = storage.getSettings();
    if (settings.vibration !== false) {
      wx.vibrateShort({ type: 'light' });
    }
  } catch (e) {}
}

// ========== 加载页面 ==========

function drawLoading() {
  // 背景
  const gradient = ctx.createLinearGradient(0, 0, 0, screenHeight);
  gradient.addColorStop(0, colors.bgTop);
  gradient.addColorStop(0.5, colors.bgMiddle);
  gradient.addColorStop(1, colors.bgBottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, screenWidth, screenHeight);
  
  // 装饰圆
  ctx.beginPath();
  ctx.arc(screenWidth * 0.8, screenHeight * 0.2, rpx(100), 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(screenWidth * 0.15, screenHeight * 0.7, rpx(80), 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 217, 61, 0.15)';
  ctx.fill();
  
  // Logo
  const logoY = screenHeight * 0.35;
  drawText('🎮', screenWidth / 2, logoY - rpx(40), { size: rpx(80) });
  drawText('一笔画完', screenWidth / 2, logoY + rpx(50), { size: rpx(56), weight: '700' });
  drawText('One Stroke', screenWidth / 2, logoY + rpx(95), { size: rpx(26), color: 'rgba(255, 255, 255, 0.7)' });
  
  // 进度条
  const barWidth = rpx(400);
  const barHeight = rpx(16);
  const barX = (screenWidth - barWidth) / 2;
  const barY = screenHeight * 0.58;
  
  // 进度条背景
  ctx.fillStyle = colors.loadingBarBg;
  drawRoundRect(barX, barY, barWidth, barHeight, barHeight / 2);
  ctx.fill();
  
  // 进度条填充
  if (loadingProgress > 0) {
    const fillWidth = Math.max(barWidth * (loadingProgress / 100), barHeight);
    const fillGradient = ctx.createLinearGradient(barX, barY, barX + fillWidth, barY);
    fillGradient.addColorStop(0, colors.loadingBarFill);
    fillGradient.addColorStop(1, '#FFE066');
    ctx.fillStyle = fillGradient;
    drawRoundRect(barX, barY, fillWidth, barHeight, barHeight / 2);
    ctx.fill();
  }
  
  // 加载文字
  drawText(loadingText, screenWidth / 2, barY + rpx(50), { size: rpx(26), color: 'rgba(255, 255, 255, 0.8)' });
  
  // 进度百分比
  drawText(`${Math.floor(loadingProgress)}%`, screenWidth / 2, barY + rpx(90), { size: rpx(24), color: colors.loadingBarFill });
}

// ========== 渲染 ==========

function render() {
  // 重置变换矩阵，确保高DPI缩放正确
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  
  switch (gameStatus) {
    case 'loading': drawLoading(); break;
    case 'menu': drawMenu(); break;
    case 'playing': drawGame(); break;
    case 'success':
    case 'fail': drawResult(); break;
  }
}

// ========== 触摸事件 ==========

function isInRect(x, y, rx, ry, rw, rh) {
  return x >= rx && x <= rx + rw && y >= ry && y <= ry + rh;
}

function isInCircle(x, y, cx, cy, r) {
  return Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) <= r;
}

function getButtonAtPosition(x, y) {
  if (gameStatus === 'menu') {
    // 更新菜单音乐按钮检测区域（根据安全区域调整）
    const menuMusicY = safeAreaTop + rpx(80);
    if (isInCircle(x, y, screenWidth - rpx(85), menuMusicY, rpx(50))) return 'menuMusic';
    const btnWidth = rpx(500);
    const btnX = (screenWidth - btnWidth) / 2;
    const btnY = screenHeight * 0.68;
    if (isInRect(x, y, btnX, btnY, btnWidth, rpx(110))) return 'menuStart';
  } else if (gameStatus === 'playing') {
    const headerY = safeAreaTop + rpx(60);  // 根据安全区域调整
    const headerBtnRadius = rpx(45);
    if (isInCircle(x, y, rpx(80), headerY, headerBtnRadius)) return 'gameBack';
    if (isInCircle(x, y, screenWidth - rpx(80), headerY, headerBtnRadius)) return 'gameMusic';
    
    const footerY = screenHeight - rpx(280);
    const btnY = footerY + rpx(110);
    const centerX = screenWidth / 2;
    const spacing = rpx(180);  // 与 drawGameFooter 保持一致
    
    if (!hintUsed && isInCircle(x, y, centerX - spacing, btnY, ui.actionBtn / 2 + rpx(20))) return 'gameHint';
    if (isInCircle(x, y, centerX, btnY - rpx(15), ui.mainBtn / 2 + rpx(20))) return 'gameRestart';
    if (isInCircle(x, y, centerX + spacing, btnY, ui.actionBtn / 2 + rpx(20))) return 'gameUndo';
  } else if (gameStatus === 'success') {
    const centerY = screenHeight * 0.38;
    const btnY = centerY + rpx(180);
    const btnWidth = rpx(360);
    const btnX = (screenWidth - btnWidth) / 2;
    
    const nextLevel = currentLevelId + 1;
    if (nextLevel <= levelEngine.getTotalLevels() && isInRect(x, y, btnX, btnY, btnWidth, rpx(90))) return 'resultNext';
    if (isInRect(x, y, btnX, btnY + rpx(110), btnWidth, rpx(80))) return 'resultMenu';
  } else if (gameStatus === 'fail') {
    const centerY = screenHeight * 0.38;
    const btnY = centerY + rpx(180);
    const btnWidth = rpx(360);
    const btnX = (screenWidth - btnWidth) / 2;
    
    if (isInRect(x, y, btnX, btnY, btnWidth, rpx(90))) return 'resultRetry';
    if (isInRect(x, y, btnX, btnY + rpx(110), btnWidth, rpx(80))) return 'resultMenu';
  }
  return null;
}

function executeButtonAction(buttonId) {
  switch (buttonId) {
    case 'menuMusic':
    case 'gameMusic':
      toggleMusic();
      break;
    case 'menuStart':
      loadLevel(currentLevelId);
      break;
    case 'gameBack':
      gameStatus = 'menu';
      render();
      break;
    case 'gameHint':
      getHint();
      break;
    case 'gameRestart':
      restart();
      break;
    case 'gameUndo':
      undo();
      break;
    case 'resultNext':
      loadLevel(currentLevelId + 1);
      break;
    case 'resultRetry':
      restart();
      break;
    case 'resultMenu':
      gameStatus = 'menu';
      currentLevelId = storage.getCurrentLevel();
      render();
      break;
  }
}

function onTouchStart(e) {
  const touch = e.touches[0];
  const x = touch.clientX;
  const y = touch.clientY;
  
  touchStartPos = { x, y };
  
  const buttonId = getButtonAtPosition(x, y);
  if (buttonId) {
    pressedButton = buttonId;
    render();
    return;
  }
  
  if (gameStatus === 'playing' && gameEngine) {
    const nodeId = findNodeByPosition(x, y);
    if (nodeId) {
      const state = gameEngine.getState();
      const currentNode = state.currentPath.length > 0 
        ? state.currentPath[state.currentPath.length - 1] 
        : null;
      
      // 如果路径为空，任意节点都可以作为起点
      if (!currentNode) {
        isDrawing = true;
        lastTouchNode = nodeId;
        handleTouchNode(nodeId);
      } 
      // 如果路径已开始，只有触摸当前节点才能继续画线
      else if (nodeId === currentNode) {
        isDrawing = true;
        lastTouchNode = nodeId;
      }
      // 触摸其他节点不进入绘制模式（一笔画不能断开）
    }
  }
}

function onTouchMove(e) {
  const touch = e.touches[0];
  const x = touch.clientX;
  const y = touch.clientY;
  
  if (pressedButton) {
    const currentButton = getButtonAtPosition(x, y);
    if (currentButton !== pressedButton) {
      pressedButton = null;
      render();
    }
    return;
  }
  
  if (isDrawing && gameStatus === 'playing' && gameEngine) {
    const nodeId = findNodeByPosition(x, y);
    if (nodeId && nodeId !== lastTouchNode) {
      // 只有从当前节点出发的有效移动才执行
      if (gameEngine.canMove(nodeId)) {
        lastTouchNode = nodeId;
        handleTouchNode(nodeId);
      }
    }
  }
}

function onTouchEnd(e) {
  if (pressedButton) {
    const buttonId = pressedButton;
    pressedButton = null;
    render();
    executeButtonAction(buttonId);
  }
  
  isDrawing = false;
  lastTouchNode = null;
  touchStartPos = null;
}

// ========== 初始化 ==========

let audioSubpackageLoaded = false;

function updateLoadingProgress(progress, text) {
  loadingProgress = progress;
  if (text) loadingText = text;
  if (gameStatus === 'loading') {
    render();
  }
}

function loadAudioSubpackage() {
  return new Promise((resolve) => {
    updateLoadingProgress(10, '正在加载音频资源...');
    
    const loadTask = wx.loadSubpackage({
      name: 'audio',
      success: () => {
        console.log('[Game] 音频分包加载成功');
        audioSubpackageLoaded = true;
        updateLoadingProgress(80, '音频加载完成');
        resolve(true);
      },
      fail: (err) => {
        console.warn('[Game] 音频分包加载失败:', err);
        updateLoadingProgress(80, '跳过音频加载');
        resolve(false);
      }
    });
    
    if (loadTask && loadTask.onProgressUpdate) {
      loadTask.onProgressUpdate((res) => {
        const progress = 10 + (res.progress * 0.7);  // 10-80%
        updateLoadingProgress(progress, '正在加载音频资源...');
        console.log('[Game] 分包加载进度:', res.progress + '%');
      });
    }
  });
}

function finishLoading() {
  updateLoadingProgress(100, '加载完成！');
  
  // 延迟一小段时间让用户看到100%
  setTimeout(() => {
    gameStatus = 'menu';
    render();
  }, 300);
}

async function init() {
  wx.onTouchStart(onTouchStart);
  wx.onTouchMove(onTouchMove);
  wx.onTouchEnd(onTouchEnd);
  
  currentLevelId = storage.getCurrentLevel() || 1;
  
  // 显示加载页面
  gameStatus = 'loading';
  updateLoadingProgress(0, '初始化中...');
  render();
  
  // 初始化存储设置
  updateLoadingProgress(5, '加载设置...');
  initAudio();
  
  // 加载音频分包
  await loadAudioSubpackage();
  
  // 预创建音频对象
  updateLoadingProgress(90, '准备音频...');
  if (audioSubpackageLoaded && musicEnabled) {
    menuBgm = createAudio('subpackages/audio/menu_bgm.mp3');
    gameBgm = createAudio('subpackages/audio/game_bgm.mp3');
  }
  
  // 完成加载
  finishLoading();
  
  console.log('[Game] 小游戏初始化完成');
}

init();
