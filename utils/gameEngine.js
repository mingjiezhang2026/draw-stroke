// utils/gameEngine.js
// 核心游戏引擎 - 一笔画完规则：必须走完所有边

/**
 * 游戏状态
 */
class GameState {
  constructor(levelConfig) {
    this.levelId = levelConfig.levelId;
    this.visitedNodes = new Set(); // 已访问节点ID
    this.visitedEdges = new Set(); // 已访问边（用字符串 "from-to" 标识）
    this.currentPath = []; // 当前路径 [nodeId1, nodeId2, ...]
    this.status = 'playing'; // playing | success | fail
    this.startNode = null; // 起点由玩家选择，初始为null
    this.totalEdges = levelConfig.edges.length; // 总边数
  }

  // 获取当前节点
  getCurrentNode() {
    return this.currentPath.length > 0 
      ? this.currentPath[this.currentPath.length - 1] 
      : null;
  }

  // 获取边标识（确保唯一性）
  getEdgeKey(from, to) {
    return from < to ? `${from}-${to}` : `${to}-${from}`;
  }
}

/**
 * 核心游戏引擎 - 一笔画规则
 * 规则：从起点出发，走完所有的边（每条边只能走一次），节点可以重复经过
 */
class GameEngine {
  constructor(levelConfig) {
    this.levelConfig = levelConfig;
    this.state = new GameState(levelConfig);
    this.buildGraph();
  }

  // 构建图的邻接表（使用边索引而非节点ID，支持更精确的边追踪）
  buildGraph() {
    this.graph = {};        // 邻接表：nodeId -> [{neighbor, edgeIndex}]
    this.edgeList = [];     // 边列表：[{from, to, key}]
    this.edgeCount = {};    // 记录每个节点的边数（度）
    
    this.levelConfig.nodes.forEach(node => {
      this.graph[node.id] = [];
      this.edgeCount[node.id] = 0;
    });
    
    this.levelConfig.edges.forEach((edge, index) => {
      const from = edge.from;
      const to = edge.to;
      const edgeKey = this.state.getEdgeKey(from, to);
      
      // 存储边信息
      this.edgeList.push({ from, to, key: edgeKey, index });
      
      // 添加到邻接表（避免重复）
      if (!this.graph[from].some(e => e.neighbor === to)) {
        this.graph[from].push({ neighbor: to, edgeKey });
        this.edgeCount[from]++;
      }
      if (edge.bidirectional !== false) {
        if (!this.graph[to].some(e => e.neighbor === from)) {
          this.graph[to].push({ neighbor: from, edgeKey });
          this.edgeCount[to]++;
        }
      }
    });
  }

  /**
   * 是否可以移动到目标节点
   * 规则：只检查边是否已被访问，节点可以重复访问
   */
  canMove(toNodeId) {
    const fromNodeId = this.state.getCurrentNode();
    
    // 如果路径为空，任意存在的节点都可以作为起点
    if (!fromNodeId) {
      return !!this.graph[toNodeId];
    }

    // 检查是否是邻居节点，并获取边信息
    const neighbors = this.graph[fromNodeId] || [];
    const edgeInfo = neighbors.find(e => e.neighbor === toNodeId);
    
    if (!edgeInfo) {
      return false; // 不是邻居节点
    }

    // 检查边是否已被访问
    if (this.state.visitedEdges.has(edgeInfo.edgeKey)) {
      return false; // 边已经走过，不能再走
    }

    return true;
  }

  /**
   * 获取从当前节点可以走的未访问边（返回邻居节点ID列表）
   */
  getAvailableEdges(nodeId) {
    if (!nodeId) return [];
    
    const neighbors = this.graph[nodeId] || [];
    return neighbors
      .filter(e => !this.state.visitedEdges.has(e.edgeKey))
      .map(e => e.neighbor);
  }

