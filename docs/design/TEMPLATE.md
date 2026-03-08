# [ID] [Title]

*   **Status**: Draft / Reviewing / Accepted / Deprecated
*   **Author**: [Name]
*   **Created**: YYYY-MM-DD
*   **Updated**: YYYY-MM-DD

## 1. 背景与目标 (Context & Goals)

### 1.1 背景
描述为什么需要这个功能/模块？当前痛点是什么？

### 1.2 目标
*   [Goal 1]
*   [Goal 2]

### 1.3 非目标 (Non-Goals)
*   [Out of scope item]

## 2. 详细设计 (Detailed Design)

### 2.1 核心概念 (Core Concepts)
定义该模块涉及的关键术语和概念。

### 2.2 架构设计 (Architecture)
使用 Mermaid 图表展示模块结构、依赖关系。

```mermaid
graph TD
    A --> B
```

### 2.3 数据结构 (Data Structures)
定义核心 Interface / Class / Schema。

```typescript
interface Example {
    key: string;
}
```

### 2.4 关键流程 (Key Flows)
描述核心业务逻辑的执行流程（如初始化、交互、销毁）。

## 3. API 设计 (API Design)

列出对外暴露的 API 签名及说明。

```javascript
/**
 * Description
 */
export function example(arg: string): void;
```

## 4. 兼容性与迁移 (Compatibility & Migration)

是否涉及 Breaking Change？如何兼容旧版本？

## 5. 测试计划 (Test Plan)

*   Unit Test: 覆盖哪些核心逻辑？
*   Integration Test: 如何验证模块间协作？
