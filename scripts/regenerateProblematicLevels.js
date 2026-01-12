/**
 * 重新生成有视觉重叠问题的关卡
 * 针对关卡: 30, 33, 41, 43, 54, 60, 63, 69
 */

const fs = require('fs');
const path = require('path');

// 问题关卡及其难度
const PROBLEMATIC_LEVELS = [
  { levelId: 30, difficulty: 2 },
  { levelId: 33, difficulty: 2 },
  { levelId: 41, difficulty: 3 },
  { levelId: 43, difficulty: 3 },
  { levelId: 54, difficulty: 4 },
  { levelId: 60, difficulty: 4 },
  { levelId: 63, difficulty: 4 },
  { levelId: 69, difficulty: 4 }
];

// 难度模板配置
const DIFFICULTY_TEMPLATES = {
  2: {
    name: '熟练期',
    nodeRange: [5, 8],
    edgeRange: [7, 12],
    gridSize: [4, 5]
  },
  3: {
    name: '思考期',
    nodeRange: [6, 9],
    edgeRange: [10, 15],
    gridSize: [4, 5]
  },
  4: {
    name: '压力期',
    nodeRange: [7, 10],
    edgeRange: [12, 20],
    gridSize: [5, 6]
  }
};

// 检查边是否穿过节点
function edgePassesThroughNode(edge, nodes, targetNode) {
  const n1 = nodes.find(n => n.id === edge.from);
  const n2 = nodes.find(n => n.id === edge.to);
  const target = nodes.find(n => n.id === targetNode);
  
  if (!n1 || !n2 || !target) return false;
  if (edge.from === targetNode || edge.to === targetNode) return false;
  
  const x1 = n1.x, y1 = n1.y;
  const x2 = n2.x, y2 = n2.y;
  const px = target.x, py = target.y;
  
  // 向量叉积判断共线
  const cross = (x2 - x1) * (py - y1) - (y2 - y1) * (px - x1);
  if (Math.abs(cross) > 0.01) return false;
  
  // 检查是否在线段范围内
  const minX = Math.min(x1, x2), maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2), maxY = Math.max(y1, y2);
  
  return px >= minX - 0.01 && px <= maxX + 0.01 && 
         py >= minY - 0.01 && py <= maxY + 0.01;
}

// 检查关卡是否有视觉重叠
function hasVisualOverlap(level) {
  for (const edge of level.edges) {
    for (const node of level.nodes) {
      if (edgePassesThroughNode(edge, level.nodes, node.id)) {
        return true;
      }
    }
  }
  return false;
}

// 检查边是否会穿过任何节点
function wouldPassThroughNode(from, to, nodes) {
  const edge = { from, to };
  for (const node of nodes) {
    if (edgePassesThroughNode(edge, nodes, node.id)) {
      return true;
    }
  }
  return false;
}

// 检查边是否存在
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

// 检查图连通性
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

// 获取可安全添加的边（不穿过其他节点）
function getSafeEdges(nodes, existingEdges) {
  const safe = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const n1 = nodes[i].id;
      const n2 = nodes[j].id;
      if (!hasEdge(existingEdges, n1, n2) && !wouldPassThroughNode(n1, n2, nodes)) {
        safe.push({ from: n1, to: n2 });
      }
    }
  }
  return safe;
}

