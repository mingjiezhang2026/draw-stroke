// utils/levelEngine.js
// 关卡引擎 - 关卡加载、校验

const levels = require('../data/levels.js');

/**
 * 关卡引擎
 */
class LevelEngine {
  constructor() {
    this.levels = levels;
  }

  /**
   * 获取关卡配置
   */
  getLevel(levelId) {
    const level = this.levels.find(l => l.levelId === levelId);
    if (!level) {
      throw new Error(`Level ${levelId} not found`);
    }
    return level;
  }

  /**
   * 获取关卡总数
   */
  getTotalLevels() {
    return this.levels.length;
  }

  /**
   * 验证关卡配置
   */
  validateLevel(levelConfig) {
    // 检查必需字段
    if (!levelConfig.levelId || !levelConfig.nodes || !levelConfig.edges) {
      return { valid: false, error: '缺少必需字段' };
    }

    // 检查起点是否存在
    if (levelConfig.startNode && !levelConfig.nodes.find(n => n.id === levelConfig.startNode)) {
      return { valid: false, error: '起点节点不存在' };
    }

    // 检查边是否引用有效节点
    const nodeIds = new Set(levelConfig.nodes.map(n => n.id));
    for (let edge of levelConfig.edges) {
      if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
        return { valid: false, error: '边引用了不存在的节点' };
      }
    }

    return { valid: true };
  }

  /**
   * 检查关卡是否可解（简单验证 - 图连通性）
   */
  isLevelSolvable(levelConfig) {
    // 构建图
    const graph = {};
    levelConfig.nodes.forEach(node => {
      graph[node.id] = [];
    });
    
    levelConfig.edges.forEach(edge => {
      graph[edge.from].push(edge.to);
      if (edge.bidirectional !== false) {
        graph[edge.to].push(edge.from);
      }
    });

    // 从起点开始DFS检查连通性
    const startNode = levelConfig.startNode || levelConfig.nodes[0].id;
    const visited = new Set();
    const stack = [startNode];
    
    while (stack.length > 0) {
      const node = stack.pop();
      if (visited.has(node)) continue;
      visited.add(node);
      
      (graph[node] || []).forEach(neighbor => {
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
        }
      });
    }

    // 检查是否所有节点都可达
    return visited.size === levelConfig.nodes.length;
  }
}

module.exports = new LevelEngine();

