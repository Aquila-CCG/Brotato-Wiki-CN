# Phase 0 调研记录

## 判定
调研已形成阶段记录；许可确认、图片逐项授权、CSV 完整度统计仍未完成；按用户要求，版本基准采用所提供的英文 Wiki，不再要求 Switch 对照。内容导入保持关闭。

## Wiki 内容与自动访问
[Spells & Guns 首页](https://spellsandguns.com/) 的搜索索引声明 CC BY-SA，但未确认具体版本；本次直接访问返回 403。[使用条款](https://brotato.wiki.spellsandguns.com/Term_of_Use) 对个人使用、衍生作品、类似网站与再分发设有限制。不能把首页声明当作已解决条款冲突的授权。需站方确认许可版本、适用页面、翻译镜像与自动采集条件。

2026-11-24 实测 https://brotato.wiki.spellsandguns.com/api.php?action=query&meta=siteinfo&siprop=general%7Crightsinfo&format=json 成功返回 JSON：MediaWiki 1.43.11，语言 en，articlepath /$1，scriptpath 为空，rightsinfo.url 与 rightsinfo.text 均为空。接口开放不是转载授权。

初次受限网络请求 DNS 失败，经允许的网络访问重试成功。robots.txt 请求返回标题 Robots.txt 的 MediaWiki HTML，wgArticleId=0，未取得有效 robots 规则。不能解释为允许批量抓取；未发现已核实的专用 API 使用政策或配额。

## 页面结构
[Characters](https://brotato.wiki.spellsandguns.com/Characters) 是列表与角色详情链接，表格字段为名称、属性、解锁条件、解锁奖励、标签；编辑提示指向 Template:Character Data，说明数据集中在模板。导入方案应追踪模板及引用页的修订，不能只监测列表页。尚未实测 parse、revisions、imageinfo，也未证明全部实体采用相同模板。

## 官方翻译来源
[仓库](https://github.com/BrotatoMods/Brotato-Translations) README 自述文件由 Blobfish 提供，并指向模组翻译使用说明；这不是通用转载许可。根目录未显示 LICENSE，尚无已核实的百科再发布授权。

观察到版本文件：0.8.0.3、1.0.0.3、1.1.6.0（本体及 dlc_1）、1.1.13.2（本体及 dlc_1）、1.1.14.1。最新文件名不证明与英文 Wiki 当前内容完全对应，也不证明最新 DLC 翻译完整。

[1.1.14.1 CSV](https://raw.githubusercontent.com/BrotatoMods/Brotato-Translations/main/translations-v1.1.14.1.csv) 可读取，表头含 keys、en、zh、zh_TW 等字段；存在引号包围的多行文本，必须使用 CSV 解析器。此次未保存 CSV、未统计空值/重复键/占位符，也未锁定 commit SHA，因此完整度尚待验证。

后续获准后：固定提交 SHA 与文件哈希，分别统计本体/DLC 总行数、唯一键数、中文空值、重复键、占位符差异；记录英文 Wiki 来源 URL、页面修订号、同步时间、页面明确标注的游戏版本（如有）、dlc 及翻译 CSV 提交。以英文 Wiki 为内容基准，不设置 switch_verified 或用户实机核验门槛；CSV 缺失或不匹配的词条单独记录。

## 图片
未获得可覆盖游戏图标、截图和 Wiki 上传文件的再分发授权。CC 声明不能自动覆盖第三方素材。尚未完成文件描述页逐项核验，先使用原创占位图。每张图片未来记录作者、来源页、许可、授权证据和署名要求。

## 尚需解决
1. 站方澄清 CC 版本与使用条款关系，以及 API 频率和镜像权限。
2. 游戏权利人确认图片和官方翻译再发布范围。
3. 实测更多只读 API（在确认自动访问条件后），完成 CSV 质量统计和英文 Wiki 内容对照。
4. GitHub 仓库已由用户建立：https://github.com/Aquila-CCG/Brotato-Wiki-CN 。初始文件仅包含原创文档与脚本；未发送授权询问信件。
