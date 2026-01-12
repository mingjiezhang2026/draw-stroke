// utils/canvasDrawer.js
// Canvas绘制模块 - 深色极简风格

/**
 * Canvas绘制器
 */
class CanvasDrawer {
  constructor(canvasId, page) {
    this.canvasId = canvasId;
    this.page = page;
    this.canvas = null;
    this.ctx = null;
    this.width = 0;
    this.height = 0;
    this.dpr = 1;
    this.padding = 50; // 画布内边距
    this.nodeRadius = 14; // 节点半径
    this.touchRadius = 30; // 触摸判定半径
    this.gridSize = [0, 0];
    this.nodes = [];
    this.edges = [];
    this.startNode = null;
    this.nodePositions = {};
    
    // 深色主题配色
    this.colors = {
      background: '#1E2A3A', // 深蓝背景
      nodeDefault: '#3D5A80', // 未访问节点
      nodeDefaultBorder: '#4A6FA5', // 未访问节点边框
      nodeVisited: '#E94560', // 已访问节点
      nodeStart: '#FFD700', // 起点节点
      nodeStartGlow: 'rgba(255, 215, 0, 0.3)', // 起点发光
      edgeDefault: '#2D3E50', // 未经过路径
      edgeVisited: '#E94560', // 已经过路径
      edgeHint: '#4CAF50', // 提示路径
      hintNode: '#4CAF50' // 提示节点
    };
  }

  /**
   * 初始化Canvas
   */
  init() {
    return new Promise((resolve, reject) => {
      const tryInit = (retryCount = 0) => {
        const query = wx.createSelectorQuery().in(this.page);
        query.select(`#${this.canvasId}`)
          .fields({ node: true, size: true })
          .exec((res) => {
            if (res && res[0] && res[0].node) {
              this.canvas = res[0].node;
              
              // 获取实际渲染尺寸
              const query2 = wx.createSelectorQuery().in(this.page);
              query2.select(`#${this.canvasId}`)
                .boundingClientRect((rect) => {
                  if (!rect || rect.width === 0 || rect.height === 0) {
                    if (retryCount < 15) {
                      setTimeout(() => tryInit(retryCount + 1), 100);
                      return;
                    }
                    // 使用备选尺寸
                    const sysInfo = wx.getSystemInfoSync();
                    const size = Math.min(sysInfo.windowWidth - 100, 400);
                    this.width = size;
                    this.height = size;
                  } else {
                    this.width = rect.width;
                    this.height = rect.height;
                  }
                  
                  this.dpr = wx.getSystemInfoSync().pixelRatio || 2;
                  
                  // 设置Canvas物理尺寸
                  this.canvas.width = Math.round(this.width * this.dpr);
                  this.canvas.height = Math.round(this.height * this.dpr);
                  
                  // 获取绑定context
                  this.ctx = this.canvas.getContext('2d');
                  this.ctx.scale(this.dpr, this.dpr);
                  
                  console.log('[CanvasDrawer] 初始化成功:', {
                    width: this.width,
                    height: this.height,
                    dpr: this.dpr
                  });
                  
                  resolve();
                })
                .exec();
            } else {
              if (retryCount < 15) {
                setTimeout(() => tryInit(retryCount + 1), 100);
              } else {
                reject(new Error('Canvas初始化失败'));
              }
            }
          });
      };
      
      tryInit();
    });
  }

  /**
   * 设置关卡数据
   */
  setLevelData(levelConfig) {
    this.nodes = levelConfig.nodes || [];
    this.edges = levelConfig.edges || [];
    this.startNode = levelConfig.startNode;
    this.gridSize = levelConfig.gridSize || [4, 4];
    
    if (this.width > 0 && this.height > 0) {
      this.calculateNodePositions();
    }
  }

  /**
   * 计算节点屏幕坐标
   */
  calculateNodePositions() {
    const [gridCols, gridRows] = this.gridSize;
    const size = Math.min(this.width, this.height);
    const availableSize = size - this.padding * 2;
    
    const cellWidth = availableSize / (gridCols - 1 || 1);
    const cellHeight = availableSize / (gridRows - 1 || 1);
    
    // 居中偏移
    const offsetX = (this.width - availableSize) / 2;
    const offsetY = (this.height - availableSize) / 2;

    this.nodePositions = {};
    this.nodes.forEach(node => {
      const x = offsetX + node.x * cellWidth;
      const y = offsetY + node.y * cellHeight;
      this.nodePositions[node.id] = { x, y };
    });
    
    console.log('[CanvasDrawer] 节点位置计算完成:', Object.keys(this.nodePositions).length);
  }

