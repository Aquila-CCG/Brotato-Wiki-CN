# Brotato-Wiki-CN
面向 Switch 中文玩家的非官方百科项目。Phase 0 调研日期：2026-11-24（亚洲上海）。目前提供原创项目文档、诊断脚本及 6 个真实词条的原创简要介绍；没有转载 Wiki 正文、图片或翻译 CSV。

版本基准：以用户提供的英文 Wiki（https://brotato.wiki.spellsandguns.com/Brotato_Wiki）的内容为准，记录各来源页面的修订号与同步时间，不要求核对用户的 Switch 版本。

结论：技术接口可访问，但内容发布许可尚未通过。可以开发原创网站框架，不能据此启动全文翻译镜像。

阅读 [调研记录](docs/phase0.md)、[许可边界](docs/copyright.md)、[架构](docs/architecture.md) 和 [路线图](ROADMAP.md)。

Mac 接口诊断：`python3 scripts/test_wiki_api.py`，仅发起一次站点元数据请求，不抓取正文。需已安装 Python 3。

项目仓库：https://github.com/Aquila-CCG/Brotato-Wiki-CN 。本项目非官方授权项目。

在线体验：[中文百科](https://aquila-ccg.github.io/Brotato-Wiki-CN/)。首批内容和验证范围见 [首批词条记录](docs/pilot-entries.md)。
