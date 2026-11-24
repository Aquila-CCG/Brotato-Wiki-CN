# 条目数据结构 v1
网站从 site/data.js 加载独立数据；以 window.BROTATO_DATA 包装 JSON，兼容本地双击预览。当前仅含原创示例。

| 字段 | 规则 |
| --- | --- |
| id | 稳定内部标识，不能随中文译名变化 |
| kind | 角色、武器、道具；后续可扩展机制 |
| names | zh-Hans、zh-Hant、en；缺少中文回退英文，不自动冒充官方译名 |
| aliases | 搜索别名，逐条保留语言、来源和审核状态 |
| translation | 原创/官方来源/社区/待审状态、来源 ID、CSV key、版本和审核日期 |
| content | 本体/DLC/demo、明确可知的游戏版本、modId；未知用 null |
| provenance | 来源 ID、Wiki 页面、修订号、同步时间；未知用 null |
| publication | demo/draft/published 与 allowed/unknown/blocked；未知不发布 |
| stats | 预留结构化数值数组；每项需 statId、value、unit、tier 和来源，不解析描述充当可靠数值 |

sources 注册来源 URL、类型、许可及可复用状态。译名可信度与许可状态分别判断。模组条目必须使用独立 ID 与 modId，不合并为本体。译名冲突保留候选、来源与版本，人工确认后选定显示名，不按搜索排名决策。

搜索当前支持简体、繁体、英文及人工别名，采用 Unicode NFKC、英文大小写和空白归一化。简繁名称分别存储，不用机械转换覆盖官方译名；拼音与错字模糊搜索尚未实现。

导入准入：来源存在、ID 唯一、至少英文或中文名、第三方修订/提交可追溯、授权通过、占位符一致、重复键与缺失中文检查通过。原始 CSV 与未经核实的内容不进入发布目录。

## 已实现的发布校验
运行 `node scripts/validate-data.cjs` 检查实际发布数据，`node scripts/test-data.cjs` 检查九类非法数据是否被拒绝。GitHub 发布前自动运行。草稿不能放入 site/data.js，因为浏览器文件本身公开；前端隐藏不构成发布隔离。来源级和条目级授权必须同时通过。

当前尚未实现 CSV 导入器和占位符对照，文中的完整导入准入流程为后续要求，不代表这些检查已全部落地。