  /**
   * 移动到目标节点
   */
  moveTo(toNodeId) {
    const fromNodeId = this.state.getCurrentNode();
    
    // 如果路径为空，任意节点都可以作为起点
    if (!fromNodeId) {
      // 检查节点是否存在
      if (!this.graph[toNodeId]) {
        return false;
      }
      this.state.startNode = toNodeId; // 记录玩家选择的起点
      this.state.currentPath.push(toNodeId);
      this.state.visitedNodes.add(toNodeId);
      return true;
    }

    // 获取边信息
    const neighbors = this.graph[fromNodeId] || [];
    const edgeInfo = neighbors.find(e => e.neighbor === toNodeId);
    
    if (!edgeInfo) {
      return false; // 不是邻居节点
    }

    // 检查边是否已被访问
    if (this.state.visitedEdges.has(edgeInfo.edgeKey)) {
      return false; // 边已经走过，不能再走
    }

    // 添加新节点到路径
    this.state.currentPath.push(toNodeId);
    this.state.visitedNodes.add(toNodeId);

    // 标记边为已访问
    this.state.visitedEdges.add(edgeInfo.edgeKey);

    // 检查是否通关（所有边都走完了）
    if (this.isLevelCompleted()) {
      this.state.status = 'success';
    } else if (this.isDeadEnd()) {
      this.state.status = 'fail';
    }

    return true;
  }

  /**
   * 回退一步
   */
  undo() {
    if (this.state.currentPath.length <= 1) {
      return false;
    }

    // 移除最后一个节点
    const lastNode = this.state.currentPath.pop();

    // 移除最后一条边
    if (this.state.currentPath.length > 0) {
      const prevNode = this.state.currentPath[this.state.currentPath.length - 1];
      const edgeKey = this.state.getEdgeKey(prevNode, lastNode);
      this.state.visitedEdges.delete(edgeKey);
    }

    // 检查这个节点是否还在路径中（可能重复经过）
    if (!this.state.currentPath.includes(lastNode)) {
      this.state.visitedNodes.delete(lastNode);
    }

    this.state.status = 'playing';
    return true;
  }

  /**
   * 是否死路（无路可走但仍有未走完的边）
   */
  isDeadEnd() {
    const currentNode = this.state.getCurrentNode();
    if (!currentNode) return false;

    // 检查当前节点是否有未走的边
    const availableEdges = this.getAvailableEdges(currentNode);
    
    // 如果没有可走的边，但还有边没走完，则是死路
    if (availableEdges.length === 0) {
      return this.state.visitedEdges.size < this.state.totalEdges;
    }

    return false;
  }

  /**
   * 是否通关 - 所有边都走完了
   */
  isLevelCompleted() {
    return this.state.visitedEdges.size === this.state.totalEdges;
  }

  /**
   * 重置游戏状态
   */
  reset() {
    this.state = new GameState(this.levelConfig);
  }

  /**
   * 获取游戏状态
   */
  getState() {
    return {
      levelId: this.state.levelId,
      currentPath: [...this.state.currentPath],
      visitedNodes: Array.from(this.state.visitedNodes),
      visitedEdges: Array.from(this.state.visitedEdges),
      totalEdges: this.state.totalEdges,
      status: this.state.status,
      isCompleted: this.isLevelCompleted(),
      isDeadEnd: this.isDeadEnd()
    };
  }

  /**
   * 获取提示（下一步推荐）
   * 使用完整的DFS找到一条能走通的完整路径，返回第一步
   */
  getHint() {
    const currentNode = this.state.getCurrentNode();
    
    // 如果还没开始，找一个能走通的起点
    if (!currentNode) {
      return this.findValidStartNode();
    }
    
    const availableEdges = this.getAvailableEdges(currentNode);
    
    if (availableEdges.length === 0) return null;
    
    // 使用DFS找到一条能走完所有边的完整路径
    const solution = this.findCompletePath();
    
    if (solution && solution.length > 0) {
      // 返回解法路径中的下一步
      const currentPathLen = this.state.currentPath.length;
      if (solution.length > currentPathLen) {
        return solution[currentPathLen];
      }
    }
    
    // 如果当前状态无解，返回null
    return null;
  }

