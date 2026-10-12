---
layout: research
permalink: /zh/research/ad-negf/
title: "AD-NEGF：可微的量子输运计算"
title_en: "AD-NEGF: differentiable quantum transport calculations"
description: "AD-NEGF computes gradients through tight-binding quantum-transport calculations for sensitivity analysis and inverse Hamiltonian design."
description_zh: "AD-NEGF 为紧束缚量子输运计算增加梯度，用于灵敏度分析和哈密顿量逆向设计。"
paper_year: 2023
paper_url: "https://doi.org/10.1103/PhysRevB.108.195143"
code_url: "https://github.com/floatingCatty/ADNEGF"
research_locale: zh
translation_url: "/research/ad-negf/"
translation_of: "/research/ad-negf/"
alternate_en_url: "/research/ad-negf/"
alternate_zh_url: "/zh/research/ad-negf/"
---

<div class="post-zh" lang="zh-Hans" markdown="1">

我在天津大学做量子输运的时候，常常用 NEGF（非平衡格林函数）方法算电子通过一个器件的透射和电流。给定描述电子能量和耦合的哈密顿量，再加上电极和偏压，程序就能算出结果。但如果想知道某个参数改一点，电流会变多少，往往只能改完再跑一次。参数多的时候，这个办法很慢。

我们当时想试试，能不能直接对整个输运计算求导。比如，电流对某个轨道耦合、原子位置或其他输入变量的梯度。有了这些导数，可以分析模型对什么最敏感，也可以尝试反过来调整哈密顿量，让它接近某个目标输运性质。

AD-NEGF 用 PyTorch 实现了 NEGF 计算流程，并针对部分求解步骤写了专门的反向传播。NEGF 里有矩阵求逆和需要数值求解的中间量，直接依赖一般的自动微分不一定合适，所以论文中也用了隐式求导的方法。我们验证了梯度计算，还展示了从目标输运性质反过来优化哈密顿量的例子。

不过，这里的设计主要还在模型层面。哈密顿量参数怎样对应到实际能够制造的器件结构，散射、缺陷、接触等效应怎么处理，都需要另外建模。能对求解器求导，确实方便了很多原本只能反复试算的工作，但离直接用于真实器件设计，还有不少事情要做。

</div>
