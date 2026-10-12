---
layout: research
permalink: /zh/research/learned-hamiltonians-to-observables/
title: "从机器学习哈密顿量到真正可计算的电子物性"
title_en: "From learned Hamiltonians to scalable electronic properties"
description: "A technical guide to turning learned electronic Hamiltonians into density of states, optical response and quantum transport, with published DeePTB, SLEM, VBCSR and NEGF examples."
description_zh: "从 DeePTB 和 SLEM 预测哈密顿量，到利用稀疏算法计算态密度、光学响应和器件输运：一份有原始论文依据的技术路线说明。"
paper_year: 2026
project_kind: guide
tags:
  - Electronic structure
  - Scientific computing
paper_url: "https://doi.org/10.1038/s41467-024-51006-4"
code_url: "https://github.com/deepmodeling/DeePTB"
citation_urls:
  - "https://doi.org/10.1038/s41467-024-51006-4"
  - "https://proceedings.iclr.cc/paper_files/paper/2025/hash/7db2ffcbfd0bd361d47b7fa612bd2ba2-Abstract-Conference.html"
  - "https://arxiv.org/abs/2609.04397"
  - "https://doi.org/10.1103/PhysRevB.108.195143"
  - "https://doi.org/10.1038/s41524-025-01853-6"
  - "https://doi.org/10.1038/s41524-026-02137-3"
research_locale: zh
translation_url: "/research/learned-hamiltonians-to-observables/"
alternate_en_url: "/research/learned-hamiltonians-to-observables/"
alternate_zh_url: "/zh/research/learned-hamiltonians-to-observables/"
translation_of: "/research/learned-hamiltonians-to-observables/"
---


<div class="post-zh" lang="zh-Hans" markdown="1">

一个机器学习模型能够准确预测哈密顿量，并不等于我们已经能计算真正需要的物性。哈密顿量描述了电子之间的耦合，但实验上关心的往往是电导、缺陷附近的电子分布，或者把电极接在器件两端后会流过多少电流。

我做 DeePTB、SLEM、量子输运和大型稀疏矩阵时，反复碰到的是同一个断层：**预测算符可以很快，后面的数值计算却仍然可能贵得做不了**。这篇文章把几项已公开的工作连起来，讨论它们分别解决了什么问题，以及哪些事情不能直接推出来。它不是一篇新论文，也不包含未公开的算法或结果。

## 从结构到物性，中间缺了什么

整个过程可以分成五步：

**原子结构与环境 → 哈密顿量与重叠矩阵 → 可扩展数值计算 → 物理观测量 → 物理验证。**

预测矩阵是否准确，是模型的问题；百万原子能否跑得动，涉及矩阵格式、内存与多机通信；要计算光学和输运响应，则还需要边界条件和正确的物理表达式。不同环节有不同的误差来源。

| 环节 | 问题 | 必须验证的内容 |
| --- | --- | --- |
| 算符预测 | 能否泛化到未见过的结构？ | 能带、对称性、局域环境的外推 |
| 基底表示 | 算符作用在哪种轨道基底上？ | 重叠矩阵、轨道顺序、厄米性 |
| 数值算法 | 目标规模上能否高效计算？ | 误差、峰值内存、通信与总时间 |
| 物性提取 | 计算的是正确的物理量吗？ | DOS、电子密度、光学和透射的参照 |
| 实验对应 | 数值差别能否被测量？ | 电极、静电场、温度与不确定性 |

## DeePTB 和 SLEM：预测的是不同层次的算符

