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
research_locale: en
translation_url: "/zh/research/logdet-entropy/"
alternate_en_url: "/research/logdet-entropy/"
alternate_zh_url: "/zh/research/logdet-entropy/"
---

<div class="post-en" lang="en" markdown="1">

As an undergraduate, I spent some time studying neural-network theory. I was interested in what happens to information inside a network: what survives as features pass through layers, and what gets discarded. Information theory gives us entropy and mutual information, but estimating them for high-dimensional neural-network features is difficult in practice.

Estimating a full probability distribution in many dimensions takes a great deal of data. Some familiar entropy estimators also become unreliable in high dimensions or with unusual data distributions. We tried a matrix-based approach instead. The LogDet estimator uses the logarithm of a determinant of a matrix constructed from the samples, avoiding the need to reconstruct a full probability density directly.

In the paper, we compared the estimator with other methods and used it to look at how features change across network layers during training, in connection with questions from information bottleneck theory. We began this work quite early and revised it over time. It was eventually published in Neurocomputing in 2025.

As with other estimated quantities, the numbers need to be interpreted in the context of the method. They can help compare and observe networks, but an estimated value is not a complete explanation of the information inside a model. I kept encountering a similar question after moving into computational physics: before drawing conclusions from a result, we need to know what the quantity we calculated actually measures.

</div>
