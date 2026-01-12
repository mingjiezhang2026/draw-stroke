/**
 * 一笔画关卡自动生成器
 * 根据难度模板和参数生成符合欧拉路径/回路条件的关卡
 */

// 难度模板配置
const DIFFICULTY_TEMPLATES = {
  // 新手期 (1-20关)
  1: {
    name: '新手期',
    nodeRange: [3, 6],      // 节点数范围
    edgeRange: [3, 8],      // 边数范围
    gridSize: [3, 4],       // 网格大小
    patterns: ['triangle', 'square', 'pentagon', 'hexagon', 'diamond', 'house'],
    allowCrossEdges: false,  // 是否允许交叉边
    centerNodeProb: 0.2,     // 中心节点概率
  },
  // 熟练期 (21-40关)
  2: {
    name: '熟练期',
    nodeRange: [5, 8],
    edgeRange: [7, 12],
    gridSize: [4, 5],
    patterns: ['star', 'butterfly', 'grid', 'double_diamond', 'flower'],
    allowCrossEdges: true,
    centerNodeProb: 0.4,
  },
  // 思考期 (41-50关)
  3: {
    name: '思考期',
    nodeRange: [6, 9],
    edgeRange: [10, 15],
    gridSize: [4, 5],
    patterns: ['hexagram', 'complex_star', 'nested_square', 'web'],
    allowCrossEdges: true,
    centerNodeProb: 0.5,
  },
  // 压力期 (51-70关)
  4: {
    name: '压力期',
    nodeRange: [7, 10],
    edgeRange: [12, 20],
    gridSize: [5, 6],
    patterns: ['double_ring', 'snowflake', 'maze', 'complex_web'],
    allowCrossEdges: true,
    centerNodeProb: 0.6,
  },
  // 精通期 (71-120关)
  5: {
    name: '精通期',
    nodeRange: [8, 12],
    edgeRange: [15, 25],
    gridSize: [5, 7],
    patterns: ['triple_ring', 'galaxy', 'fractal', 'ultimate'],
    allowCrossEdges: true,
    centerNodeProb: 0.7,
  }
};