[DeePTB](https://doi.org/10.1038/s41467-024-51006-4) 使用紧凑的 Slater–Koster 紧束缚表示，从第一性原理电子信息中学习随局域环境变化的参数。原子热运动和结构畸变会改变跃迁参数，因此不必给每个键固定一套值。2024 年的工作将学习到的哈密顿量交给紧束缚传播算法，对 **100 万原子 GaP** 计算有限温度的态密度和光学性质。这是百万原子的学习型哈密顿量计算，**不是百万原子自洽 DFT**。[项目介绍]({{ '/zh/research/deeptb/' | relative_url }}) · [代码](https://github.com/deepmodeling/DeePTB)。

[SLEM](https://proceedings.iclr.cc/paper_files/paper/2025/hash/7db2ffcbfd0bd361d47b7fa612bd2ba2-Abstract-Conference.html) 更直接地面向原子轨道 DFT 的矩阵，包括哈密顿量和重叠矩阵。严格局域的等变网络处理了轨道张量在空间旋转下的变换。相比紧凑的正交紧束缚模型，这里多了一个不能忽视的问题：**原子轨道基底通常不正交**。[项目介绍]({{ '/zh/research/slem/' | relative_url }})。

非正交基底中的本征问题是

$$
Hc_n=E_n S c_n,
$$

其中 $S$ 是重叠矩阵。如果直接把 $H$ 送入假定 $S=I$ 的算法，求解的可能就是另一个问题。模型还必须满足相应的对称性和数值条件。即使两个哈密顿量的误差很小，某些对能级简并、带隙或费米能附近细节敏感的物性，也未必有同样小的误差。

## 求态密度不必先得到全部本征态

对有限维、厄米的 $H$ 与正定的 $S$，可以写出推迟格林函数和展宽的态密度：

$$
G^r(E)=\left[(E+i\eta)S-H\right]^{-1},
$$

$$
D_\eta(E)=-\frac{1}{\pi}\operatorname{Im}\operatorname{Tr}\!\left[S\,G^r(E)\right],\qquad \eta>0.
$$

迹里的 $S$ 是非正交度量的一部分，不应省去。不过写出逆矩阵，并不意味着要显式构造巨大的稠密逆矩阵。局域哈密顿量往往是稀疏的，矩阵向量乘法比完整对角化便宜得多；多项式传播和随机迹方法可以利用这一点。

但这里有一个经常被忽略的前提：**应用 $H$ 很便宜，不代表所有涉及 $S^{-1}$ 的运算都便宜**。能量展宽、随机误差、展开阶数和最终需要的谱分辨率也都需要检查。粗分辨率的总态密度，与极高精度的局域态密度或线性响应，难度并不相同。

[DeePTB 的 Nature Communications 论文](https://doi.org/10.1038/s41467-024-51006-4) 给出了百万原子 GaP 的 TBPM 后处理案例。而另一篇 [2026 年 npj Computational Materials 论文](https://doi.org/10.1038/s41524-026-02137-3) 将 DeePMD 热运动采样与 HSE 训练的 DeePTB 结合，研究最大 4096 原子超胞的声子辅助光学谱。两者解决的是不同尺度与精度的问题，不能混成“百万原子 HSE 自洽计算”。

## VBCSR：矩阵的存储方式也会决定能算多大

一个原子的若干轨道与另一个原子的轨道之间，对应的往往是一个小稠密块。不同元素的轨道数不同，矩阵块尺寸也可能不同。把所有数据拆成单独标量，既增加索引开销，也不利于利用块内的高效计算。

[VBCSR 预印本](https://arxiv.org/abs/2609.04397) 描述了一套保留可变大小原子块的稀疏矩阵工具：相同形状的块可以成组计算，矩阵通过 MPI 分布在多个进程之间。论文报告了多个稀疏矩阵 benchmark，并展示了一个超过百万原子的 InP 纳米颗粒应用。[项目介绍与实际 benchmark]({{ '/zh/research/vbcsr/' | relative_url }}) · [代码](https://github.com/DeepElectron/vbcsr)。

判断这种方法的价值，至少要分开看三件事：某种矩阵格式是否适合目标块结构；一个乘法 kernel 在特定硬件上是否更快；**完整的物理计算**是否真的以可接受的误差更快完成。阈值截断可以阻止中间矩阵不断变稠密，但也引入近似；通信、内存和物性误差要一起报告。

## 量子输运：有了哈密顿量，还得有电极和边界

材料的能带不能直接告诉我们器件电流。输运需要考虑接触、边界条件，以及有栅极时的静电势。相干 NEGF 中，中心区域格林函数包含左右电极的自能：

$$
G^r_C(E)=\left[(E+i\eta)S_C-H_C-\Sigma^r_L(E)-\Sigma^r_R(E)\right]^{-1}.
$$

透射与电极耦合和格林函数共同有关；非正交基底中的耦合也必须一致处理。因此，**能带误差小不等于透射误差小**。

[2025 年 npj Computational Materials 的 DeePTB-NEGF 工作](https://doi.org/10.1038/s41524-025-01853-6) 用学习型哈密顿量计算了超过一万种断裂结结构，并研究碳纳米管晶体管。41 nm 沟道的栅控器件与实验转移曲线进行对照；另一个 180 nm 碳管案例计算的是**零偏压透射**，并非 180 nm 的完整有限偏压栅控模拟。类似地，[二维材料研究](https://arxiv.org/abs/2512.11291) 在石墨烯、h-BN 和 MoS₂ 上与 DFT-NEGF 透射结果进行比较。[项目介绍]({{ '/zh/research/deeptb-negf/' | relative_url }})。这些结果不能直接证明任意缺陷、界面和真实工业器件都具有相同精度。

另一个方向是让输运计算本身可微。我更早做的 [AD-NEGF（Physical Review B 2023）](https://doi.org/10.1103/PhysRevB.108.195143) 使用自动微分和隐式层，在紧束缚 NEGF 框架里计算导数，用于灵敏度分析和逆向设计。它没有消除物理模型的近似，只是让给定模型的计算与梯度保持一致。[项目介绍]({{ '/zh/research/ad-negf/' | relative_url }})。

## 我会怎样检查一项“大规模高精度”计算

看一个模型或求解器是否可信，我通常会问：

1. **训练范围：** 参考数据包括哪些元素、结构和电子态？测试集是真正独立的吗？
2. **算符一致性：** $H$、$S$ 的厄米性、正定性、轨道约定是否与数值求解器匹配？
3. **物性误差：** 不能只看训练损失；DOS 峰位、局域电荷、光学谱或透射本身，与参考结果差多少？
4. **数值收敛：** 答案对展宽、随机采样、多项式阶数、稀疏阈值和电极自能有多敏感？
5. **端到端开销：** 报告的是整套有用计算的时间、内存、节点数与通信，还是一个特别适合某种硬件的矩阵 kernel？

这套问题也适合给 Coding Agent。Agent 可以训练模型、运行计算、生成图片，但还应该留下输入、模型版本、算符约定、数值参数、参考结果以及失败的检查。否则一次自动化执行得再快，换个人也不容易复现。我做的 [flower](https://github.com/floatingCatty/flower) 就关注这个问题；仓库已经有一个[可复现实验案例](https://github.com/floatingCatty/flower/blob/main/docs/REPRODUCING_AGENT_CALCULATIONS.md)。

## 最后

我越来越觉得，科学计算真正有价值的单位不是“模型输出一个矩阵”，而是一条能把原子结构变成**可验证的物理答案**的工作流。学习型算符、稀疏数值算法和物性求解器解决的是不同瓶颈。它们确实让新的规模和科学问题变得可能，但前提是整条计算链的误差和适用范围都能交代清楚。

本文仅梳理已公开的论文与代码，没有涉及未发布的手稿结果。

### 原始资料

- [DeePTB — Nature Communications **15**, 6772 (2024)](https://doi.org/10.1038/s41467-024-51006-4)
- [SLEM — ICLR 2025](https://proceedings.iclr.cc/paper_files/paper/2025/hash/7db2ffcbfd0bd361d47b7fa612bd2ba2-Abstract-Conference.html)
- [VBCSR — arXiv:2609.04397](https://arxiv.org/abs/2609.04397)
- [AD-NEGF — Physical Review B **108**, 195143 (2023)](https://doi.org/10.1103/PhysRevB.108.195143)
- [DeePTB-NEGF — npj Computational Materials **11**, 375 (2025)](https://doi.org/10.1038/s41524-025-01853-6)
- [声子辅助光学谱 — npj Computational Materials **12**, 268 (2026)](https://doi.org/10.1038/s41524-026-02137-3)
- [二维材料量子输运 — arXiv:2512.11291](https://arxiv.org/abs/2512.11291)

</div>
