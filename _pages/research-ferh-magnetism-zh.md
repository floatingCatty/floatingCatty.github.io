---
layout: research
permalink: /zh/research/ferh-magnetism/
title: "FeRh 中交换关联泛函对磁性的影响"
title_en: "Exchange-correlation functionals and magnetism in FeRh"
description: "A note on why density-functional predictions of magnetism in FeRh change with lattice constant and exchange-correlation functional."
description_zh: "关于 FeRh 合金的磁性预测为什么依赖晶格常数和 DFT 交换关联泛函。"
paper_year: 2025
paper_url: "https://doi.org/10.1016/j.commatsci.2024.113561"
research_locale: zh
translation_url: "/research/ferh-magnetism/"
translation_of: "/research/ferh-magnetism/"
alternate_en_url: "/research/ferh-magnetism/"
alternate_zh_url: "/zh/research/ferh-magnetism/"
---

<div class="post-zh" lang="zh-Hans" markdown="1">

FeRh 是铁和铑组成的一种合金，磁性对晶格常数特别敏感。原子之间的距离只要有一点变化，不同磁性状态之间的能量关系就可能跟着改变。这给 DFT 计算出了一个难题：算出来的结果，到底有多少来自材料本身，有多少来自我们使用的近似？

在 DFT 里，电子的交换关联效应需要用一个泛函来近似。实际做计算时，可选的方法有很多，例如 LDA、GGA 和 SCAN。它们在一些材料上可以给出很接近的结果，换一个体系却不一定如此。FeRh 就是一个很适合拿来比较的例子，因为结构、电子和磁性之间联系得很紧。

这篇工作比较了几种交换关联泛函对 FeRh 的描述，包括晶格常数和磁性状态等结果。我们发现，没有哪一个泛函能在所有相关性质上都给出同样可靠的描述。因此研究 FeRh 这类体系时，需要关心计算对泛函和结构参数的依赖，不能只报出一次计算得到的磁性结果。

</div>
