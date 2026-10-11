---
layout: research
permalink: /zh/research/deeptb/
title: "DeePTB：用机器学习做大规模电子结构计算"
title_en: "DeePTB: machine learning for large-scale electronic structure"
description: "DeePTB learns environment-dependent tight-binding parameters from first-principles calculations to study the electronic structure of large materials."
description_zh: "DeePTB 从第一性原理结果中学习随原子环境变化的紧束缚参数，用于大规模材料的电子结构计算。"
paper_year: 2024
paper_url: "https://www.nature.com/articles/s41467-024-51006-4"
code_url: "https://github.com/deepmodeling/DeePTB"
research_locale: zh
translation_url: "/research/deeptb/"
translation_of: "/research/deeptb/"
alternate_en_url: "/research/deeptb/"
alternate_zh_url: "/zh/research/deeptb/"
---

<div class="post-zh" lang="zh-Hans" markdown="1">

DeePTB 是我和顾强强一起做的工作。我们当时想解决一个很实际的问题：第一性原理电子结构计算很贵，体系一大，很多事情就没法直接算了。尤其是有限温度的材料，原子一直在振动，模拟时需要取很多不同的构型。如果每个构型都重新做一次 DFT（密度泛函理论）计算，开销很快就受不了。

我们的办法是让机器学习去拟合紧束缚模型里的参数。紧束缚把电子在不同原子轨道之间的运动写成一个哈密顿矩阵，计算起来比直接做 DFT 便宜很多。传统紧束缚模型往往使用固定参数，原子环境变了，就容易不准。DeePTB 根据附近原子的排列预测这些参数，再把算出的电子能级和第一性原理结果对起来训练。

论文里我们做了一个比较大的例子：把磷化镓（GaP）的分子动力学构型扩展到一百万个原子，用学到的哈密顿量配合紧束缚传播方法，计算态密度、光学电导率等随温度变化的性质。这里的一百万原子指紧束缚模拟的规模，并不是做了一次一百万原子的全自洽 DFT。

这种方法也不是训练一次就能到处用。如果材料的成键方式和局部环境跟训练数据差得太远，就需要重新验证，必要时还得补充 DFT 数据。我后来继续做大规模物性计算，也与这件事有关：哈密顿量能很快预测出来以后，电学、光学和输运这些真正关心的物理量，依然不容易算。

</div>