  /**
   * 找到一个能走通的起点
   */
  findValidStartNode() {
    // 优先尝试奇数度节点
    const oddNodes = [];
    const evenNodes = [];
    
    for (let nodeId in this.edgeCount) {
      if (this.edgeCount[nodeId] % 2 === 1) {
        oddNodes.push(parseInt(nodeId));
      } else if (this.edgeCount[nodeId] > 0) {
        evenNodes.push(parseInt(nodeId));
      }
    }
    
    // 优先从奇数度节点开始尝试
    const candidates = [...oddNodes, ...evenNodes];
    
    for (let startNode of candidates) {
      // 尝试从这个节点开始是否能找到完整解
      const savedState = this.saveState();
      this.moveTo(startNode);
      
      const canSolve = this.findCompletePathDFS(new Set(this.state.visitedEdges), startNode);
      this.restoreState(savedState);
      
      if (canSolve) {
        return startNode;
      }
    }
    
    // 如果都不行，返回第一个奇数度节点或第一个节点
    return oddNodes[0] || evenNodes[0] || this.levelConfig.nodes[0].id;
  }

  /**
   * 从当前状态找到一条完整的解法路径
   */
  findCompletePath() {
    const visitedEdges = new Set(this.state.visitedEdges);
    const path = [...this.state.currentPath];
    const currentNode = this.state.getCurrentNode();
    
    if (!currentNode) return null;
    
    // 使用DFS找完整路径
    const result = this.dfsFullPath(visitedEdges, path, currentNode);
    return result;
  }

  /**
   * DFS搜索完整路径
   */
  dfsFullPath(visitedEdges, path, currentNode) {
    // 如果所有边都走完了，返回路径
    if (visitedEdges.size === this.state.totalEdges) {
      return [...path];
    }
    
    // 获取当前节点可走的边
    const neighbors = this.graph[currentNode] || [];
    const availableNeighbors = neighbors.filter(e => !visitedEdges.has(e.edgeKey));
    
    if (availableNeighbors.length === 0) {
      return null; // 死路
    }
    
    // 尝试每个方向
    for (let edge of availableNeighbors) {
      const neighbor = edge.neighbor;
      const edgeKey = edge.edgeKey;
      
      // 走这条边
      visitedEdges.add(edgeKey);
      path.push(neighbor);
      
      // 递归搜索
      const result = this.dfsFullPath(visitedEdges, path, neighbor);
      
      if (result) {
        return result; // 找到解了
      }
      
      // 回溯
      visitedEdges.delete(edgeKey);
      path.pop();
    }
    
    return null; // 这个方向走不通
  }

  /**
   * 检查从某个节点开始是否能走完所有边（用于验证起点）
   */
  findCompletePathDFS(visitedEdges, currentNode) {
    if (visitedEdges.size === this.state.totalEdges) {
      return true;
    }
    
    const neighbors = this.graph[currentNode] || [];
    const availableNeighbors = neighbors.filter(e => !visitedEdges.has(e.edgeKey));
    
    if (availableNeighbors.length === 0) {
      return false;
    }
    
    for (let edge of availableNeighbors) {
      visitedEdges.add(edge.edgeKey);
      
      if (this.findCompletePathDFS(visitedEdges, edge.neighbor)) {
        visitedEdges.delete(edge.edgeKey); // 恢复用于其他验证
        return true;
      }
      
      visitedEdges.delete(edge.edgeKey);
    }
    
    return false;
  }

  /**
   * 获取最佳起点（优先奇数度节点）- 保留用于兼容
   */
  getBestStartNode() {
    return this.findValidStartNode();
  }

  /**
   * 检查从当前状态是否能找到解
   */
  canFindSolution() {
    if (this.isLevelCompleted()) return true;
    if (this.isDeadEnd()) return false;
    
    const currentNode = this.state.getCurrentNode();
    return this.findCompletePathDFS(new Set(this.state.visitedEdges), currentNode);
  }

  // 保存状态
  saveState() {
    return {
      visitedNodes: new Set(this.state.visitedNodes),
      visitedEdges: new Set(this.state.visitedEdges),
      currentPath: [...this.state.currentPath],
      status: this.state.status
    };
  }

  // 恢复状态
  restoreState(savedState) {
    this.state.visitedNodes = new Set(savedState.visitedNodes);
    this.state.visitedEdges = new Set(savedState.visitedEdges);
    this.state.currentPath = [...savedState.currentPath];
    this.state.status = savedState.status;
  }
}

module.exports = GameEngine;
