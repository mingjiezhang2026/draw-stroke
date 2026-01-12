// utils/storage.js
// 本地存储管理

const STORAGE_KEYS = {
  PASSED_LEVELS: 'passedLevels',
  CURRENT_LEVEL: 'currentLevel',
  HINT_USED_TODAY: 'hintUsedToday',
  SETTINGS: 'settings'
};

module.exports = {
  // 初始化存储
  init() {
    if (!wx.getStorageSync(STORAGE_KEYS.PASSED_LEVELS)) {
      wx.setStorageSync(STORAGE_KEYS.PASSED_LEVELS, []);
    }
    if (!wx.getStorageSync(STORAGE_KEYS.CURRENT_LEVEL)) {
      wx.setStorageSync(STORAGE_KEYS.CURRENT_LEVEL, 1);
    }
    if (!wx.getStorageSync(STORAGE_KEYS.SETTINGS)) {
      wx.setStorageSync(STORAGE_KEYS.SETTINGS, {
        sound: true,
        vibration: true,
        music: true,
        musicVolume: 0.5
      });
    }
  },

  // 获取已通过关卡
  getPassedLevels() {
    return wx.getStorageSync(STORAGE_KEYS.PASSED_LEVELS) || [];
  },

  // 标记关卡通过
  markLevelPassed(levelId) {
    const passed = this.getPassedLevels();
    if (!passed.includes(levelId)) {
      passed.push(levelId);
      wx.setStorageSync(STORAGE_KEYS.PASSED_LEVELS, passed);
    }
  },

  // 获取当前关卡
  getCurrentLevel() {
    return wx.getStorageSync(STORAGE_KEYS.CURRENT_LEVEL) || 1;
  },

  // 设置当前关卡
  setCurrentLevel(levelId) {
    wx.setStorageSync(STORAGE_KEYS.CURRENT_LEVEL, levelId);
  },

  // 获取设置
  getSettings() {
    return wx.getStorageSync(STORAGE_KEYS.SETTINGS) || { 
      sound: true, 
      vibration: true,
      music: true,
      musicVolume: 0.5
    };
  },

  // 保存设置
  saveSettings(settings) {
    wx.setStorageSync(STORAGE_KEYS.SETTINGS, settings);
  },

  // 更新部分设置
  updateSettings(updates) {
    const current = this.getSettings();
    const newSettings = { ...current, ...updates };
    wx.setStorageSync(STORAGE_KEYS.SETTINGS, newSettings);
    return newSettings;
  }
};
