/**
 * 关卡修复和生成工具
 * 功能：
 * 1. 检测并修复有问题的关卡
 * 2. 生成指定范围的新关卡
 * 3. 确保不与现有关卡重复
 * 4. 自动更新 levels.js 文件
 */

const fs = require('fs');
const path = require('path');
const generator = require('./levelGenerator.js');

// GameEngine 简化版，用于验证
class SimpleGameEngine {
  constructor(levelConfig) {
    this.levelConfig = levelConfig;
    this.graph = this.buildGraph();
    this.state = {
      currentNode: null,
      visitedEdges: new Set(),
      path: [],
      totalEdges: levelConfig.edges.length,
      status: 'playing'
    };
  }

  buildGraph() {
    const graph = {};
    this.levelConfig.nodes.forEach(node => {
      graph[node.id] = [];
    });
    this.levelConfig.edges.forEach((edge, idx) => {
      const key = `${Math.min(edge.from, edge.to)}-${Math.max(edge.from, edge.to)}`;
      graph[edge.from].push({ to: edge.to, key });
      graph[edge.to].push({ to: edge.from, key });
    });
    return graph;
  }

  getAvailableEdges(nodeId) {
    if (!this.graph[nodeId]) return [];
    return this.graph[nodeId].filter(e => !this.state.visitedEdges.has(e.key));
  }

  canMove(toNodeId) {
    if (this.state.currentNode === null) return true;
    const available = this.getAvailableEdges(this.state.currentNode);
    return available.some(e => e.to === toNodeId);
  }

  moveTo(nodeId) {
    if (!this.canMove(nodeId)) return false;
    
    if (this.state.currentNode !== null) {
      const key = `${Math.min(this.state.currentNode, nodeId)}-${Math.max(this.state.currentNode, nodeId)}`;
      this.state.visitedEdges.add(key);
    }
    
    this.state.currentNode = nodeId;
    this.state.path.push(nodeId);
    
    if (this.state.visitedEdges.size === this.state.totalEdges) {
      this.state.status = 'success';
    } else if (this.getAvailableEdges(nodeId).length === 0) {
      this.state.status = 'failed';
    }
    
    return true;
  }

  // 使用DFS找到可行解
  findSolution(visited = new Set(), currentNode = null, path = []) {
    if (visited.size === this.state.totalEdges) {
      return path;
    }

    const startNodes = currentNode === null 
      ? this.levelConfig.nodes.map(n => n.id)
      : [currentNode];

    for (const node of startNodes) {
      if (currentNode === null) {
        // 尝试从这个节点开始
        const result = this.findSolution(visited, node, [node]);
        if (result) return result;
      } else {
        // 尝试走到相邻节点
        const neighbors = this.graph[node] || [];
        for (const edge of neighbors) {
          if (!visited.has(edge.key)) {
            const newVisited = new Set(visited);
            newVisited.add(edge.key);
            const result = this.findSolution(newVisited, edge.to, [...path, edge.to]);
            if (result) return result;
          }
        }
      }
    }

    return null;
  }

  getHint() {
    const solution = this.findSolution(this.state.visitedEdges, this.state.currentNode, [...this.state.path]);
    if (!solution) return null;
    
    const nextIdx = this.state.path.length;
    return solution[nextIdx] || null;
  }
}

// 完整验证关卡（包括可解性测试）
function fullValidateLevel(level) {
  // 1. 检查欧拉条件
  const oddNodes = generator.getOddDegreeNodes(level.nodes, level.edges);
  if (oddNodes.length !== 0 && oddNodes.length !== 2) {
    return { valid: false, reason: `欧拉条件不满足 (奇数度=${oddNodes.length})` };
  }

  // 2. 检查连通性
  if (!generator.isConnected(level.nodes, level.edges)) {
    return { valid: false, reason: '图不连通' };
  }

  // 3. 检查实际可解性
  const engine = new SimpleGameEngine(level);
  const solution = engine.findSolution();
  if (!solution) {
    return { valid: false, reason: '无法找到解决方案' };
  }

  return { 
    valid: true, 
    nodeCount: level.nodes.length, 
    edgeCount: level.edges.length,
    oddDegree: oddNodes.length
  };
}

// 根据难度模板生成替换关卡
function generateReplacementLevel(levelId, difficulty, existingLevels) {
  const existingFingerprints = new Set();
  existingLevels.forEach(l => {
    if (l.levelId !== levelId) {
      existingFingerprints.add(generator.getLevelFingerprint(l));
    }
  });

  for (let attempt = 0; attempt < 100; attempt++) {
    const result = generator.generateLevel(levelId, difficulty, existingFingerprints);
    if (result) {
      const validation = fullValidateLevel(result.level);
      if (validation.valid) {
        return result.level;
      }
    }
  }
  return null;
}

