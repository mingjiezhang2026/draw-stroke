/**
 * 修复视觉重叠问题 - 移除穿过节点的边
 */

const fs = require('fs');
const path = require('path');

// 检查一条边是否视觉上经过某个节点
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

// 获取关卡中所有穿过节点的边
function getOverlappingEdges(level) {
  const overlapping = [];
  level.edges.forEach((edge, idx) => {
    level.nodes.forEach(node => {
      if (edgePassesThroughNode(edge, level.nodes, node.id)) {
        overlapping.push({ idx, edge, throughNode: node.id });
      }
    });
  });
  return overlapping;
}

// 检查边是否存在
function hasEdge(edges, from, to) {
  return edges.some(e => 
    (e.from === from && e.to === to) || (e.from === to && e.to === from)
  );
}

// 获取奇数度节点
function getOddDegreeNodes(nodes, edges) {
  const deg = {};
  nodes.forEach(n => deg[n.id] = 0);
  edges.forEach(e => { deg[e.from]++; deg[e.to]++; });
  return Object.entries(deg).filter(([id, d]) => d % 2 === 1).map(([id]) => parseInt(id));
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

// 检查添加边是否会穿过其他节点
function wouldPassThroughNode(from, to, nodes) {
  const edge = { from, to };
  for (const node of nodes) {
    if (edgePassesThroughNode(edge, nodes, node.id)) {
      return true;
    }
  }
  return false;
}

// 获取所有可安全添加的边（不穿过其他节点）
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

// 修复单个关卡
function fixLevel(level) {
  const overlapping = getOverlappingEdges(level);
  
  if (overlapping.length === 0) {
    return { fixed: false, level };
  }
  
  console.log(`  发现 ${overlapping.length} 条穿过节点的边`);
  
  // 移除所有穿过节点的边
  const edgesToRemove = new Set(overlapping.map(o => o.idx));
  let newEdges = level.edges.filter((e, idx) => !edgesToRemove.has(idx));
  
  // 检查连通性
  if (!isConnected(level.nodes, newEdges)) {
    console.log(`  ⚠ 移除后图不连通，尝试添加安全边`);
    // 添加安全边来保持连通
    const safeEdges = getSafeEdges(level.nodes, newEdges);
    for (const safe of safeEdges) {
      newEdges.push(safe);
      if (isConnected(level.nodes, newEdges)) break;
    }
  }
  
  // 修复欧拉条件
  let oddNodes = getOddDegreeNodes(level.nodes, newEdges);
  const safeEdges = getSafeEdges(level.nodes, newEdges);
  
  let attempts = 0;
  while (oddNodes.length !== 0 && oddNodes.length !== 2 && attempts < 100) {
    attempts++;
    
    // 尝试添加连接两个奇数度节点的安全边
    let added = false;
    for (let i = 0; i < oddNodes.length && !added; i++) {
      for (let j = i + 1; j < oddNodes.length && !added; j++) {
        const n1 = oddNodes[i];
        const n2 = oddNodes[j];
        if (!hasEdge(newEdges, n1, n2) && !wouldPassThroughNode(n1, n2, level.nodes)) {
          newEdges.push({ from: n1, to: n2 });
          added = true;
        }
      }
    }
    
    // 如果没有找到合适的边，尝试添加任意安全边
    if (!added) {
      const available = getSafeEdges(level.nodes, newEdges);
      if (available.length > 0) {
        newEdges.push(available[0]);
      } else {
        break;
      }
    }
    
    oddNodes = getOddDegreeNodes(level.nodes, newEdges);
  }
  
  // 验证修复结果
  const finalOdd = getOddDegreeNodes(level.nodes, newEdges);
  const connected = isConnected(level.nodes, newEdges);
  const noOverlap = getOverlappingEdges({ ...level, edges: newEdges }).length === 0;
  
  if ((finalOdd.length === 0 || finalOdd.length === 2) && connected && noOverlap) {
    return {
      fixed: true,
      level: { ...level, edges: newEdges }
    };
  }
  
  return { fixed: false, level, reason: '无法修复' };
}

// 主函数
function main() {
  const levelsPath = path.join(__dirname, '../data/levels.js');
  
  delete require.cache[require.resolve(levelsPath)];
  const levels = require(levelsPath);
  
  console.log(`加载了 ${levels.length} 个关卡\n`);
  console.log('========== 检查并修复视觉重叠问题 ==========\n');
  
  let fixedCount = 0;
  let failedCount = 0;
  const failedLevels = [];
  
  const newLevels = levels.map(level => {
    const overlapping = getOverlappingEdges(level);
    
    if (overlapping.length === 0) {
      return level;
    }
    
    console.log(`第${level.levelId}关:`);
    const result = fixLevel(level);
    
    if (result.fixed) {
      console.log(`  ✓ 修复成功 (${result.level.edges.length}边)\n`);
      fixedCount++;
      return result.level;
    } else {
      console.log(`  ✗ 修复失败: ${result.reason || '未知原因'}\n`);
      failedCount++;
      failedLevels.push(level.levelId);
      return level;
    }
  });
  
  console.log('========== 结果 ==========\n');
  console.log(`修复成功: ${fixedCount}`);
  console.log(`修复失败: ${failedCount}`);
  
  if (failedLevels.length > 0) {
    console.log(`失败关卡: ${failedLevels.join(', ')}`);
  }
  
  // 保存修复后的关卡
  if (fixedCount > 0) {
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
  }
  
  // 最终验证
  console.log('\n========== 最终验证 ==========\n');
  delete require.cache[require.resolve(levelsPath)];
  const verifyLevels = require(levelsPath);
  
  let stillHasIssues = 0;
  verifyLevels.forEach(level => {
    const overlapping = getOverlappingEdges(level);
    if (overlapping.length > 0) {
      console.log(`第${level.levelId}关仍有 ${overlapping.length} 条问题边`);
      stillHasIssues++;
    }
  });
  
  if (stillHasIssues === 0) {
    console.log('✅ 所有关卡都没有视觉重叠问题！');
  } else {
    console.log(`\n❌ 仍有 ${stillHasIssues} 个关卡存在问题`);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  edgePassesThroughNode,
  getOverlappingEdges,
  fixLevel
};

