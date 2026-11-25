# 角色、武器与属性图片索引
采集日期：2026-11-25。源站：英文 Brotato Wiki。

使用 MediaWiki parse 和 imageinfo 接口，串行请求，每次间隔 2 秒，设置 maxlag=5。robots.txt 返回 404；这仅表示未取得 robots 规则，不代表图片内容授权。未下载图片二进制、复制文章说明或向维护者发信。

## 结果
- Characters 修订 8708：271 次图片出现；覆盖已登记的全部 74 个角色。
- Weapons 修订 8836：992 次图片出现；按总表中宽度至少 50 的实体链接图片整理出 90 个武器候选。尚未独立核对所有表格行，不能视为全量武器或各等级变体已验证。
- Stats 修订 7813：84 次图片出现；关联 16 个基础主要属性和 Curse，共 17 项。
- 去重 280 个文件（包含总表中的道具等辅助图片），均取得原图地址、文件页、尺寸、SHA1 和扩展元数据。
- icon-mapping.json 共 181 项，均有图片链接；152 项关联到固定版本翻译 CSV 的候选键，其余 29 项保持待匹配。候选键不表示翻译发布授权。

工程学使用 File:Engineering_Stat.png，远程伤害使用 File:Ranged_Damage.png。不能从英文名称直接猜图片文件名。原始网页 alt、显示尺寸、所在页面和修订保存在 icon-assets.json；icon-mapping.json 的 altEn/altZh 为功能性文字标签，并非对图像外观的人工描述。属性中文为编辑标签，其他实体用稳定 ID 与现有翻译映射关联，缺少中文时保留英文。

## 使用状态
280 项 API 元数据均无明确 License/Copyright/Usage 字段；抽查 Well Rounded 文件页也未发现明确图片许可。缺少字段不等于禁止使用，也不等于允许使用。全部标记 reuse=unverified、publishable=false，网站保持现有符号图标；MIT 不覆盖这些图片。未开启远程图片热链。

关联依据是图片所链接的实体页面，并未完成逐图视觉审核。武器等级变体不得凭文件名猜测。下一步需补齐武器表格行覆盖检查、等级变体检查、29 项翻译键以及图片使用依据，再接入公开页面。

数据：data/icon-assets.json（原始出现记录和文件元数据）、data/icon-mapping.json（实体与翻译候选键关联）。脚本 scripts/collect-icons.py 可重新采集；其自动实体 ID 为初步推测，需按映射表核对，不可直接发布。工作流仅在 assets/icon-inventory 分支修改脚本时触发，不定期运行。
