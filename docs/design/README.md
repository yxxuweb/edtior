# 技术方案文档索引 (Design Docs Index)

本目录存放核心库的技术方案设计文档 (Technical Design Documents, TDD)。所有重大功能开发前，必须先在此创建设计文档并通过评审。

## 文档列表

| ID | 标题 | 状态 | 作者 | 更新日期 |
| :--- | :--- | :--- | :--- | :--- |
| 001 | [核心内核与数据模型设计](./001-core-kernel.md) | Draft | Core Team | 2026-02-09 |
| 002 | [事件系统设计](./002-event-system.md) | Planned | Core Team | - |
| 003 | [插件架构设计](./003-plugin-architecture.md) | Planned | Core Team | - |
| 004 | [事务与历史记录设计](./004-transaction-history.md) | Planned | Core Team | - |
| 005 | [交互驱动设计](./005-interaction-drivers.md) | Draft | Core Team | 2026-02-09 |
| 006 | [布局系统设计](./006-layout-system.md) | Draft | Core Team | 2026-02-09 |
| 007 | [视图渲染机制](./007-view-renderer.md) | Draft | Core Team | 2026-02-09 |
| 008 | [日志系统设计](./008-infra-logger.md) | Draft | Core Team | 2026-02-13 |
| 009 | [错误处理设计](./009-infra-error-handling.md) | Draft | Core Team | 2026-02-13 |
| 010 | [性能监控设计](./010-infra-performance.md) | Draft | Core Team | 2026-02-13 |

## 设计原则

1.  **Single Source of Truth**: 所有设计以本文档为准，代码实现需严格遵循文档定义。
2.  **Keep it Simple**: 避免过度设计，优先满足当前需求并预留扩展接口。
3.  **Framework Agnostic**: 始终牢记核心库不依赖任何 UI 框架。

## 文档模板

请复制 [TEMPLATE.md](./TEMPLATE.md) 创建新文档。
