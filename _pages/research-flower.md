---
layout: research
permalink: /research/flower/
title: "flower：把 Agent 跑过的计算整理清楚"
title_en: "flower: keeping scientific-agent calculations reproducible"
description: "flower records scientific-agent computation plans, runs and outputs, and exports reproducible protocols across local machines, SSH and Slurm."
description_zh: "flower 记录科学计算 Agent 的任务、运行和结果，并整理成可以重复运行的计算流程。"
project_kind: "software"
code_url: "https://github.com/floatingCatty/flower"
research_locale: en
translation_url: "/zh/research/flower/"
alternate_en_url: "/research/flower/"
alternate_zh_url: "/zh/research/flower/"
---

<div class="post-en" lang="en" markdown="1">

Lately, when I use agents for scientific computing, I keep running into the same problem. An agent can read papers, edit code, submit jobs, and produce many results overnight. The next morning, the working directory is full of scripts, logs and different versions of files. Some of the results look useful, but finding out exactly which step produced a figure, and with which parameters, takes another round of digging.

I'm building a small tool called flower to keep track of that work as it happens. A study is a plan made of steps: the command to run, where it runs, and what output to expect. An agent or a person can update the plan, while flower keeps a record of the runs, changes and results. Jobs can run locally, over SSH, or on a Slurm cluster.

Once a result is worth keeping, the steps leading to it can be exported as a protocol. Someone else can rerun it and compare the outputs. The repository includes examples, including a workflow that reproduces results for the two-dimensional Heisenberg model.

Of course, a recorded workflow cannot tell us whether the physics in a paper is right. It also cannot promise that a different machine will have identical dependencies or numerical behavior. But being able to see what an agent did, and how a result was obtained, makes it much easier to review the work afterward.

</div>
