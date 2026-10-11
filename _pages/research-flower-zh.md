---
layout: research
permalink: /zh/research/flower/
title: "flower：把 Agent 跑过的计算整理清楚"
title_en: "flower: keeping scientific-agent calculations reproducible"
description: "flower records scientific-agent computation plans, runs and outputs, and exports reproducible protocols across local machines, SSH and Slurm."
description_zh: "flower 记录科学计算 Agent 的任务、运行和结果，并整理成可以重复运行的计算流程。"
project_kind: "software"
code_url: "https://github.com/floatingCatty/flower"
research_locale: zh
translation_url: "/research/flower/"
translation_of: "/research/flower/"
alternate_en_url: "/research/flower/"
alternate_zh_url: "/zh/research/flower/"
---

<div class="post-zh" lang="zh-Hans" markdown="1">

最近用 Agent 做计算，越来越容易碰到一个问题。它可以自己读论文、改代码、提交任务，一晚上跑出很多结果，第二天打开工作目录却常常是一堆脚本、日志和不同版本的文件。每个结果似乎都有用，真要找出哪一步算出了哪张图、用的什么参数，又得重新翻一遍。

我在做一个叫 flower 的小工具，想把这些计算顺手记录下来。每项研究可以写成一份包含若干步骤的计划：这一步运行什么命令、在哪里运行、应当得到什么结果。Agent 或人都可以在执行时更新计划，flower 会把每次运行、修改和结果留在日志里。计算可以放在本机，也可以交给 SSH 机器或 Slurm 集群。

等到某个结果可以用了，就把通向它的计算步骤导出成一个 protocol。其他人拿到这个流程，可以重新运行并核对输出。仓库里已经有这样的示例，包括一套重复计算二维 Heisenberg 模型结果的流程。

它当然没办法替你判断论文里的物理解释是否正确，也不能保证换一台机器就不会遇到依赖或数值差异。不过，如果至少能看清 Agent 究竟做过什么，知道一个结果是怎样算出来的，后面讨论和检查就容易多了。

</div>
