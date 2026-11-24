# 扩展映射与差异处理
核查日期：2026-11-24。只发布元数据和原创分析，不发布译文。

本轮核对 114 个条目：角色清单 74 个，武器抽样 20 个，道具抽样 20 个。103 个得到唯一名称候选，11 个在指定两份 CSV 中未匹配。角色候选 63/74，武器 20/20，道具 20/20；后两项是抽样结果，不是全量覆盖率。

来源清单修订：[Characters 8708](https://brotato.wiki.spellsandguns.com/index.php?title=Characters&oldid=8708)、[Weapons 8798](https://brotato.wiki.spellsandguns.com/index.php?title=Weapons&oldid=8798)、[Items 8831](https://brotato.wiki.spellsandguns.com/index.php?title=Items&oldid=8831)。清单修订不冒充每个实体详情页的修订；只有另行查看的详情页才填 entityPageRevision。

## 已处理的名称差异
- Well Rounded：CSV 英文使用连字符，key 为 CHARACTER_WELL_ROUNDED。
- One Armed：CSV 英文为 One-Armed，key 为 CHARACTER_ONE_ARM；不能凭名称猜 key 为 ONE_ARMED。
- Captain's Sword：CSV 英文使用弯引号，key 为 WEAPON_CAPTAINS_SWORD，来自 DLC 文件；已确认详情页标注 Abyssal Terrors。

这三项仅标记名称对应已核对，未标记为译文正确、游戏版本一致或可发布。其余精确匹配仍为候选。

## 未匹配清单
- Wounded：两份固定 CSV 中未找到同类名称候选；保留英文名，待补充同版本官方来源。
- Veteran：两份固定 CSV 中未找到同类名称候选；保留英文名，待补充同版本官方来源。
- Archaeologist：两份固定 CSV 中未找到同类名称候选；保留英文名，待补充同版本官方来源。
- Droid：两份固定 CSV 中未找到同类名称候选；保留英文名，待补充同版本官方来源。
- Time Shifter：两份固定 CSV 中未找到同类名称候选；保留英文名，待补充同版本官方来源。
- Variant：两份固定 CSV 中未找到同类名称候选；保留英文名，待补充同版本官方来源。
- Caveman：两份固定 CSV 中未找到同类名称候选；保留英文名，待补充同版本官方来源。
- Arsonist：两份固定 CSV 中未找到同类名称候选；保留英文名，待补充同版本官方来源。
- Mad Scientist：两份固定 CSV 中未找到同类名称候选；保留英文名，待补充同版本官方来源。
- Poacher：两份固定 CSV 中未找到同类名称候选；保留英文名，待补充同版本官方来源。
- Survivor：两份固定 CSV 中未找到同类名称候选；保留英文名，待补充同版本官方来源。

不把未匹配解释为“没有官方中文”，也不根据词义猜测中文译名。武器页面标注 1.1.6.3，道具页面标注 1.1.15.4，说明英文 Wiki 内部也存在版本标注差异；数值不能与旧 CSV 版本直接绑定。

## 自动处理规则
匹配先限定 CHARACTER_/WEAPON_/ITEM_ key 前缀，防止 UI 文案或不同实体类型混入。精确匹配只归一化 NFKC、空白和大小写；连字符与引号差异仅生成候选，不自动批准。多个候选或重复 key 均不静默选取。不使用模糊拼写相似度直接合并条目。

数据见 data/expanded-mapping.json，输入清单见 data/expanded-targets.json。所有 publishable 均为 false。旧三条试验保留为历史记录，本报告是扩大范围的补充。
