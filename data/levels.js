// 一笔画完关卡配置 - 已修复视觉重叠问题
// 规则：必须走完所有边，每条边只能走一次
// 修复时间: 2026-01-12T14:47:04.173Z

module.exports = [
  // 1
  {"levelId":1,"difficulty":1,"gridSize":[3,3],
   "nodes":[{"id":1,"x":1,"y":0},{"id":2,"x":0,"y":2},{"id":3,"x":2,"y":2}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":1}]},

  // 2
  {"levelId":2,"difficulty":1,"gridSize":[3,3],
   "nodes":[{"id":1,"x":0,"y":0},{"id":2,"x":2,"y":0},{"id":3,"x":2,"y":2},{"id":4,"x":0,"y":2}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":1}]},

  // 3
  {"levelId":3,"difficulty":1,"gridSize":[3,3],
   "nodes":[{"id":1,"x":1,"y":0},{"id":2,"x":2,"y":1},{"id":3,"x":1,"y":2},{"id":4,"x":0,"y":1}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":1}]},

  // 4
  {"levelId":4,"difficulty":1,"gridSize":[4,1],
   "nodes":[{"id":1,"x":0,"y":0},{"id":2,"x":1,"y":0},{"id":3,"x":2,"y":0},{"id":4,"x":3,"y":0}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4}]},

  // 5
  {"levelId":5,"difficulty":1,"gridSize":[3,3],
   "nodes":[{"id":1,"x":0,"y":2},{"id":2,"x":1,"y":0},{"id":3,"x":2,"y":2}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3}]},

  // 6
  {"levelId":6,"difficulty":1,"gridSize":[3,3],
   "nodes":[{"id":1,"x":1,"y":0},{"id":2,"x":2,"y":0.8},{"id":3,"x":1.6,"y":2},{"id":4,"x":0.4,"y":2},{"id":5,"x":0,"y":0.8}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":5},{"from":5,"to":1}]},

  // 7
  {"levelId":7,"difficulty":1,"gridSize":[3,4],
   "nodes":[{"id":1,"x":1,"y":0},{"id":2,"x":2,"y":1},{"id":3,"x":1,"y":3},{"id":4,"x":0,"y":1}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":1},{"from":1,"to":3}]},

  // 8
  {"levelId":8,"difficulty":1,"gridSize":[3,3],
   "nodes":[{"id":1,"x":0,"y":0},{"id":2,"x":2,"y":0},{"id":3,"x":2,"y":2},{"id":4,"x":0,"y":2}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":1},{"from":1,"to":3}]},

  // 9
  {"levelId":9,"difficulty":1,"gridSize":[3,4],
   "nodes":[{"id":1,"x":0,"y":1},{"id":2,"x":2,"y":1},{"id":3,"x":2,"y":3},{"id":4,"x":0,"y":3},{"id":5,"x":1,"y":0}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":1},{"from":1,"to":5},{"from":5,"to":2}]},

  // 10
  {"levelId":10,"difficulty":1,"gridSize":[3,3],
   "nodes":[{"id":1,"x":0.5,"y":0},{"id":2,"x":1.5,"y":0},{"id":3,"x":2,"y":1},{"id":4,"x":1.5,"y":2},{"id":5,"x":0.5,"y":2},{"id":6,"x":0,"y":1}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":5},{"from":5,"to":6},{"from":6,"to":1}]},

  // 11
  {"levelId":11,"difficulty":1,"gridSize":[3,3],
   "nodes":[{"id":1,"x":0,"y":0},{"id":2,"x":0,"y":2},{"id":3,"x":1,"y":1},{"id":4,"x":2,"y":0},{"id":5,"x":2,"y":2}],
   "edges":[{"from":1,"to":3},{"from":3,"to":2},{"from":2,"to":1},{"from":3,"to":4},{"from":4,"to":5},{"from":5,"to":3}]},

  // 12
  {"levelId":12,"difficulty":1,"gridSize":[3,3],
   "nodes":[{"id":1,"x":0,"y":0},{"id":2,"x":2,"y":0},{"id":3,"x":1,"y":1},{"id":4,"x":0,"y":2},{"id":5,"x":2,"y":2}],
   "edges":[{"from":1,"to":2},{"from":1,"to":3},{"from":2,"to":3},{"from":3,"to":4},{"from":3,"to":5},{"from":4,"to":5}]},

  // 13
  {"levelId":13,"difficulty":1,"gridSize":[4,3],
   "nodes":[{"id":1,"x":0,"y":0},{"id":2,"x":1.5,"y":0},{"id":3,"x":3,"y":0},{"id":4,"x":0.75,"y":2},{"id":5,"x":2.25,"y":2}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":1,"to":4},{"from":2,"to":4},{"from":2,"to":5},{"from":3,"to":5},{"from":4,"to":5}]},

  // 14
  {"levelId":14,"difficulty":1,"gridSize":[3,4],
   "nodes":[{"id":1,"x":1,"y":0},{"id":2,"x":0,"y":1},{"id":3,"x":2,"y":1},{"id":4,"x":1,"y":2},{"id":5,"x":1,"y":3}],
   "edges":[{"from":1,"to":2},{"from":1,"to":3},{"from":2,"to":4},{"from":3,"to":4},{"from":4,"to":5}]},

  // 15
  {"levelId":15,"difficulty":1,"gridSize":[3,3],
   "nodes":[{"id":1,"x":1,"y":1},{"id":2,"x":1,"y":0},{"id":3,"x":2,"y":1},{"id":4,"x":1,"y":2},{"id":5,"x":0,"y":1}],
   "edges":[{"from":1,"to":2},{"from":1,"to":3},{"from":1,"to":4},{"from":1,"to":5},{"from":2,"to":5}]},

  // 16
  {"levelId":16,"difficulty":1,"gridSize":[3,3],
   "nodes":[{"id":1,"x":0,"y":0},{"id":2,"x":2,"y":0},{"id":3,"x":2,"y":2},{"id":4,"x":0,"y":2}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":1},{"from":2,"to":4}]},

  // 17
  {"levelId":17,"difficulty":1,"gridSize":[5,3],
   "nodes":[{"id":1,"x":0,"y":1},{"id":2,"x":1,"y":0},{"id":3,"x":2,"y":1},{"id":4,"x":1,"y":2},{"id":5,"x":3,"y":0},{"id":6,"x":4,"y":1},{"id":7,"x":3,"y":2}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":1},{"from":3,"to":5},{"from":5,"to":6},{"from":6,"to":7},{"from":7,"to":3}]},

  // 18
  {"levelId":18,"difficulty":1,"gridSize":[3,3],
   "nodes":[{"id":1,"x":1,"y":0},{"id":2,"x":1.8,"y":0.4},{"id":3,"x":2,"y":1.2},{"id":4,"x":1.5,"y":2},{"id":5,"x":0.5,"y":2},{"id":6,"x":0,"y":1.2},{"id":7,"x":0.2,"y":0.4}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":5},{"from":5,"to":6},{"from":6,"to":7},{"from":7,"to":1}]},

  // 19
  {"levelId":19,"difficulty":1,"gridSize":[3,5],
   "nodes":[{"id":1,"x":1,"y":0},{"id":2,"x":0,"y":1},{"id":3,"x":2,"y":1},{"id":4,"x":1,"y":2},{"id":5,"x":0,"y":3},{"id":6,"x":2,"y":3},{"id":7,"x":1,"y":4}],
   "edges":[{"from":1,"to":2},{"from":1,"to":3},{"from":2,"to":4},{"from":3,"to":4},{"from":4,"to":5},{"from":4,"to":6},{"from":5,"to":7},{"from":6,"to":7}]},

  // 20
  {"levelId":20,"difficulty":1,"gridSize":[4,4],
   "nodes":[{"id":1,"x":0,"y":1},{"id":2,"x":2,"y":1},{"id":3,"x":2,"y":3},{"id":4,"x":0,"y":3},{"id":5,"x":1,"y":0},{"id":6,"x":3,"y":2}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":1},{"from":1,"to":5},{"from":5,"to":2},{"from":2,"to":6},{"from":6,"to":3}]},

  // 21
  {"levelId":21,"difficulty":2,"gridSize":[3,3],
   "nodes":[{"id":1,"x":0.6,"y":0},{"id":2,"x":1.4,"y":0},{"id":3,"x":2,"y":0.6},{"id":4,"x":2,"y":1.4},{"id":5,"x":1.4,"y":2},{"id":6,"x":0.6,"y":2},{"id":7,"x":0,"y":1.4},{"id":8,"x":0,"y":0.6}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":5},{"from":5,"to":6},{"from":6,"to":7},{"from":7,"to":8},{"from":8,"to":1}]},

  // 22
  {"levelId":22,"difficulty":2,"gridSize":[5,3],
   "nodes":[{"id":1,"x":0,"y":0},{"id":2,"x":1,"y":0},{"id":3,"x":1,"y":2},{"id":4,"x":0,"y":2},{"id":5,"x":2,"y":0},{"id":6,"x":3,"y":0},{"id":7,"x":3,"y":2},{"id":8,"x":2,"y":2}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":1},{"from":2,"to":5},{"from":5,"to":6},{"from":6,"to":7},{"from":7,"to":8},{"from":8,"to":3}]},

  // 23
  {"levelId":23,"difficulty":2,"gridSize":[5,3],
   "nodes":[{"id":1,"x":0,"y":2},{"id":2,"x":1,"y":0},{"id":3,"x":2,"y":2},{"id":4,"x":3,"y":0},{"id":5,"x":4,"y":2}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":5}]},

  // 24
  {"levelId":24,"difficulty":2,"gridSize":[4,3],
   "nodes":[{"id":1,"x":0.5,"y":0},{"id":2,"x":1.5,"y":0},{"id":3,"x":2,"y":1},{"id":4,"x":1.5,"y":2},{"id":5,"x":0.5,"y":2},{"id":6,"x":0,"y":1},{"id":7,"x":3,"y":1}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":5},{"from":5,"to":6},{"from":6,"to":1},{"from":3,"to":7}]},

  // 25
  {"levelId":25,"difficulty":2,"gridSize":[3,3],
   "nodes":[{"id":1,"x":0,"y":0},{"id":2,"x":2,"y":0},{"id":3,"x":2,"y":2},{"id":4,"x":0,"y":2},{"id":5,"x":1,"y":1}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":1},{"from":1,"to":5},{"from":3,"to":5}]},

  // 26
  {"levelId":26,"difficulty":2,"gridSize":[5,3],
   "nodes":[{"id":1,"x":0,"y":0},{"id":2,"x":0,"y":2},{"id":3,"x":2,"y":1},{"id":4,"x":4,"y":0},{"id":5,"x":4,"y":2}],
   "edges":[{"from":1,"to":3},{"from":3,"to":2},{"from":2,"to":1},{"from":3,"to":4},{"from":4,"to":5},{"from":5,"to":3}]},

  // 27
  {"levelId":27,"difficulty":2,"gridSize":[3,4],
   "nodes":[{"id":1,"x":1,"y":0},{"id":2,"x":0,"y":1},{"id":3,"x":2,"y":1},{"id":4,"x":0,"y":2.5},{"id":5,"x":2,"y":2.5},{"id":6,"x":1,"y":3.5}],
   "edges":[{"from":1,"to":2},{"from":1,"to":3},{"from":2,"to":3},{"from":2,"to":4},{"from":3,"to":5},{"from":4,"to":6},{"from":5,"to":6}]},

  // 28
  {"levelId":28,"difficulty":2,"gridSize":[3,3],
   "nodes":[{"id":1,"x":1,"y":0},{"id":2,"x":2,"y":0.5},{"id":3,"x":2,"y":1.5},{"id":4,"x":1,"y":2},{"id":5,"x":0,"y":1.5},{"id":6,"x":0,"y":0.5},{"id":7,"x":1,"y":1}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":5},{"from":5,"to":6},{"from":6,"to":1},{"from":7,"to":1},{"from":7,"to":4}]},

  // 29
  {"levelId":29,"difficulty":2,"gridSize":[3,3],
   "nodes":[{"id":1,"x":0,"y":0},{"id":2,"x":1,"y":0},{"id":3,"x":2,"y":0},{"id":4,"x":2,"y":1},{"id":5,"x":2,"y":2},{"id":6,"x":1,"y":2},{"id":7,"x":0,"y":2},{"id":8,"x":0,"y":1}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":5},{"from":5,"to":6},{"from":6,"to":7},{"from":7,"to":8},{"from":8,"to":1}]},

  // 30
  {"levelId":30,"difficulty":2,"gridSize":[5,4],
   "nodes":[{"id":1,"x":2.6,"y":1.4},{"id":2,"x":0.6,"y":1},{"id":3,"x":2.9,"y":0.1},{"id":4,"x":3.4,"y":2.6},{"id":5,"x":1.1,"y":1.6},{"id":6,"x":3.4,"y":2}],
   "edges":[{"from":1,"to":2},{"from":2,"to":6},{"from":2,"to":3},{"from":4,"to":6},{"from":4,"to":5},{"from":3,"to":6},{"from":2,"to":5},{"from":1,"to":5},{"from":1,"to":3},{"from":1,"to":4},{"from":3,"to":5}]},

  // 31
  {"levelId":31,"difficulty":2,"gridSize":[3,3],
   "nodes":[{"id":1,"x":0,"y":0},{"id":2,"x":0,"y":1},{"id":3,"x":0,"y":2},{"id":4,"x":1,"y":2},{"id":5,"x":2,"y":2}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":5}]},

  // 32
  {"levelId":32,"difficulty":2,"gridSize":[4,4],
   "nodes":[{"id":1,"x":1.5,"y":1.5},{"id":2,"x":1.5,"y":0},{"id":3,"x":0.5,"y":0.5},{"id":4,"x":3,"y":1.5},{"id":5,"x":2.5,"y":0.5},{"id":6,"x":1.5,"y":3},{"id":7,"x":0,"y":1.5}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":1},{"from":1,"to":4},{"from":4,"to":5},{"from":5,"to":2},{"from":1,"to":6},{"from":6,"to":7},{"from":7,"to":1}]},

  // 33
  {"levelId":33,"difficulty":2,"gridSize":[4,6],
   "nodes":[{"id":1,"x":1.9,"y":0.4},{"id":2,"x":2.6,"y":3.5},{"id":3,"x":2.5,"y":0.1},{"id":4,"x":3,"y":0.4},{"id":5,"x":2.6,"y":2.6},{"id":6,"x":0.5,"y":4.4},{"id":7,"x":2.5,"y":0.6}],
   "edges":[{"from":1,"to":6},{"from":5,"to":6},{"from":3,"to":5},{"from":2,"to":5},{"from":5,"to":7},{"from":4,"to":6},{"from":3,"to":6},{"from":3,"to":4},{"from":1,"to":2}]},

  // 34
  {"levelId":34,"difficulty":2,"gridSize":[3,3],
   "nodes":[{"id":1,"x":1,"y":0},{"id":2,"x":2,"y":0.7},{"id":3,"x":1.7,"y":2},{"id":4,"x":0.3,"y":2},{"id":5,"x":0,"y":0.7}],
   "edges":[{"from":1,"to":3},{"from":3,"to":5},{"from":5,"to":2},{"from":2,"to":4},{"from":4,"to":1},{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":5},{"from":5,"to":1}]},

  // 35
  {"levelId":35,"difficulty":2,"gridSize":[3,3],
   "nodes":[{"id":1,"x":0,"y":0},{"id":2,"x":1,"y":0},{"id":3,"x":2,"y":0},{"id":4,"x":0,"y":1},{"id":5,"x":1,"y":1},{"id":6,"x":2,"y":1},{"id":7,"x":0,"y":2},{"id":8,"x":1,"y":2},{"id":9,"x":2,"y":2}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":6},{"from":6,"to":5},{"from":5,"to":4},{"from":4,"to":7},{"from":7,"to":8},{"from":8,"to":9},{"from":1,"to":5},{"from":5,"to":9}]},

  // 36
  {"levelId":36,"difficulty":2,"gridSize":[5,3],
   "nodes":[{"id":1,"x":0,"y":2},{"id":2,"x":1,"y":0},{"id":3,"x":2,"y":2},{"id":4,"x":3,"y":0},{"id":5,"x":4,"y":2}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":5}]},

  // 37
  {"levelId":37,"difficulty":2,"gridSize":[3,3],
   "nodes":[{"id":1,"x":0,"y":0},{"id":2,"x":1,"y":0},{"id":3,"x":2,"y":0},{"id":4,"x":0,"y":1},{"id":5,"x":1,"y":1},{"id":6,"x":2,"y":1},{"id":7,"x":0,"y":2},{"id":8,"x":1,"y":2},{"id":9,"x":2,"y":2}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":1,"to":4},{"from":2,"to":5},{"from":3,"to":6},{"from":4,"to":5},{"from":5,"to":6},{"from":4,"to":7},{"from":5,"to":8},{"from":6,"to":9},{"from":7,"to":8},{"from":8,"to":9},{"from":2,"to":4}]},

  // 38
  {"levelId":38,"difficulty":2,"gridSize":[3,5],
   "nodes":[{"id":1,"x":1,"y":0},{"id":2,"x":0,"y":1},{"id":3,"x":2,"y":1},{"id":4,"x":1,"y":2},{"id":5,"x":0,"y":3},{"id":6,"x":2,"y":3},{"id":7,"x":1,"y":4}],
   "edges":[{"from":1,"to":2},{"from":1,"to":3},{"from":2,"to":4},{"from":3,"to":4},{"from":4,"to":5},{"from":4,"to":6},{"from":5,"to":7},{"from":6,"to":7}]},

  // 39
  {"levelId":39,"difficulty":2,"gridSize":[4,3],
   "nodes":[{"id":1,"x":0,"y":0},{"id":2,"x":1,"y":0},{"id":3,"x":2,"y":0},{"id":4,"x":3,"y":0},{"id":5,"x":3,"y":1},{"id":6,"x":3,"y":2},{"id":7,"x":2,"y":2},{"id":8,"x":1,"y":2},{"id":9,"x":0,"y":2},{"id":10,"x":0,"y":1}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":5},{"from":5,"to":6},{"from":6,"to":7},{"from":7,"to":8},{"from":8,"to":9},{"from":9,"to":10},{"from":10,"to":1}]},

  // 40
  {"levelId":40,"difficulty":2,"gridSize":[5,5],
   "nodes":[{"id":1,"x":0,"y":0},{"id":2,"x":2,"y":0},{"id":3,"x":4,"y":0},{"id":4,"x":4,"y":2},{"id":5,"x":4,"y":4},{"id":6,"x":2,"y":4},{"id":7,"x":0,"y":4},{"id":8,"x":0,"y":2},{"id":9,"x":2,"y":2}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":5},{"from":5,"to":6},{"from":6,"to":7},{"from":7,"to":8},{"from":8,"to":1},{"from":2,"to":9},{"from":9,"to":6}]},

  // 41
  {"levelId":41,"difficulty":3,"gridSize":[5,5],
   "nodes":[{"id":1,"x":0.6,"y":2.6},{"id":2,"x":2.6,"y":1.6},{"id":3,"x":0.6,"y":1},{"id":4,"x":1,"y":2.6},{"id":5,"x":1,"y":1},{"id":6,"x":0,"y":2.1},{"id":7,"x":3.4,"y":3.1},{"id":8,"x":3.6,"y":0.5},{"id":9,"x":1.5,"y":1}],
   "edges":[{"from":1,"to":8},{"from":6,"to":8},{"from":1,"to":5},{"from":4,"to":5},{"from":3,"to":5},{"from":4,"to":7},{"from":8,"to":9},{"from":2,"to":4},{"from":6,"to":7},{"from":6,"to":9},{"from":4,"to":8},{"from":5,"to":8},{"from":2,"to":3}]},

  // 42
  {"levelId":42,"difficulty":3,"gridSize":[5,3],
   "nodes":[{"id":1,"x":0,"y":0},{"id":2,"x":1,"y":0},{"id":3,"x":1,"y":2},{"id":4,"x":0,"y":2},{"id":5,"x":2,"y":1},{"id":6,"x":3,"y":0},{"id":7,"x":4,"y":1},{"id":8,"x":3,"y":2}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":1},{"from":2,"to":5},{"from":5,"to":3},{"from":5,"to":6},{"from":6,"to":7},{"from":7,"to":8},{"from":8,"to":5}]},

  // 43
  {"levelId":43,"difficulty":3,"gridSize":[5,6],
   "nodes":[{"id":1,"x":2,"y":0.4},{"id":2,"x":0.1,"y":4.6},{"id":3,"x":1,"y":3.5},{"id":4,"x":2.1,"y":3.5},{"id":5,"x":0.1,"y":3.4},{"id":6,"x":3.5,"y":3.5}],
   "edges":[{"from":1,"to":2},{"from":2,"to":5},{"from":4,"to":5},{"from":4,"to":6},{"from":1,"to":3},{"from":1,"to":4},{"from":1,"to":5},{"from":2,"to":6},{"from":5,"to":6},{"from":3,"to":5},{"from":2,"to":4}]},

  // 44
  {"levelId":44,"difficulty":3,"gridSize":[4,4],
   "nodes":[{"id":1,"x":0,"y":0},{"id":2,"x":3,"y":0},{"id":3,"x":3,"y":3},{"id":4,"x":0,"y":3},{"id":5,"x":1,"y":1},{"id":6,"x":2,"y":1},{"id":7,"x":2,"y":2},{"id":8,"x":1,"y":2}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":1},{"from":1,"to":5},{"from":5,"to":6},{"from":6,"to":7},{"from":7,"to":8},{"from":8,"to":5}]},

  // 45
  {"levelId":45,"difficulty":3,"gridSize":[4,4],
   "nodes":[{"id":1,"x":1.5,"y":0},{"id":2,"x":3,"y":1},{"id":3,"x":3,"y":2.5},{"id":4,"x":1.5,"y":3.5},{"id":5,"x":0,"y":2.5},{"id":6,"x":0,"y":1}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":5},{"from":5,"to":6},{"from":6,"to":1},{"from":1,"to":4},{"from":3,"to":6},{"from":1,"to":3},{"from":4,"to":6}]},

  // 46
  {"levelId":46,"difficulty":3,"gridSize":[4,4],
   "nodes":[{"id":1,"x":1,"y":0},{"id":2,"x":2.5,"y":0},{"id":3,"x":3,"y":1.5},{"id":4,"x":2.5,"y":3},{"id":5,"x":1,"y":3},{"id":6,"x":0,"y":1.5},{"id":7,"x":1.75,"y":1.5}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":5},{"from":5,"to":6},{"from":6,"to":1},{"from":7,"to":1},{"from":7,"to":4}]},

  // 47
  {"levelId":47,"difficulty":3,"gridSize":[5,5],
   "nodes":[{"id":1,"x":2,"y":0},{"id":2,"x":4,"y":2},{"id":3,"x":2,"y":4},{"id":4,"x":0,"y":2},{"id":5,"x":2,"y":1.5},{"id":6,"x":2.5,"y":2},{"id":7,"x":2,"y":2.5},{"id":8,"x":1.5,"y":2}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":1},{"from":5,"to":6},{"from":6,"to":7},{"from":7,"to":8},{"from":8,"to":5},{"from":1,"to":5},{"from":3,"to":7},{"from":5,"to":7}]},

  // 48
  {"levelId":48,"difficulty":3,"gridSize":[3,3],
   "nodes":[{"id":1,"x":0,"y":0},{"id":2,"x":1,"y":0},{"id":3,"x":2,"y":0},{"id":4,"x":0,"y":1},{"id":5,"x":1,"y":1},{"id":6,"x":2,"y":1},{"id":7,"x":0,"y":2},{"id":8,"x":1,"y":2},{"id":9,"x":2,"y":2}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":1,"to":4},{"from":3,"to":6},{"from":4,"to":5},{"from":5,"to":6},{"from":4,"to":7},{"from":6,"to":9},{"from":7,"to":8},{"from":8,"to":9},{"from":2,"to":5},{"from":5,"to":8},{"from":2,"to":4},{"from":6,"to":8}]},

  // 49
  {"levelId":49,"difficulty":3,"gridSize":[4,4],
   "nodes":[{"id":1,"x":1.5,"y":0},{"id":2,"x":3,"y":1},{"id":3,"x":3,"y":2.5},{"id":4,"x":1.5,"y":3.5},{"id":5,"x":0,"y":2.5},{"id":6,"x":0,"y":1},{"id":7,"x":1.5,"y":1.75}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":5},{"from":5,"to":6},{"from":6,"to":1},{"from":7,"to":1},{"from":7,"to":2},{"from":7,"to":4},{"from":7,"to":5},{"from":1,"to":5}]},

  // 50
  {"levelId":50,"difficulty":3,"gridSize":[4,5],
   "nodes":[{"id":1,"x":1.5,"y":0},{"id":2,"x":3,"y":1},{"id":3,"x":3,"y":3},{"id":4,"x":1.5,"y":4},{"id":5,"x":0,"y":3},{"id":6,"x":0,"y":1}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":5},{"from":5,"to":6},{"from":6,"to":1},{"from":1,"to":3},{"from":3,"to":5},{"from":5,"to":1},{"from":2,"to":4},{"from":4,"to":6},{"from":6,"to":2}]},

  // 51
  {"levelId":51,"difficulty":4,"gridSize":[5,4],
   "nodes":[{"id":1,"x":0.5,"y":0},{"id":2,"x":1.5,"y":0},{"id":3,"x":2,"y":1},{"id":4,"x":1.5,"y":2},{"id":5,"x":0.5,"y":2},{"id":6,"x":0,"y":1},{"id":7,"x":3,"y":0},{"id":8,"x":4,"y":1},{"id":9,"x":3,"y":2}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":5},{"from":5,"to":6},{"from":6,"to":1},{"from":2,"to":7},{"from":7,"to":8},{"from":8,"to":9},{"from":9,"to":4}]},

  // 52
  {"levelId":52,"difficulty":4,"gridSize":[5,5],
   "nodes":[{"id":1,"x":0,"y":0},{"id":2,"x":4,"y":0},{"id":3,"x":4,"y":4},{"id":4,"x":0,"y":4},{"id":5,"x":1,"y":1},{"id":6,"x":3,"y":1},{"id":7,"x":3,"y":3},{"id":8,"x":1,"y":3},{"id":9,"x":2,"y":2}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":1},{"from":5,"to":6},{"from":6,"to":7},{"from":7,"to":8},{"from":8,"to":5},{"from":1,"to":5},{"from":2,"to":6},{"from":3,"to":7},{"from":4,"to":8},{"from":5,"to":9},{"from":6,"to":9},{"from":7,"to":9},{"from":8,"to":9},{"from":1,"to":6},{"from":3,"to":6}]},

  // 53
  {"levelId":53,"difficulty":4,"gridSize":[5,5],
   "nodes":[{"id":1,"x":2,"y":0},{"id":2,"x":4,"y":1},{"id":3,"x":4,"y":3},{"id":4,"x":2,"y":4},{"id":5,"x":0,"y":3},{"id":6,"x":0,"y":1},{"id":7,"x":2,"y":2}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":5},{"from":5,"to":6},{"from":6,"to":1},{"from":1,"to":7},{"from":2,"to":7},{"from":3,"to":7},{"from":4,"to":7},{"from":5,"to":7},{"from":6,"to":7},{"from":1,"to":3},{"from":2,"to":4}]},

  // 54
  {"levelId":54,"difficulty":4,"gridSize":[6,7],
   "nodes":[{"id":1,"x":0.6,"y":1.6},{"id":2,"x":2.1,"y":2.6},{"id":3,"x":4.1,"y":5.1},{"id":4,"x":0.1,"y":4.6},{"id":5,"x":1.9,"y":1},{"id":6,"x":1.9,"y":4.9},{"id":7,"x":1.6,"y":3.6},{"id":8,"x":3.6,"y":2.9},{"id":9,"x":1,"y":0.6}],
   "edges":[{"from":1,"to":2},{"from":2,"to":7},{"from":6,"to":7},{"from":6,"to":8},{"from":4,"to":8},{"from":5,"to":8},{"from":8,"to":9},{"from":3,"to":9},{"from":4,"to":6},{"from":6,"to":9},{"from":1,"to":8},{"from":2,"to":8},{"from":5,"to":6},{"from":2,"to":9},{"from":4,"to":5},{"from":7,"to":8},{"from":1,"to":4},{"from":1,"to":3},{"from":5,"to":7}]},

  // 55
  {"levelId":55,"difficulty":4,"gridSize":[3,3],
   "nodes":[{"id":1,"x":0,"y":0},{"id":2,"x":1,"y":0},{"id":3,"x":2,"y":0},{"id":4,"x":0,"y":1},{"id":5,"x":1,"y":1},{"id":6,"x":2,"y":1},{"id":7,"x":0,"y":2},{"id":8,"x":1,"y":2},{"id":9,"x":2,"y":2}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":1,"to":4},{"from":2,"to":5},{"from":3,"to":6},{"from":4,"to":5},{"from":5,"to":6},{"from":4,"to":7},{"from":5,"to":8},{"from":6,"to":9},{"from":7,"to":8},{"from":8,"to":9},{"from":1,"to":5},{"from":3,"to":5},{"from":5,"to":7},{"from":5,"to":9},{"from":2,"to":4},{"from":2,"to":6},{"from":4,"to":8},{"from":6,"to":8},{"from":1,"to":6},{"from":2,"to":7},{"from":3,"to":4}]},

  // 56
  {"levelId":56,"difficulty":4,"gridSize":[5,5],
   "nodes":[{"id":1,"x":2,"y":0},{"id":2,"x":4,"y":2},{"id":3,"x":2,"y":4},{"id":4,"x":0,"y":2},{"id":5,"x":2,"y":2},{"id":6,"x":3,"y":1},{"id":7,"x":3,"y":3},{"id":8,"x":1,"y":3},{"id":9,"x":1,"y":1}],
   "edges":[{"from":1,"to":6},{"from":6,"to":2},{"from":2,"to":7},{"from":7,"to":3},{"from":3,"to":8},{"from":8,"to":4},{"from":4,"to":9},{"from":9,"to":1},{"from":5,"to":6},{"from":5,"to":7},{"from":5,"to":8},{"from":5,"to":9},{"from":6,"to":7},{"from":8,"to":9}]},

  // 57
  {"levelId":57,"difficulty":4,"gridSize":[5,5],
   "nodes":[{"id":1,"x":2,"y":0},{"id":2,"x":4,"y":2},{"id":3,"x":2,"y":4},{"id":4,"x":0,"y":2},{"id":5,"x":2,"y":1},{"id":6,"x":3,"y":2},{"id":7,"x":2,"y":3},{"id":8,"x":1,"y":2},{"id":9,"x":2,"y":2}],
   "edges":[{"from":1,"to":5},{"from":5,"to":9},{"from":9,"to":7},{"from":7,"to":3},{"from":2,"to":6},{"from":6,"to":9},{"from":9,"to":8},{"from":8,"to":4},{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":1},{"from":5,"to":6},{"from":7,"to":8},{"from":5,"to":8},{"from":6,"to":7},{"from":1,"to":6},{"from":3,"to":6}]},

  // 58
  {"levelId":58,"difficulty":4,"gridSize":[5,5],
   "nodes":[{"id":1,"x":0,"y":0},{"id":2,"x":4,"y":0},{"id":3,"x":4,"y":4},{"id":4,"x":0,"y":4},{"id":5,"x":1,"y":1},{"id":6,"x":3,"y":1},{"id":7,"x":3,"y":3},{"id":8,"x":1,"y":3}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":1},{"from":5,"to":6},{"from":6,"to":7},{"from":7,"to":8},{"from":8,"to":5},{"from":1,"to":5},{"from":2,"to":6},{"from":3,"to":7},{"from":4,"to":8},{"from":1,"to":6},{"from":2,"to":5},{"from":3,"to":8},{"from":4,"to":7}]},

  // 59
  {"levelId":59,"difficulty":4,"gridSize":[5,5],
   "nodes":[{"id":1,"x":1,"y":0},{"id":2,"x":3,"y":0},{"id":3,"x":4,"y":1},{"id":4,"x":4,"y":3},{"id":5,"x":3,"y":4},{"id":6,"x":1,"y":4},{"id":7,"x":0,"y":3},{"id":8,"x":0,"y":1}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":5},{"from":5,"to":6},{"from":6,"to":7},{"from":7,"to":8},{"from":8,"to":1},{"from":1,"to":4},{"from":2,"to":5},{"from":3,"to":6},{"from":4,"to":7},{"from":5,"to":8},{"from":6,"to":1},{"from":7,"to":2},{"from":8,"to":3}]},

  // 60
  {"levelId":60,"difficulty":4,"gridSize":[6,7],
   "nodes":[{"id":1,"x":0.6,"y":4.6},{"id":2,"x":2.5,"y":5.6},{"id":3,"x":3.4,"y":2},{"id":4,"x":4.6,"y":2.6},{"id":5,"x":2.1,"y":4.9},{"id":6,"x":0.9,"y":4},{"id":7,"x":0.1,"y":1.4},{"id":8,"x":4.5,"y":1},{"id":9,"x":1.9,"y":1}],
   "edges":[{"from":1,"to":6},{"from":2,"to":6},{"from":6,"to":8},{"from":2,"to":4},{"from":3,"to":4},{"from":3,"to":5},{"from":2,"to":9},{"from":7,"to":8},{"from":5,"to":8},{"from":8,"to":9},{"from":7,"to":9},{"from":4,"to":7},{"from":3,"to":7},{"from":6,"to":9},{"from":4,"to":8},{"from":6,"to":7},{"from":5,"to":9},{"from":4,"to":9},{"from":1,"to":8},{"from":2,"to":8},{"from":3,"to":6},{"from":4,"to":5}]},

  // 61
  {"levelId":61,"difficulty":4,"gridSize":[4,4],
   "nodes":[{"id":1,"x":0,"y":0},{"id":2,"x":2,"y":0},{"id":3,"x":4,"y":0},{"id":4,"x":0,"y":2},{"id":5,"x":2,"y":2},{"id":6,"x":4,"y":2},{"id":7,"x":0,"y":4},{"id":8,"x":2,"y":4},{"id":9,"x":4,"y":4}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":1,"to":4},{"from":2,"to":5},{"from":3,"to":6},{"from":4,"to":5},{"from":5,"to":6},{"from":4,"to":7},{"from":5,"to":8},{"from":6,"to":9},{"from":7,"to":8},{"from":8,"to":9},{"from":1,"to":5},{"from":5,"to":9},{"from":3,"to":5},{"from":5,"to":7},{"from":2,"to":4},{"from":6,"to":8},{"from":1,"to":6},{"from":6,"to":7}]},

  // 62
  {"levelId":62,"difficulty":4,"gridSize":[5,5],
   "nodes":[{"id":1,"x":2,"y":0},{"id":2,"x":4,"y":2},{"id":3,"x":2,"y":4},{"id":4,"x":0,"y":2},{"id":5,"x":2,"y":1},{"id":6,"x":3,"y":2},{"id":7,"x":2,"y":3},{"id":8,"x":1,"y":2}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":1},{"from":5,"to":6},{"from":6,"to":7},{"from":7,"to":8},{"from":8,"to":5},{"from":1,"to":5},{"from":2,"to":6},{"from":3,"to":7},{"from":4,"to":8},{"from":5,"to":2},{"from":6,"to":3},{"from":7,"to":4},{"from":8,"to":1}]},

  // 63
  {"levelId":63,"difficulty":4,"gridSize":[5,6],
   "nodes":[{"id":1,"x":2.1,"y":4.9},{"id":2,"x":0.6,"y":0.6},{"id":3,"x":0.5,"y":3.5},{"id":4,"x":0.1,"y":2},{"id":5,"x":3.5,"y":4.5},{"id":6,"x":2.4,"y":2.1},{"id":7,"x":1.4,"y":0.5},{"id":8,"x":1,"y":1},{"id":9,"x":0.4,"y":2.5}],
   "edges":[{"from":1,"to":4},{"from":4,"to":8},{"from":4,"to":6},{"from":6,"to":9},{"from":5,"to":9},{"from":2,"to":9},{"from":2,"to":7},{"from":3,"to":7},{"from":4,"to":5},{"from":6,"to":8},{"from":1,"to":2},{"from":1,"to":9},{"from":5,"to":6},{"from":2,"to":4},{"from":1,"to":3},{"from":1,"to":6},{"from":3,"to":5},{"from":2,"to":5},{"from":1,"to":5},{"from":2,"to":3}]},

  // 64
  {"levelId":64,"difficulty":4,"gridSize":[5,5],
   "nodes":[{"id":1,"x":2,"y":0},{"id":2,"x":4,"y":1},{"id":3,"x":4,"y":3},{"id":4,"x":2,"y":4},{"id":5,"x":0,"y":3},{"id":6,"x":0,"y":1},{"id":7,"x":2,"y":1.5},{"id":8,"x":2,"y":2.5}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":5},{"from":5,"to":6},{"from":6,"to":1},{"from":7,"to":8},{"from":1,"to":7},{"from":7,"to":6},{"from":4,"to":8},{"from":8,"to":3},{"from":2,"to":7},{"from":5,"to":8},{"from":2,"to":5},{"from":3,"to":6}]},

  // 65
  {"levelId":65,"difficulty":4,"gridSize":[5,5],
   "nodes":[{"id":1,"x":0,"y":0},{"id":2,"x":2,"y":0},{"id":3,"x":4,"y":0},{"id":4,"x":1,"y":2},{"id":5,"x":3,"y":2},{"id":6,"x":0,"y":4},{"id":7,"x":2,"y":4},{"id":8,"x":4,"y":4}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":1,"to":4},{"from":2,"to":4},{"from":2,"to":5},{"from":3,"to":5},{"from":4,"to":5},{"from":4,"to":6},{"from":4,"to":7},{"from":5,"to":7},{"from":5,"to":8},{"from":6,"to":7},{"from":7,"to":8}]},

  // 66
  {"levelId":66,"difficulty":4,"gridSize":[5,5],
   "nodes":[{"id":1,"x":0,"y":0},{"id":2,"x":4,"y":0},{"id":3,"x":4,"y":4},{"id":4,"x":0,"y":4},{"id":5,"x":1,"y":1},{"id":6,"x":3,"y":1},{"id":7,"x":3,"y":3},{"id":8,"x":1,"y":3}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":1},{"from":5,"to":6},{"from":6,"to":7},{"from":7,"to":8},{"from":8,"to":5},{"from":1,"to":5},{"from":2,"to":6},{"from":3,"to":7},{"from":4,"to":8},{"from":1,"to":6},{"from":2,"to":5},{"from":3,"to":8},{"from":4,"to":7}]},

  // 67
  {"levelId":67,"difficulty":4,"gridSize":[5,6],
   "nodes":[{"id":1,"x":2,"y":0},{"id":2,"x":4,"y":1.5},{"id":3,"x":2,"y":3},{"id":4,"x":0,"y":1.5},{"id":5,"x":2,"y":1},{"id":6,"x":3,"y":1.5},{"id":7,"x":2,"y":2},{"id":8,"x":1,"y":1.5}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":1},{"from":5,"to":6},{"from":6,"to":7},{"from":7,"to":8},{"from":8,"to":5},{"from":1,"to":5},{"from":2,"to":6},{"from":3,"to":7},{"from":4,"to":8},{"from":5,"to":7},{"from":6,"to":8},{"from":1,"to":6},{"from":3,"to":6}]},

  // 68
  {"levelId":68,"difficulty":4,"gridSize":[5,5],
   "nodes":[{"id":1,"x":1,"y":0},{"id":2,"x":3,"y":0},{"id":3,"x":4,"y":2},{"id":4,"x":3,"y":4},{"id":5,"x":1,"y":4},{"id":6,"x":0,"y":2},{"id":7,"x":2,"y":1.5},{"id":8,"x":2,"y":2.5}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":5},{"from":5,"to":6},{"from":6,"to":1},{"from":1,"to":7},{"from":2,"to":7},{"from":3,"to":8},{"from":4,"to":8},{"from":5,"to":8},{"from":6,"to":7},{"from":7,"to":8},{"from":1,"to":4},{"from":2,"to":5},{"from":3,"to":6}]},

  // 69
  {"levelId":69,"difficulty":4,"gridSize":[5,7],
   "nodes":[{"id":1,"x":3,"y":2.5},{"id":2,"x":3.9,"y":5},{"id":3,"x":1.4,"y":0.6},{"id":4,"x":3.1,"y":5},{"id":5,"x":0.6,"y":0.5},{"id":6,"x":2,"y":2.5},{"id":7,"x":3.6,"y":5.5},{"id":8,"x":1.6,"y":5.4},{"id":9,"x":3,"y":3}],
   "edges":[{"from":1,"to":8},{"from":8,"to":9},{"from":7,"to":8},{"from":1,"to":4},{"from":2,"to":4},{"from":4,"to":6},{"from":5,"to":6},{"from":3,"to":4},{"from":7,"to":9},{"from":4,"to":5},{"from":1,"to":7},{"from":2,"to":6},{"from":1,"to":5},{"from":5,"to":7},{"from":3,"to":8}]},

  // 70
  {"levelId":70,"difficulty":4,"gridSize":[5,5],
   "nodes":[{"id":1,"x":2,"y":0},{"id":2,"x":4,"y":1},{"id":3,"x":4,"y":3},{"id":4,"x":2,"y":4},{"id":5,"x":0,"y":3},{"id":6,"x":0,"y":1},{"id":7,"x":2,"y":2}],
   "edges":[{"from":1,"to":2},{"from":2,"to":3},{"from":3,"to":4},{"from":4,"to":5},{"from":5,"to":6},{"from":6,"to":1},{"from":1,"to":7},{"from":2,"to":7},{"from":3,"to":7},{"from":4,"to":7},{"from":5,"to":7},{"from":6,"to":7},{"from":1,"to":3},{"from":2,"to":4}]}
];