// 检查所有关卡并修复问题关卡
function checkAndFixLevels(levels) {
  console.log('========== 检查所有关卡 ==========\n');
  
  const problems = [];
  const fixed = [];
  
  levels.forEach(level => {
    const validation = fullValidateLevel(level);
    if (!validation.valid) {
      problems.push({ levelId: level.levelId, reason: validation.reason, difficulty: level.difficulty });
    }
  });

  if (problems.length === 0) {
    console.log('✅ 所有关卡验证通过！\n');
    return levels;
  }

  console.log(`发现 ${problems.length} 个问题关卡:\n`);
  problems.forEach(p => {
    console.log(`  第${p.levelId}关: ${p.reason}`);
  });

  console.log('\n========== 开始修复 ==========\n');

  const newLevels = [...levels];
  
  for (const problem of problems) {
    console.log(`修复第${problem.levelId}关...`);
    const newLevel = generateReplacementLevel(problem.levelId, problem.difficulty, newLevels);
    
    if (newLevel) {
      const idx = newLevels.findIndex(l => l.levelId === problem.levelId);
      if (idx !== -1) {
        newLevels[idx] = newLevel;
        fixed.push(problem.levelId);
        console.log(`  ✓ 修复成功 (${newLevel.nodes.length}节点, ${newLevel.edges.length}边)`);
      }
    } else {
      console.log(`  ✗ 修复失败`);
    }
  }

  console.log(`\n修复完成: ${fixed.length}/${problems.length} 个关卡`);
  
  return newLevels;
}

// 生成新关卡并追加
function generateAndAppendLevels(existingLevels, startId, endId, difficulty) {
  console.log(`\n========== 生成第${startId}-${endId}关 (难度${difficulty}) ==========\n`);
  
  const existingFingerprints = new Set();
  existingLevels.forEach(l => existingFingerprints.add(generator.getLevelFingerprint(l)));

  const newLevels = [];
  
  for (let id = startId; id <= endId; id++) {
    let success = false;
    for (let attempt = 0; attempt < 100 && !success; attempt++) {
      const result = generator.generateLevel(id, difficulty, existingFingerprints);
      if (result) {
        const validation = fullValidateLevel(result.level);
        if (validation.valid) {
          newLevels.push(result.level);
          existingFingerprints.add(result.fingerprint);
          console.log(`✓ 第${id}关: ${validation.nodeCount}节点, ${validation.edgeCount}边`);
          success = true;
        }
      }
    }
    if (!success) {
      console.log(`✗ 第${id}关: 生成失败，跳过`);
    }
  }

  return [...existingLevels, ...newLevels];
}

// 保存关卡到文件
function saveLevelsToFile(levels, filePath) {
  const header = `// 一笔画完关卡配置 - 自动生成版本
// 规则：必须走完所有边，每条边只能走一次
// 生成时间: ${new Date().toISOString()}

module.exports = [
`;

  const levelStrings = levels.map(level => generator.formatLevelToJS(level));
  const content = header + levelStrings.join(',\n\n') + '\n];\n';
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`\n✅ 已保存到 ${filePath}`);
}

// 主函数
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const levelsPath = path.join(__dirname, '../data/levels.js');
  let levels = [];
  
  try {
    // 清除缓存重新加载
    delete require.cache[require.resolve(levelsPath)];
    levels = require(levelsPath);
    console.log(`已加载 ${levels.length} 个关卡\n`);
  } catch (e) {
    console.log('未找到关卡文件，将创建新文件\n');
  }

  switch (command) {
    case 'check':
      // 只检查不修复
      levels.forEach(level => {
        const v = fullValidateLevel(level);
        const status = v.valid ? '✓' : '✗';
        console.log(`第${level.levelId}关: ${status} ${v.valid ? `(${v.nodeCount}节点, ${v.edgeCount}边)` : v.reason}`);
      });
      break;

    case 'fix':
      // 检查并修复
      const fixedLevels = checkAndFixLevels(levels);
      saveLevelsToFile(fixedLevels, levelsPath);
      break;

    case 'generate':
      // 生成新关卡
      if (args.length < 4) {
        console.log('用法: node fixAndGenerateLevels.js generate <起始ID> <结束ID> <难度>');
        process.exit(1);
      }
      const startId = parseInt(args[1]);
      const endId = parseInt(args[2]);
      const difficulty = parseInt(args[3]);
      const newLevels = generateAndAppendLevels(levels, startId, endId, difficulty);
      saveLevelsToFile(newLevels, levelsPath);
      break;

    default:
      console.log('用法:');
      console.log('  node fixAndGenerateLevels.js check              - 检查所有关卡');
      console.log('  node fixAndGenerateLevels.js fix                - 检查并修复问题关卡');
      console.log('  node fixAndGenerateLevels.js generate <起始> <结束> <难度> - 生成新关卡');
      console.log('\n难度等级:');
      console.log('  1 - 新手期 (3-6节点, 3-8边)');
      console.log('  2 - 熟练期 (5-8节点, 7-12边)');
      console.log('  3 - 思考期 (6-9节点, 10-15边)');
      console.log('  4 - 压力期 (7-10节点, 12-20边)');
      console.log('  5 - 精通期 (8-12节点, 15-25边)');
  }
}

module.exports = {
  fullValidateLevel,
  generateReplacementLevel,
  checkAndFixLevels,
  generateAndAppendLevels,
  saveLevelsToFile
};

if (require.main === module) {
  main();
}