// 随机整数
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 随机打乱数组
function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// 安全的节点布局 - 避免三点共线
function generateSafeNodes(count, gridSize) {
  const nodes = [];
  const maxAttempts = 100;
  
  // 使用非规则网格避免共线问题
  const positions = [];
  
  // 生成候选位置（非规则网格）
  for (let i = 0; i < gridSize[0] * 2; i++) {
    for (let j = 0; j < gridSize[1] * 2; j++) {
      // 添加随机偏移
      const x = (i * 0.5) + (Math.random() * 0.3 - 0.15);
      const y = (j * 0.5) + (Math.random() * 0.3 - 0.15);
      if (x >= 0 && x <= gridSize[0] && y >= 0 && y <= gridSize[1]) {
        positions.push({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
      }
    }
  }
  
  // 随机打乱位置
  const shuffled = shuffle(positions);
  
  // 选择节点位置，确保不共线
  for (const pos of shuffled) {
    if (nodes.length >= count) break;
    
    // 检查是否与现有节点共线
    let isValid = true;
    for (let i = 0; i < nodes.length && isValid; i++) {
      for (let j = i + 1; j < nodes.length && isValid; j++) {
        const n1 = nodes[i];
        const n2 = nodes[j];
        
        // 检查三点是否共线
        const cross = (n2.x - n1.x) * (pos.y - n1.y) - (n2.y - n1.y) * (pos.x - n1.x);
        if (Math.abs(cross) < 0.05) {
          // 检查是否在两点之间
          const minX = Math.min(n1.x, n2.x);
          const maxX = Math.max(n1.x, n2.x);
          const minY = Math.min(n1.y, n2.y);
          const maxY = Math.max(n1.y, n2.y);
          
          if (pos.x >= minX - 0.1 && pos.x <= maxX + 0.1 &&
              pos.y >= minY - 0.1 && pos.y <= maxY + 0.1) {
            isValid = false;
          }
        }
      }
    }
    
    // 检查与现有节点的距离
    for (const n of nodes) {
      const dist = Math.sqrt((n.x - pos.x) ** 2 + (n.y - pos.y) ** 2);
      if (dist < 0.4) {
        isValid = false;
        break;
      }
    }
    
    if (isValid) {
      nodes.push({ id: nodes.length + 1, x: pos.x, y: pos.y });
    }
  }
  
  return nodes;
}

// 生成单个安全关卡
function generateSafeLevel(levelId, difficulty, existingFingerprints = new Set()) {
  const config = DIFFICULTY_TEMPLATES[difficulty];
  if (!config) throw new Error(`Invalid difficulty: ${difficulty}`);
  
  const maxAttempts = 200;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const nodeCount = randomInt(config.nodeRange[0], config.nodeRange[1]);
    const gridSize = [...config.gridSize];
    
    // 生成安全的节点布局
    const nodes = generateSafeNodes(nodeCount, gridSize);
    
    if (nodes.length < nodeCount) continue;
    
    // 获取所有可安全添加的边
    const safeEdges = getSafeEdges(nodes, []);
    
    if (safeEdges.length < config.edgeRange[0]) continue;
    
    // 随机选择边
    const shuffledEdges = shuffle(safeEdges);
    const targetEdgeCount = randomInt(
      Math.min(config.edgeRange[0], shuffledEdges.length),
      Math.min(config.edgeRange[1], shuffledEdges.length)
    );
    
    let edges = [];
    
    // 首先确保图连通 - 构建生成树
    const connected = new Set([1]);
    const unconnected = new Set(nodes.map(n => n.id).filter(id => id !== 1));
    
    while (unconnected.size > 0) {
      let foundEdge = false;
      for (const edge of shuffledEdges) {
        const inA = connected.has(edge.from);
        const inB = connected.has(edge.to);
        
        if ((inA && !inB) || (!inA && inB)) {
          edges.push(edge);
          connected.add(edge.from);
          connected.add(edge.to);
          unconnected.delete(edge.from);
          unconnected.delete(edge.to);
          foundEdge = true;
          break;
        }
      }
      
      if (!foundEdge) break;
    }
    
    if (unconnected.size > 0) continue;
    
    // 添加更多边直到达到目标数量
    for (const edge of shuffledEdges) {
      if (edges.length >= targetEdgeCount) break;
      if (!hasEdge(edges, edge.from, edge.to)) {
        edges.push(edge);
      }
    }
    
    // 修复欧拉条件
    let oddNodes = getOddDegreeNodes(nodes, edges);
    let fixAttempts = 0;
    
    while (oddNodes.length !== 0 && oddNodes.length !== 2 && fixAttempts < 50) {
      fixAttempts++;
      
      // 尝试添加连接两个奇数度节点的边
      let added = false;
      for (let i = 0; i < oddNodes.length && !added; i++) {
        for (let j = i + 1; j < oddNodes.length && !added; j++) {
          const n1 = oddNodes[i];
          const n2 = oddNodes[j];
          if (!hasEdge(edges, n1, n2) && !wouldPassThroughNode(n1, n2, nodes)) {
            edges.push({ from: n1, to: n2 });
            added = true;
          }
        }
      }
      
      if (!added) {
        // 尝试移除一条边
        const availableEdges = getSafeEdges(nodes, edges);
        if (availableEdges.length > 0) {
          edges.push(availableEdges[randomInt(0, availableEdges.length - 1)]);
        } else {
          break;
        }
      }
      
      oddNodes = getOddDegreeNodes(nodes, edges);
    }
    
    // 验证结果
    const finalOdd = getOddDegreeNodes(nodes, edges);
    const connected2 = isConnected(nodes, edges);
    
    if ((finalOdd.length !== 0 && finalOdd.length !== 2) || !connected2) continue;
    
    // 创建关卡
    const level = {
      levelId,
      difficulty,
      gridSize: [
        Math.ceil(Math.max(...nodes.map(n => n.x)) + 1),
        Math.ceil(Math.max(...nodes.map(n => n.y)) + 1)
      ],
      nodes,
      edges
    };
    
    // 最终检查视觉重叠
    if (hasVisualOverlap(level)) continue;
    
    // 检查指纹去重
    const fingerprint = `${nodes.length}-${edges.length}-${Object.values(getDegrees(nodes, edges)).sort((a,b)=>a-b).join(',')}`;
    if (existingFingerprints.has(fingerprint)) continue;
    
    return { level, fingerprint };
  }
  
  return null;
}

// 主函数
function main() {
  const levelsPath = path.join(__dirname, '../data/levels.js');
  
  delete require.cache[require.resolve(levelsPath)];
  const levels = require(levelsPath);
  
  console.log(`加载了 ${levels.length} 个关卡\n`);
  console.log('========== 为问题关卡生成替换数据 ==========\n');
  
  // 计算现有关卡的指纹
  const existingFingerprints = new Set();
  levels.forEach(level => {
    const degrees = getDegrees(level.nodes, level.edges);
    const fingerprint = `${level.nodes.length}-${level.edges.length}-${Object.values(degrees).sort((a,b)=>a-b).join(',')}`;
    existingFingerprints.add(fingerprint);
  });
  
  const newLevels = [...levels];
  let successCount = 0;
  let failCount = 0;
  
  for (const { levelId, difficulty } of PROBLEMATIC_LEVELS) {
    console.log(`生成第${levelId}关 (难度${difficulty})...`);
    
    let success = false;
    for (let retry = 0; retry < 10 && !success; retry++) {
      const result = generateSafeLevel(levelId, difficulty, existingFingerprints);
      
      if (result) {
        // 替换关卡
        const idx = newLevels.findIndex(l => l.levelId === levelId);
        if (idx !== -1) {
          newLevels[idx] = result.level;
          existingFingerprints.add(result.fingerprint);
          console.log(`  ✓ 成功 (${result.level.nodes.length}节点, ${result.level.edges.length}边)`);
          successCount++;
          success = true;
        }
      }
    }
    
    if (!success) {
      console.log(`  ✗ 失败，保留原关卡`);
      failCount++;
    }
  }
  
  console.log('\n========== 结果 ==========\n');
  console.log(`成功替换: ${successCount}`);
  console.log(`失败: ${failCount}`);
  
  // 最终验证
  console.log('\n========== 最终验证 ==========\n');
  let stillHasIssues = 0;
  
  for (const { levelId } of PROBLEMATIC_LEVELS) {
    const level = newLevels.find(l => l.levelId === levelId);
    if (level && hasVisualOverlap(level)) {
      console.log(`第${levelId}关仍有视觉重叠问题`);
      stillHasIssues++;
    } else {
      console.log(`第${levelId}关 ✓`);
    }
  }
  
  if (stillHasIssues === 0) {
    // 保存到文件
    const header = `// 一笔画完关卡配置 - 已修复视觉重叠问题
// 规则：必须走完所有边，每条边只能走一次
// 修复时间: ${new Date().toISOString()}

module.exports = [
`;
    
    const formatLevel = (level) => {
      const nodesStr = level.nodes.map(n => 
        `{"id":${n.id},"x":${n.x},"y":${n.y}}`
      ).join(',');
      
      const edgesStr = level.edges.map(e => 
        `{"from":${e.from},"to":${e.to}}`
      ).join(',');
      
      return `  // ${level.levelId}
  {"levelId":${level.levelId},"difficulty":${level.difficulty},"gridSize":[${level.gridSize.join(',')}],
   "nodes":[${nodesStr}],
   "edges":[${edgesStr}]}`;
    };
    
    const content = header + newLevels.map(formatLevel).join(',\n\n') + '\n];\n';
    fs.writeFileSync(levelsPath, content, 'utf8');
    console.log(`\n✅ 已保存到 ${levelsPath}`);
  } else {
    console.log(`\n❌ 仍有 ${stillHasIssues} 个关卡存在问题，未保存`);
  }
}

if (require.main === module) {
  main();
}

module.exports = { generateSafeLevel, hasVisualOverlap };

