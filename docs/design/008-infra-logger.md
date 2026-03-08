# 008 日志系统设计 (Logger Infrastructure)

*   **Status**: Draft
*   **Author**: Core Team
*   **Created**: 2026-02-13

## 1. 背景与目标

### 1.1 问题
在大型项目中，日志管理面临以下挑战：
1.  **多实例冲突**: 微前端或 Monorepo 环境中，不同包可能依赖不同版本的日志库，导致日志配置（如 LogLevel）无法全局统一。
2.  **上下文缺失**: 简单的 `console.log` 难以区分日志来源（模块、组件、时间）。
3.  **输出渠道单一**: 在生产环境需要将日志发送到监控平台（Sentry/ELK），而非仅仅打印到控制台。

### 1.2 目标
*   **全局单例 (Global Singleton)**: 确保无论 NPM 包如何分发、安装，运行时始终共享同一个日志注册表。
*   **命名空间 (Namespaced)**: 支持按模块获取 Logger 实例（如 `Core`, `Renderer`），并独立配置级别。
*   **可扩展适配器 (Pluggable Adapters)**: 支持自定义日志输出目标。
*   **零依赖 (Zero Dependency)**: 作为底层基础设施，不应依赖任何框架或大型库。

## 2. 详细设计

### 2.1 核心架构

使用 **Global Symbol Registry** 模式来实现跨包单例。

```mermaid
graph TD
    App[Application] -->|getLogger('App')| Registry
    Core[Core Package] -->|getLogger('Core')| Registry
    Plugin[Plugin Package] -->|getLogger('Plugin')| Registry
    
    Registry{Global Registry (Symbol)} -->|Manage| LoggerA[Logger: App]
    Registry -->|Manage| LoggerB[Logger: Core]
    Registry -->|Manage| LoggerC[Logger: Plugin]
    
    LoggerA -->|Output| ConsoleAdapter
    LoggerB -->|Output| SentryAdapter
```

### 2.2 接口定义

```typescript
type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'OFF';

interface LogConfig {
  level: LogLevel;
  prefix?: string;
  adapters?: LogAdapter[];
}

interface LogAdapter {
  log(level: LogLevel, namespace: string, message: string, ...args: any[]): void;
}

interface ILogger {
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  setLevel(level: LogLevel): void;
}
```

### 2.3 单例实现 mechanics

为了防止分包（Split Chunks）或多版本包（Dual Package Hazard）导致 `Logger` 类被实例化多次，我们使用 `Symbol.for` 在全局作用域（`window` 或 `global`）存储注册表。

```typescript
const SYMBOL_REGISTRY = Symbol.for('@lowcode/logger/registry');

class LoggerFactory {
  private static get registry(): Map<string, Logger> {
    const globalContext = (typeof window !== 'undefined' ? window : global) as any;
    if (!globalContext[SYMBOL_REGISTRY]) {
      globalContext[SYMBOL_REGISTRY] = new Map();
    }
    return globalContext[SYMBOL_REGISTRY];
  }

  static getLogger(namespace: string): Logger {
    if (!this.registry.has(namespace)) {
      this.registry.set(namespace, new Logger(namespace));
    }
    return this.registry.get(namespace)!;
  }
}
```

### 2.4 使用示例

**在核心库中：**
```typescript
import { LoggerFactory } from '@lowcode/utils-logger';
const logger = LoggerFactory.getLogger('Core');

logger.info('Engine initialized'); 
// Output: [2026-02-13 12:00:00] [INFO] [Core] Engine initialized
```

**在插件中（即使插件独立打包）：**
```typescript
import { LoggerFactory } from '@lowcode/utils-logger';
const logger = LoggerFactory.getLogger('HistoryPlugin');

// 全局配置会影响这里
logger.debug('History push'); 
```

**配置全局规则：**
```typescript
// 在应用入口配置
import { LoggerFactory, LogLevel } from '@lowcode/utils-logger';

LoggerFactory.configure({
    rootLevel: LogLevel.INFO, // 默认级别
    overrides: {
        'Core': LogLevel.WARN, // Core 模块只看 WARN
        'Network': LogLevel.DEBUG // Network 模块看 DEBUG
    }
});
```

## 3. 适配器扩展 (Adapters)

默认提供 `ConsoleAdapter`。在生产环境可接入远程日志：

```typescript
class SentryAdapter implements LogAdapter {
  log(level, namespace, message, ...args) {
    if (level === 'ERROR') {
      Sentry.captureException(new Error(`[${namespace}] ${message}`));
    } else {
      Sentry.addBreadcrumb({ category: namespace, message, level });
    }
  }
}

// 注册
LoggerFactory.addAdapter(new SentryAdapter());
```

## 4. 目录结构

建议将日志模块作为独立的工具包维护，以便被所有 Monorepo 子包引用。

```
packages/utils-logger/
├── src/
│   ├── index.ts        # 入口
│   ├── factory.ts      # 单例工厂
│   ├── logger.ts       # Logger 类
│   ├── adapters/       # 内置适配器
│   └── types.ts        # 类型定义
├── package.json
└── README.md
```
