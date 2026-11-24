# 翻译映射试验与质量核查

核查日期：2026-11-24。仅保存结构、统计及候选 key；未复制中文译文或 CSV 到公开仓库，未改动网站真实内容。

固定来源提交：[442c3446c922e22cd7f1305bc206ac0219ed7d07](https://github.com/BrotatoMods/Brotato-Translations/tree/442c3446c922e22cd7f1305bc206ac0219ed7d07)。文件 blob SHA 和明细见 data/translation-audit.json。

| 文件 | 数据行 | 唯一 key | 简体空值 | 繁体空值 | 行列异常 |
| --- | ---: | ---: | ---: | ---: | ---: |
| translations-v1.1.14.1.csv | 1149 | 1148 | 0 | 0 | 0 |
| translations-v1.1.13.2-dlc_1.csv | 264 | 264 | 0 | 0 | 0 |

计数不含表头、loc_keys 元数据与全空行，含 UI 文案，不等于角色/道具数量。非空率为 100% 不代表翻译正确或覆盖英文 Wiki 最新版本。本体与 DLC 文件版本不同，不视作一套同版本数据。

## 需要人工处理的问题
- 本体 EFFECT_GOLD_ON_CRIT_KILL 出现两次，内容含义不同：一个直接描述材料获取，另一个描述概率。禁止按最后一行静默覆盖。
- 本体繁体 EFFECT_TURRET_FLAME 与英文数字占位符集合不一致。
- DLC 繁体 EFFECT_BONUS_WEAPON_CLASS_DAMAGE_AGAINST_CURSED_ENEMIES 缺少一个英文数字占位符。
- 简体未发现本次规则覆盖的数字占位符差异；本检查仅识别 {数字}，不是全面格式或语义验证。

## 三条试验映射
| Wiki 页面 | 修订号 | CSV 候选 key | 方式 |
| --- | --- | --- | --- |
| [Well Rounded](https://brotato.wiki.spellsandguns.com/index.php?title=Well_Rounded&oldid=7393) | 7393 | CHARACTER_WELL_ROUNDED | 人工确认英文 CSV 的 Well-Rounded 连字符差异 |
| [Stick](https://brotato.wiki.spellsandguns.com/index.php?title=Stick&oldid=6782) | 6782 | WEAPON_STICK | 英文名称规范化后精确匹配 |
| [Plant](https://brotato.wiki.spellsandguns.com/index.php?title=Plant&oldid=6733) | 6733 | ITEM_PLANT | 英文名称规范化后精确匹配 |

三条候选均有简体与繁体字段，但保持 publishable=false。候选关系不等于同版本语义验证、第三方许可通过或全量覆盖；不会把模组名称匹配为本体。保留 Wiki 修订号、CSV 提交和明确的人工例外。

## 复核方法
审计脚本只读用户指定的本地 CSV，不自动联网、不写入网站：

```sh
node scripts/audit-translations.cjs /path/to/translations.csv data/mapping-targets.json
node scripts/test-translation-audit.cjs
```

CLI 额外计算输入字节 SHA-256；本次通过 GitHub 连接器在内存审计，记录的是上游 Git blob SHA，未伪称为 SHA-256。报告只包含 key、布尔状态及统计。后续先扩展实体样本和版本覆盖，再处理冲突，不自动修正上游翻译。
