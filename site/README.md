# 中文百科交互原型
在线地址：https://aquila-ccg.github.io/Brotato-Wiki-CN/

直接用浏览器打开 index.html 也可本地预览，无需安装依赖。数据位于 data.js，页面逻辑位于 app.js。搜索支持简体、繁体、英文、人工审核别名及全角字符归一化，支持分类、详情、无结果重置。

当前六个条目均为原创示例，不是游戏资料；没有复制第三方译名表。数据设计见 ../docs/data-model.md，中文来源调查见 ../docs/chinese-sources.md。

已通过语法、模拟 DOM 搜索与交互、数据校验及非法数据拒绝测试；尚未完成真实浏览器视觉与交互回归测试。GitHub Actions 自动发布 site 的四个网页文件。