// 图形模板生成器
const PATTERN_GENERATORS = {
  // 基础多边形（n边形）
  polygon: (n, gridSize, scale = 1) => {
    const cx = gridSize[0] / 2;
    const cy = gridSize[1] / 2;
    const r = Math.min(cx, cy) * 0.8 * scale;
    const nodes = [];
    const edges = [];
    
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
      nodes.push({
        id: i + 1,
        x: Math.round((cx + r * Math.cos(angle)) * 100) / 100,
        y: Math.round((cy + r * Math.sin(angle)) * 100) / 100
      });
    }
    
    // 连接外圈
    for (let i = 0; i < n; i++) {
      edges.push({ from: i + 1, to: ((i + 1) % n) + 1 });
    }
    
    return { nodes, edges };
  },
  
  // 带中心点的多边形
  polygon_with_center: (n, gridSize, scale = 1) => {
    const base = PATTERN_GENERATORS.polygon(n, gridSize, scale);
    const cx = gridSize[0] / 2;
    const cy = gridSize[1] / 2;
    
    // 添加中心节点
    base.nodes.push({ id: n + 1, x: cx, y: cy });
    
    // 连接中心到所有外围节点
    for (let i = 1; i <= n; i++) {
      base.edges.push({ from: n + 1, to: i });
    }
    
    return base;
  },
  
  // 星形（跳跃连接）
  star: (n, gridSize, scale = 1) => {
    const base = PATTERN_GENERATORS.polygon(n, gridSize, scale);
    const step = Math.floor(n / 2);
    
    // 添加星形交叉边
    for (let i = 0; i < n; i++) {
      const target = ((i + step) % n) + 1;
      if (!hasEdge(base.edges, i + 1, target)) {
        base.edges.push({ from: i + 1, to: target });
      }
    }
    
    return base;
  },
  
  // 双层环
  double_ring: (n, gridSize, scale = 1) => {
    const outer = PATTERN_GENERATORS.polygon(n, gridSize, scale);
    const inner = PATTERN_GENERATORS.polygon(n, gridSize, scale * 0.5);
    
    // 重新编号内层节点
    inner.nodes.forEach((node, i) => {
      node.id = n + i + 1;
    });
    inner.edges.forEach(edge => {
      edge.from += n;
      edge.to += n;
    });
    
    const nodes = [...outer.nodes, ...inner.nodes];
    const edges = [...outer.edges, ...inner.edges];
    
    // 连接内外层
    for (let i = 0; i < n; i++) {
      edges.push({ from: i + 1, to: n + i + 1 });
    }
    
    return { nodes, edges };
  },
  
  // 网格
  grid: (rows, cols, gridSize) => {
    const nodes = [];
    const edges = [];
    const dx = gridSize[0] / (cols + 1);
    const dy = gridSize[1] / (rows + 1);
    
    // 创建节点
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        nodes.push({
          id: r * cols + c + 1,
          x: Math.round((dx * (c + 1)) * 100) / 100,
          y: Math.round((dy * (r + 1)) * 100) / 100
        });
      }
    }
    
    // 连接水平和垂直边
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const id = r * cols + c + 1;
        if (c < cols - 1) {
          edges.push({ from: id, to: id + 1 });
        }
        if (r < rows - 1) {
          edges.push({ from: id, to: id + cols });
        }
      }
    }
    
    return { nodes, edges };
  },
  
  // 蜂窝形
  honeycomb: (gridSize) => {
    const cx = gridSize[0] / 2;
    const cy = gridSize[1] / 2;
    const r = Math.min(cx, cy) * 0.4;
    
    const nodes = [
      { id: 1, x: cx, y: cy - r * 1.5 },
      { id: 2, x: cx + r, y: cy - r * 0.5 },
      { id: 3, x: cx + r, y: cy + r * 0.5 },
      { id: 4, x: cx, y: cy + r * 1.5 },
      { id: 5, x: cx - r, y: cy + r * 0.5 },
      { id: 6, x: cx - r, y: cy - r * 0.5 },
      { id: 7, x: cx, y: cy }
    ];
    
    const edges = [
      { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 },
      { from: 4, to: 5 }, { from: 5, to: 6 }, { from: 6, to: 1 },
      { from: 1, to: 7 }, { from: 2, to: 7 }, { from: 3, to: 7 },
      { from: 4, to: 7 }, { from: 5, to: 7 }, { from: 6, to: 7 }
    ];
    
    return { nodes, edges };
  }
};

// 检查是否已存在边
function hasEdge(edges, from, to) {
  return edges.some(e => 
    (e.from === from && e.to === to) || (e.from === to && e.to === from)
  );
}

// 计算节点度数
function getDegrees(nodes, edges) {
  const degrees = {};
  nodes.forEach(n => degrees[n.id] = 0);
  edges.forEach(e => {
    degrees[e.from]++;
    degrees[e.to]++;
  });
  return degrees;
}

// 获取奇数度节点
function getOddDegreeNodes(nodes, edges) {
  const degrees = getDegrees(nodes, edges);
  return Object.entries(degrees)
    .filter(([id, deg]) => deg % 2 === 1)
    .map(([id]) => parseInt(id));
}

// 检查图是否连通
function isConnected(nodes, edges) {
  if (nodes.length === 0) return true;
  
  const adj = {};
  nodes.forEach(n => adj[n.id] = []);
  edges.forEach(e => {
    adj[e.from].push(e.to);
    adj[e.to].push(e.from);
  });
  
  const visited = new Set();
  const queue = [nodes[0].id];
  visited.add(nodes[0].id);
  
  while (queue.length > 0) {
    const curr = queue.shift();
    for (const next of adj[curr]) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }
  
  return visited.size === nodes.length;
}