  /**
   * 根据屏幕坐标查找节点
   */
  findNodeByPosition(x, y) {
    for (let node of this.nodes) {
      const pos = this.nodePositions[node.id];
      if (!pos) continue;
      const dx = x - pos.x;
      const dy = y - pos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance <= this.touchRadius) {
        return node.id;
      }
    }
    return null;
  }

  /**
   * 清空画布
   */
  clear() {
    if (!this.ctx) return;
    this.ctx.fillStyle = this.colors.background;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  /**
   * 绘制边（路径）
   */
  drawEdge(fromNodeId, toNodeId, isVisited, isHint = false) {
    const fromPos = this.nodePositions[fromNodeId];
    const toPos = this.nodePositions[toNodeId];
    if (!fromPos || !toPos || !this.ctx) return;

    this.ctx.save();
    
    // 设置线条样式
    if (isHint) {
      this.ctx.strokeStyle = this.colors.edgeHint;
      this.ctx.lineWidth = 6;
      this.ctx.shadowColor = this.colors.edgeHint;
      this.ctx.shadowBlur = 10;
    } else if (isVisited) {
      this.ctx.strokeStyle = this.colors.edgeVisited;
      this.ctx.lineWidth = 6;
      this.ctx.shadowColor = this.colors.edgeVisited;
      this.ctx.shadowBlur = 8;
    } else {
      this.ctx.strokeStyle = this.colors.edgeDefault;
      this.ctx.lineWidth = 3;
      this.ctx.setLineDash([6, 4]);
    }
    
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    this.ctx.beginPath();
    this.ctx.moveTo(fromPos.x, fromPos.y);
    this.ctx.lineTo(toPos.x, toPos.y);
    this.ctx.stroke();
    
    this.ctx.restore();
  }

  /**
   * 绘制节点
   */
  drawNode(nodeId, isVisited, isStart, isHint) {
    const pos = this.nodePositions[nodeId];
    if (!pos || !this.ctx) return;

    this.ctx.save();
    
    const radius = this.nodeRadius;
    
    // 起点发光效果
    if (isStart && !isVisited) {
      this.ctx.beginPath();
      this.ctx.arc(pos.x, pos.y, radius + 8, 0, Math.PI * 2);
      this.ctx.fillStyle = this.colors.nodeStartGlow;
      this.ctx.fill();
    }
    
    // 提示节点发光
    if (isHint) {
      this.ctx.beginPath();
      this.ctx.arc(pos.x, pos.y, radius + 10, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(76, 175, 80, 0.3)';
      this.ctx.fill();
    }
    
    // 节点主体
    this.ctx.beginPath();
    this.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    
    if (isStart) {
      this.ctx.fillStyle = this.colors.nodeStart;
      this.ctx.shadowColor = this.colors.nodeStart;
      this.ctx.shadowBlur = 12;
    } else if (isVisited) {
      this.ctx.fillStyle = this.colors.nodeVisited;
      this.ctx.shadowColor = this.colors.nodeVisited;
      this.ctx.shadowBlur = 8;
    } else if (isHint) {
      this.ctx.fillStyle = this.colors.hintNode;
    } else {
      this.ctx.fillStyle = this.colors.nodeDefault;
    }
    
    this.ctx.fill();
    
    // 节点边框
    this.ctx.shadowBlur = 0;
    this.ctx.lineWidth = 2;
    if (isStart) {
      this.ctx.strokeStyle = '#FFF8DC';
    } else if (isVisited) {
      this.ctx.strokeStyle = '#FF8A9B';
    } else {
      this.ctx.strokeStyle = this.colors.nodeDefaultBorder;
    }
    this.ctx.stroke();
    
    // 起点标记 - 中心白点
    if (isStart && !isVisited) {
      this.ctx.beginPath();
      this.ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.fill();
    }
    
    this.ctx.restore();
  }

  /**
   * 绘制完整场景
   */
  draw(visitedNodes = [], currentPath = [], hintNode = null) {
    if (!this.ctx || this.width <= 0 || this.height <= 0) {
      console.error('[CanvasDrawer] 无法绘制: ctx或尺寸无效');
      return;
    }
    
    if (!this.nodes || this.nodes.length === 0) {
      console.error('[CanvasDrawer] 无法绘制: 节点数据为空');
      return;
    }
    
    // 确保节点位置已计算
    if (Object.keys(this.nodePositions).length === 0) {
      this.calculateNodePositions();
    }
    
    // 清空画布
    this.clear();
    
    // 绘制所有边（先绘制未访问的）
    this.edges.forEach(edge => {
      const isVisited = this.isEdgeInPath(edge.from, edge.to, currentPath);
      if (!isVisited) {
        this.drawEdge(edge.from, edge.to, false, false);
      }
    });
    
    // 绘制已访问的边
    if (currentPath.length > 1) {
      for (let i = 0; i < currentPath.length - 1; i++) {
        this.drawEdge(currentPath[i], currentPath[i + 1], true, false);
      }
    }
    
    // 绘制提示边
    if (hintNode && currentPath.length > 0) {
      const lastNode = currentPath[currentPath.length - 1];
      this.drawEdge(lastNode, hintNode, false, true);
    }
    
    // 绘制所有节点
    this.nodes.forEach(node => {
      const isVisited = Array.isArray(visitedNodes) 
        ? visitedNodes.includes(node.id)
        : false;
      const isStart = node.id === this.startNode;
      const isHint = node.id === hintNode;
      this.drawNode(node.id, isVisited, isStart, isHint);
    });
    
    console.log('[CanvasDrawer] 绘制完成:', {
      nodes: this.nodes.length,
      edges: this.edges.length,
      visited: visitedNodes.length,
      path: currentPath.length
    });
  }

  /**
   * 判断边是否在路径中
   */
  isEdgeInPath(from, to, path) {
    if (!path || path.length < 2) return false;
    for (let i = 0; i < path.length - 1; i++) {
      if ((path[i] === from && path[i + 1] === to) ||
          (path[i] === to && path[i + 1] === from)) {
        return true;
      }
    }
    return false;
  }

  /**
   * 绘制成功动画
   */
  drawSuccessAnimation(callback) {
    let frame = 0;
    const maxFrames = 6;
    
    const animate = () => {
      frame++;
      
      // 闪烁效果
      this.clear();
      
      // 绘制边
      this.edges.forEach(edge => {
        this.ctx.save();
        this.ctx.strokeStyle = frame % 2 === 0 ? '#4CAF50' : this.colors.edgeVisited;
        this.ctx.lineWidth = 6;
        this.ctx.lineCap = 'round';
        const fromPos = this.nodePositions[edge.from];
        const toPos = this.nodePositions[edge.to];
        if (fromPos && toPos) {
          this.ctx.beginPath();
          this.ctx.moveTo(fromPos.x, fromPos.y);
          this.ctx.lineTo(toPos.x, toPos.y);
          this.ctx.stroke();
        }
        this.ctx.restore();
      });
      
      // 绘制节点
      this.nodes.forEach(node => {
        this.ctx.save();
        const pos = this.nodePositions[node.id];
        if (pos) {
          this.ctx.beginPath();
          this.ctx.arc(pos.x, pos.y, this.nodeRadius + (frame % 2 === 0 ? 3 : 0), 0, Math.PI * 2);
          this.ctx.fillStyle = frame % 2 === 0 ? '#4CAF50' : this.colors.nodeVisited;
          this.ctx.fill();
        }
        this.ctx.restore();
      });
      
      if (frame < maxFrames) {
        setTimeout(animate, 150);
      } else {
        if (callback) callback();
      }
    };
    
    animate();
  }

  /**
   * 绘制失败动画
   */
  drawFailAnimation(callback) {
    let frame = 0;
    const maxFrames = 4;
    
    const animate = () => {
      frame++;
      
      this.clear();
      
      // 绘制红色闪烁
      if (frame % 2 === 0) {
        this.ctx.fillStyle = 'rgba(255, 77, 79, 0.1)';
        this.ctx.fillRect(0, 0, this.width, this.height);
      }
      
      // 重绘场景
      this.edges.forEach(edge => {
        this.drawEdge(edge.from, edge.to, false, false);
      });
      
      this.nodes.forEach(node => {
        const isStart = node.id === this.startNode;
        this.drawNode(node.id, false, isStart, false);
      });
      
      if (frame < maxFrames) {
        setTimeout(animate, 200);
      } else {
        if (callback) callback();
      }
    };
    
    animate();
  }
}

module.exports = CanvasDrawer;
