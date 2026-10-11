---
layout: research
permalink: /research/logdet-entropy/
title: "LogDet：用矩阵估计神经网络里的信息量"
title_en: "LogDet: estimating information in neural networks"
description: "The LogDet entropy estimator measures high-dimensional information using matrix operations and was applied to the analysis of neural networks."
description_zh: "LogDet 熵估计器利用矩阵运算处理高维数据，用于分析神经网络特征中的信息变化。"
paper_year: 2025
paper_url: "https://doi.org/10.1016/j.neucom.2025.131520"
paper_title: "Understanding neural networks with logarithm determinant entropy estimator"
paper_doi: "10.1016/j.neucom.2025.131520"
paper_authors:
  - "Zhanghao Zhouyin"
  - "Ding Liu"
---

<div class="post-zh" lang="zh-Hans" markdown="1">

我本科时做过一段时间神经网络理论，最感兴趣的是网络内部的信息到底发生了什么变化。比如一层层特征传递下去，哪些东西保留下来了，哪些被丢掉了。信息论给我们提供了熵和互信息这些工具，但真要把它们用在高维神经网络特征上，估计本身就不容易。

直接估计高维概率分布需要大量样本。一些常见的熵估计器，在维度很高或者数据分布比较特殊时也容易出现偏差。我们于是试了一种从矩阵出发的办法：利用样本构成的矩阵及其对数行列式（LogDet）来估计信息量，省去直接重建完整概率密度的步骤。

论文中我们做了几组对比实验，也把估计器用来观察神经网络训练过程中不同层的特征变化，希望借此分析信息瓶颈理论里讨论的现象。这篇工作很早就开始了，后来经过几轮修改，发表在 2025 年的 Neurocomputing。

这类指标的意义也要放在具体估计方法里看。它可以帮助比较和观察网络，但不能简单地把一个估计数值当作对网络内部信息的完整解释。我后来转到物理计算，仍然常常碰到类似的问题：先要弄清楚我们用的量到底测量了什么，才谈得上从结果里得出结论。

</div>

<div class="post-en" lang="en" markdown="1">

As an undergraduate, I spent some time studying neural-network theory. I was interested in what happens to information inside a network: what survives as features pass through layers, and what gets discarded. Information theory gives us entropy and mutual information, but estimating them for high-dimensional neural-network features is difficult in practice.

Estimating a full probability distribution in many dimensions takes a great deal of data. Some familiar entropy estimators also become unreliable in high dimensions or with unusual data distributions. We tried a matrix-based approach instead. The LogDet estimator uses the logarithm of a determinant of a matrix constructed from the samples, avoiding the need to reconstruct a full probability density directly.

In the paper, we compared the estimator with other methods and used it to look at how features change across network layers during training, in connection with questions from information bottleneck theory. We began this work quite early and revised it over time. It was eventually published in Neurocomputing in 2025.

As with other estimated quantities, the numbers need to be interpreted in the context of the method. They can help compare and observe networks, but an estimated value is not a complete explanation of the information inside a model. I kept encountering a similar question after moving into computational physics: before drawing conclusions from a result, we need to know what the quantity we calculated actually measures.

</div>