// 修复欧拉条件（确保奇数度节点为0或2）
function fixEulerCondition(nodes, edges, maxAttempts = 100) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const oddNodes = getOddDegreeNodes(nodes, edges);
    
    if (oddNodes.length === 0 || oddNodes.length === 2) {
      return true; // 已满足欧拉条件
    }
    
    // 尝试添加边来配对奇数度节点
    if (oddNodes.length >= 2) {
      // 随机选择两个奇数度节点
      const shuffled = oddNodes.sort(() => Math.random() - 0.5);
      const n1 = shuffled[0];
      const n2 = shuffled[1];
      
      // 检查是否可以添加边
      if (!hasEdge(edges, n1, n2)) {
        edges.push({ from: n1, to: n2 });
      } else {
        // 如果边已存在，尝试移除它（这会改变两个节点的度数）
        const idx = edges.findIndex(e => 
          (e.from === n1 && e.to === n2) || (e.from === n2 && e.to === n1)
        );
        if (idx !== -1) {
          edges.splice(idx, 1);
        }
      }
    }
  }
  
  return getOddDegreeNodes(nodes, edges).length <= 2;
}

// 计算关卡指纹（用于去重）
function getLevelFingerprint(level) {
  const nodeCount = level.nodes.length;
  const edgeCount = level.edges.length;
  const degrees = getDegrees(level.nodes, level.edges);
  const degreeSeq = Object.values(degrees).sort((a, b) => a - b).join(',');
  return `${nodeCount}-${edgeCount}-${degreeSeq}`;
}

// 生成随机关卡
function generateLevel(levelId, difficulty, existingFingerprints = new Set()) {
  const config = DIFFICULTY_TEMPLATES[difficulty];
  if (!config) throw new Error(`Invalid difficulty: ${difficulty}`);
  
  const maxAttempts = 50;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // 随机选择节点数
    const nodeCount = randomInt(config.nodeRange[0], config.nodeRange[1]);
    
    // 选择生成模式
    const patterns = ['polygon', 'polygon_with_center', 'star', 'grid', 'double_ring', 'honeycomb'];
    const pattern = patterns[randomInt(0, patterns.length - 1)];
    
    let level;
    const gridSize = [
      randomInt(config.gridSize[0], config.gridSize[0] + 1),
      randomInt(config.gridSize[1], config.gridSize[1] + 1)
    ];
    
    try {
      switch (pattern) {
        case 'polygon':
          level = PATTERN_GENERATORS.polygon(nodeCount, gridSize);
          break;
        case 'polygon_with_center':
          level = PATTERN_GENERATORS.polygon_with_center(nodeCount - 1, gridSize);
          break;
        case 'star':
          level = PATTERN_GENERATORS.star(Math.max(5, nodeCount), gridSize);
          break;
        case 'grid':
          const rows = Math.max(2, Math.floor(Math.sqrt(nodeCount)));
          const cols = Math.max(2, Math.ceil(nodeCount / rows));
          level = PATTERN_GENERATORS.grid(rows, cols, gridSize);
          break;
        case 'double_ring':
          const n = Math.max(3, Math.floor(nodeCount / 2));
          level = PATTERN_GENERATORS.double_ring(n, gridSize);
          break;
        case 'honeycomb':
          level = PATTERN_GENERATORS.honeycomb(gridSize);
          break;
        default:
          level = PATTERN_GENERATORS.polygon(nodeCount, gridSize);
      }
    } catch (e) {
      continue;
    }
    
    // 根据难度添加额外的边
    const targetEdges = randomInt(config.edgeRange[0], config.edgeRange[1]);
    while (level.edges.length < targetEdges && level.nodes.length >= 2) {
      const n1 = randomInt(1, level.nodes.length);
      const n2 = randomInt(1, level.nodes.length);
      if (n1 !== n2 && !hasEdge(level.edges, n1, n2)) {
        level.edges.push({ from: n1, to: n2 });
      }
    }
    
    // 确保图连通
    if (!isConnected(level.nodes, level.edges)) {
      continue;
    }
    
    // 修复欧拉条件
    if (!fixEulerCondition(level.nodes, level.edges)) {
      continue;
    }
    
    // 检查去重
    const fingerprint = getLevelFingerprint(level);
    if (existingFingerprints.has(fingerprint)) {
      continue;
    }
    
    // 创建最终关卡对象
    const finalLevel = {
      levelId,
      difficulty,
      gridSize: [
        Math.ceil(Math.max(...level.nodes.map(n => n.x)) + 1),
        Math.ceil(Math.max(...level.nodes.map(n => n.y)) + 1)
      ],
      nodes: level.nodes,
      edges: level.edges
    };
    
    return { level: finalLevel, fingerprint };
  }
  
  return null;
}

