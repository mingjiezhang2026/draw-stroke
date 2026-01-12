// utils/bgmManager.js
// 背景音乐管理器

const storage = require('./storage.js');

class BGMManager {
  constructor() {
    this.menuAudio = null;
    this.gameAudio = null;
    this.currentType = null; // 'menu' | 'game' | null
    this.isEnabled = true;
    this.volume = 0.5;
    
    // 音乐文件路径
    this.musicPaths = {
      menu: '/assets/audio/menu_bgm.mp3',
      game: '/assets/audio/game_bgm.mp3'
    };
    
    this._init();
  }
  
  /**
   * 初始化
   */
  _init() {
    // 从存储读取设置
    const settings = storage.getSettings();
    this.isEnabled = settings.music !== false;
    this.volume = settings.musicVolume || 0.5;
  }
  
  /**
   * 创建音频实例
   */
  _createAudio(type) {
    const audio = wx.createInnerAudioContext();
    audio.src = this.musicPaths[type];
    audio.loop = true;
    audio.volume = this.volume;
    audio.obeyMuteSwitch = false; // 不受系统静音开关影响
    
    audio.onError((err) => {
      console.warn(`[BGM] ${type}音乐加载失败:`, err);
    });
    
    return audio;
  }
  
  /**
   * 播放菜单背景音乐
   */
  playMenu() {
    if (!this.isEnabled) return;
    
    // 如果正在播放菜单音乐，不重复播放
    if (this.currentType === 'menu' && this.menuAudio) {
      return;
    }
    
    // 停止游戏音乐
    this._stopGame();
    
    // 创建或复用菜单音频
    if (!this.menuAudio) {
      this.menuAudio = this._createAudio('menu');
    }
    
    this.menuAudio.play();
    this.currentType = 'menu';
    console.log('[BGM] 播放菜单音乐');
  }
  
  /**
   * 播放游戏背景音乐
   */
  playGame() {
    if (!this.isEnabled) return;
    
    // 如果正在播放游戏音乐，不重复播放
    if (this.currentType === 'game' && this.gameAudio) {
      return;
    }
    
    // 停止菜单音乐
    this._stopMenu();
    
    // 创建或复用游戏音频
    if (!this.gameAudio) {
      this.gameAudio = this._createAudio('game');
    }
    
    this.gameAudio.play();
    this.currentType = 'game';
    console.log('[BGM] 播放游戏音乐');
  }
  
  /**
   * 停止菜单音乐
   */
  _stopMenu() {
    if (this.menuAudio) {
      this.menuAudio.pause();
      this.menuAudio.seek(0);
    }
  }
  
  /**
   * 停止游戏音乐
   */
  _stopGame() {
    if (this.gameAudio) {
      this.gameAudio.pause();
      this.gameAudio.seek(0);
    }
  }
  
  /**
   * 停止所有音乐
   */
  stop() {
    this._stopMenu();
    this._stopGame();
    this.currentType = null;
    console.log('[BGM] 停止所有音乐');
  }
  
  /**
   * 暂停当前音乐
   */
  pause() {
    if (this.currentType === 'menu' && this.menuAudio) {
      this.menuAudio.pause();
    } else if (this.currentType === 'game' && this.gameAudio) {
      this.gameAudio.pause();
    }
    console.log('[BGM] 暂停音乐');
  }
  
  /**
   * 恢复当前音乐
   */
  resume() {
    if (!this.isEnabled) return;
    
    if (this.currentType === 'menu' && this.menuAudio) {
      this.menuAudio.play();
    } else if (this.currentType === 'game' && this.gameAudio) {
      this.gameAudio.play();
    }
    console.log('[BGM] 恢复音乐');
  }
  
  /**
   * 开启音乐
   */
  enable() {
    this.isEnabled = true;
    storage.updateSettings({ music: true });
    
    // 恢复播放
    if (this.currentType) {
      this.resume();
    }
    console.log('[BGM] 音乐已开启');
  }
  
  /**
   * 关闭音乐
   */
  disable() {
    this.isEnabled = false;
    storage.updateSettings({ music: false });
    this.pause();
    console.log('[BGM] 音乐已关闭');
  }
  
  /**
   * 切换音乐开关
   */
  toggle() {
    if (this.isEnabled) {
      this.disable();
    } else {
      this.enable();
      // 根据当前类型播放对应音乐
      if (this.currentType === 'menu') {
        this.playMenu();
      } else if (this.currentType === 'game') {
        this.playGame();
      }
    }
    return this.isEnabled;
  }
  
  /**
   * 设置音量
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    
    if (this.menuAudio) {
      this.menuAudio.volume = this.volume;
    }
    if (this.gameAudio) {
      this.gameAudio.volume = this.volume;
    }
    
    storage.updateSettings({ musicVolume: this.volume });
  }
  
  /**
   * 获取当前状态
   */
  getStatus() {
    return {
      isEnabled: this.isEnabled,
      currentType: this.currentType,
      volume: this.volume
    };
  }
  
  /**
   * 销毁资源
   */
  destroy() {
    if (this.menuAudio) {
      this.menuAudio.destroy();
      this.menuAudio = null;
    }
    if (this.gameAudio) {
      this.gameAudio.destroy();
      this.gameAudio = null;
    }
    this.currentType = null;
  }
}

// 导出单例
const bgmManager = new BGMManager();
module.exports = bgmManager;

