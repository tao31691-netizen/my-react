# CLAUDE.md

本文件用于约束 Claude Code 在本仓库中的协作方式：包括交互规则、编码习惯、代码风格与项目约定。

## 交互与协作规则

- **默认用中文沟通**；必要时可在代码注释/提交信息中使用英文。
- **先澄清再动手**：需求不明确时先问 1-3 个关键问题；明确后再改代码。
- **改动要可追溯**：说明改了哪些文件、为什么改、以及如何验证。
- **尽量小步修改**：优先做最小可行改动（MVP），避免一次性大重构。
- **不做不可逆操作**：删除/大范围覆盖前先阅读目标文件并确认。
- **不擅自提交/推送**：除非我明确要求，否则不要 git commit / push。

## 项目文件与目录约定

- React 代码在 `src/` 下维护。
- 示例/工具代码集中在 `src/demo/`（例如 debounce/throttle hooks）。

## 代码风格与习惯

### 通用

- 保持与现有代码一致：命名、缩进、导出方式、注释密度遵循周边文件。
- 优先使用明确的命名：`wait`/`delay`、`handler`、`ref` 等语义清晰。
- 避免“魔法常量”：需要时用具名常量或参数默认值。

### React

- 优先函数组件 + Hooks。
- 处理定时器/订阅：必须在 `useEffect` cleanup 中清理（`clearTimeout/clearInterval`）。
- 与事件相关的工具函数：优先提供 Hook 版本（如 `useThrottleFun`）便于组件使用。

### TypeScript/TSX

- 新增的工具函数应保持 TS 兼容（不要引入会破坏类型检查的写法）。
- 不随意引入 `any`；必要时使用泛型或明确的函数签名。

## 工具函数（debounce/throttle）约定

- `src/demo/index.tsx` 作为工具集合文件：
  - `useDebounce(value, times)`
  - `useDebounceFun(fun, times)`
  - `useThrottle(value, wait)`
  - `useThrottleFun(fun, wait)`
- 定时器必须可清理，避免组件卸载后仍触发。

## Claude Code / Workflow 约定

- `.claude/` 目录为本地 Claude 配置与 workflow，**默认不提交**（已在 `.gitignore` 中忽略）。
- 如果需要共享 workflow，再单独讨论“提交部分/全量”的策略。

## 验证与运行

- 修改后尽量提供可执行的验证方式，例如：
  - `npm run dev`
  - `npm run build`
  - `npm run lint`