// 随机整数
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 验证关卡
function validateLevel(level) {
  const oddNodes = getOddDegreeNodes(level.nodes, level.edges);
  const connected = isConnected(level.nodes, level.edges);
  
  return {
    valid: (oddNodes.length === 0 || oddNodes.length === 2) && connected,
    oddDegreeCount: oddNodes.length,
    isConnected: connected,
    nodeCount: level.nodes.length,
    edgeCount: level.edges.length
  };
}

// 批量生成关卡
function generateLevels(startId, endId, difficulty, existingLevels = []) {
  const existingFingerprints = new Set();
  
  // 计算现有关卡的指纹
  existingLevels.forEach(level => {
    existingFingerprints.add(getLevelFingerprint(level));
  });
  
  const newLevels = [];
  
  for (let id = startId; id <= endId; id++) {
    const result = generateLevel(id, difficulty, existingFingerprints);
    if (result) {
      newLevels.push(result.level);
      existingFingerprints.add(result.fingerprint);
      console.log(`✓ 生成第${id}关: ${result.level.nodes.length}节点, ${result.level.edges.length}边`);
    } else {
      console.log(`✗ 第${id}关生成失败，重试...`);
      id--; // 重试当前关卡
    }
  }
  
  return newLevels;
}

// 格式化输出为JS代码
function formatLevelToJS(level) {
  const nodesStr = level.nodes.map(n => 
    `{"id":${n.id},"x":${n.x},"y":${n.y}}`
  ).join(',');
  
  const edgesStr = level.edges.map(e => 
    `{"from":${e.from},"to":${e.to}}`
  ).join(',');
  
  return `  {"levelId":${level.levelId},"difficulty":${level.difficulty},"gridSize":[${level.gridSize.join(',')}],
   "nodes":[${nodesStr}],
   "edges":[${edgesStr}]}`;
}

// 导出模块
module.exports = {
  DIFFICULTY_TEMPLATES,
  PATTERN_GENERATORS,
  generateLevel,
  generateLevels,
  validateLevel,
  formatLevelToJS,
  getLevelFingerprint,
  getOddDegreeNodes,
  isConnected,
  fixEulerCondition
};

// 如果直接运行
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.log('用法: node levelGenerator.js <起始关卡ID> <结束关卡ID> <难度1-5>');
    console.log('示例: node levelGenerator.js 71 80 5');
    process.exit(1);
  }
  
  const startId = parseInt(args[0]);
  const endId = parseInt(args[1]);
  const difficulty = parseInt(args[2]);
  
  console.log(`\n========== 生成第${startId}-${endId}关 (难度${difficulty}) ==========\n`);
  
  // 读取现有关卡
  let existingLevels = [];
  try {
    existingLevels = require('../data/levels.js');
    console.log(`已加载 ${existingLevels.length} 个现有关卡\n`);
  } catch (e) {
    console.log('未找到现有关卡文件，将生成全新关卡\n');
  }
  
  const newLevels = generateLevels(startId, endId, difficulty, existingLevels);
  
  console.log(`\n========== 生成完成 ==========\n`);
  console.log('生成的关卡代码:\n');
  
  newLevels.forEach(level => {
    console.log(formatLevelToJS(level) + ',\n');
  });
  
  // 验证所有生成的关卡
  console.log('\n========== 验证结果 ==========\n');
  let allValid = true;
  newLevels.forEach(level => {
    const result = validateLevel(level);
    const status = result.valid ? '✓' : '✗';
    console.log(`第${level.levelId}关: ${status} (${result.nodeCount}节点, ${result.edgeCount}边, 奇数度=${result.oddDegreeCount})`);
    if (!result.valid) allValid = false;
  });
  
  if (allValid) {
    console.log('\n✅ 所有关卡验证通过！');
  } else {
    console.log('\n❌ 部分关卡验证失败');
  }
}

