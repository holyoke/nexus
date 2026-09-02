# Nexus Compute 前端原型

面向 Agent-native GPU Compute Platform 的模块化交互原型。当前使用 Mock 数据，已形成七个相互联动的产品模块：

- 控制台：自然语言任务、执行计划、Workflow 画布、实时 GPU 指标
- Agent 会话：会话列表、消息流和 append-only Trajectory
- 工作流：Workflow Studio、节点配置与版本记录
- 任务与运行：任务筛选、状态操作、日志和资源详情
- 算力资源：GPU 资源池、容量与利用率
- Runtime 市场：Unsloth、Isaac Lab、Isaac Sim、vLLM、PyTorch
- 数据与产物：数据集、模型、策略和项目存储

## 本地启动

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

构建完成后可以直接双击 `dist/offline.html` 离线打开，不依赖本地开发服务器。

## 原型交互

- 所有页面由 `src/modules/registry.ts` 统一注册，导航和页面装配不再写死
- Agent 消息区支持异步 Mock 响应并写入共享 Session 状态
- Runtime 启动会生成排队任务，并实时出现在任务模块
- 暂停/继续任务会同步更新列表、详情和控制台状态
- URL Hash 保存当前模块，刷新后仍能回到对应页面

## 代码结构

```text
src/
├── core/             # 类型、共享运行时与应用状态
├── services/         # Mock API，后续替换为真实网关
├── components/       # Layout、Agent、Workflow、Metrics 通用组件
├── modules/          # 七个领域功能模块与模块注册表
├── mock.ts           # 画布与资源展示数据
├── styles.css        # 基础视觉系统
└── modules.css       # 模块页面视觉样式
```

## 后续接入建议

1. 将 `src/services/mockApi.ts` 替换为 Compute、Runtime、Job、Metrics API Client。
2. 工作流画布替换为 React Flow，Workflow IR 作为前后端统一协议。
3. 指标流通过 WebSocket/SSE 接入 Prometheus/DCGM 聚合服务。
4. Agent 会话采用流式接口，并对资源变更操作增加确认与审计状态。
