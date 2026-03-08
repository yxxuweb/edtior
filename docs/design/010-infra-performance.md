# 010 性能监控设计 (Performance Monitoring)

*   **Status**: Draft
*   **Author**: Core Team
*   **Created**: 2026-02-13

## 1. 背景与目标

### 1.1 问题
低代码编辑器在处理大规模页面（如 5000+ 节点）时容易出现卡顿。我们需要量化性能指标，以便持续优化，并防止新功能引入性能回退。

### 1.2 目标
*   **量化指标**: 定义关键性能指标 (KPI)。
*   **实时监控**: 在运行时收集性能数据。
*   **性能守卫**: 建立性能基线，劣化时报警。

## 2. 关键性能指标 (KPI)

### 2.1 启动性能
*   **TQI (Time to Interactive)**: 从 `Engine.init()` 开始到编辑器 UI 可响应用户操作的时间。
    *   Target: < 1000ms (Cold Start)

### 2.2 运行时性能
*   **OpLat (Operation Latency)**: 核心操作（如 `setProp`, `dragNode`）从触发到视图更新完成的耗时。
    *   Target: < 16ms (60fps)
*   **SelLat (Selection Latency)**: 选中一个节点的耗时（高频操作）。
    *   Target: < 10ms

### 2.3 资源占用
*   **NodeCount**: 当前文档的节点总数。
    *   Alert: > 5000
*   **ListenerCount**: 全局 EventBus 监听器数量（检测内存泄漏）。

## 3. 详细设计

### 3.1 性能采集器 (Performance Observer)

使用 `performance.mark` 和 `performance.measure` 进行打点。

```typescript
class PerfMonitor {
  start(tag: string) {
    performance.mark(`${tag}_start`);
  }

  end(tag: string, meta?: any) {
    performance.mark(`${tag}_end`);
    performance.measure(tag, `${tag}_start`, `${tag}_end`);
    
    // 获取 measure 对象
    const entries = performance.getEntriesByName(tag);
    const duration = entries[entries.length - 1].duration;
    
    // 上报
    this.report(tag, duration, meta);
  }
}

// 使用示例
engine.perf.start('setProp');
node.setProp('color', 'red'); // ... heavy work
engine.perf.end('setProp', { nodeId: 'n1' });
```

### 3.2 慢操作检测 (Long Task Detection)

除了手动打点，利用 `PerformanceObserver` 监听所有的 Long Task（>50ms）。

```typescript
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.warn('Long Task detected:', entry.duration, entry.name);
    // 结合当前正在进行的 Transaction 归因
  }
});
observer.observe({ entryTypes: ['longtask'] });
```

### 3.3 内存泄漏检测

*   **原理**: 监控 `EventBus` 的监听器数量。若某类事件的监听器数量持续单调递增，且无下降趋势，判定为泄漏。
*   **快照**: 定期记录 `listeners.size` 并对比。

## 4. 性能优化策略 (Reference)

*   **按需加载**: 插件、组件懒加载。
*   **时间分片**: 使用 `requestIdleCallback` 处理非关键逻辑（如自动保存、属性检查）。
*   **虚拟滚动**: 面板、画布在大纲模式下使用 Virtual List。
*   **Web Worker**: 将复杂的 Schema 校验、代码编译放入 Worker 线程。
