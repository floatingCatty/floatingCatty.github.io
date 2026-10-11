---
layout: research
permalink: /research/slem/
title: "SLEM：从原子结构预测量子算符"
title_en: "SLEM: predicting quantum operators from atomic structures"
description: "SLEM uses local, rotation-equivariant representations to predict quantum-operator matrices from atomic structures."
description_zh: "SLEM 利用局域性和旋转等变性，从原子结构预测哈密顿量、重叠矩阵等量子算符。"
paper_year: 2025
paper_url: "https://arxiv.org/abs/2407.06053"
---

<div class="post-zh" lang="zh-Hans" markdown="1">

DeePTB 里我们主要学习紧束缚参数。后来做 SLEM 时，想把这件事推进到更一般的原子轨道基组，直接预测 DFT 里的哈密顿量、重叠矩阵和密度矩阵。它们本来就是电子结构程序要用的量，得到这些矩阵后，还可以继续做别的物理计算。

这里有个挺麻烦的地方：原子轨道有方向。比如 p、d 轨道，不能把它们当成原子上附着的普通数字。晶体转一个角度，描述轨道耦合的矩阵也得按对应规则变化；但仅仅换个坐标方向，又不能改变材料本身的能谱。所以我们把旋转等变性（equivariance）的要求直接写进了网络结构里。

我们还限制网络只使用附近一定范围内的原子环境。一般的图神经网络随着消息传递层数增加，会把越来越远的原子也带进来。SLEM 则保持严格的局域性，预测大体系时就比较容易并行。为了处理高角动量轨道，我们也用了 SO(2) 卷积来降低计算开销。

论文里，我们在几类二维和三维材料上测试了这些算符的预测精度和数据效率。局域性和对称性确实帮了不少忙，但严格的局域近似也有适用范围，遇到明显的长程效应仍然需要小心。另外，预测出哈密顿量不代表已经算出了电导率或光学响应。大矩阵后面的这些计算，是我后来继续研究的问题之一。

</div>

<div class="post-en" lang="en" markdown="1">

In DeePTB, we mainly learned the parameters of a tight-binding model. With SLEM, we wanted to work with more general atomic-orbital bases and predict the Hamiltonian, overlap matrix and density matrix from DFT directly. Electronic-structure programs already work with these quantities, so the predicted matrices could be used in further physical calculations.

There is a tricky part: atomic orbitals have directions. The p and d orbitals, for example, are not just numbers attached to atoms. If we rotate a crystal, the matrices describing orbital couplings must transform accordingly. Yet changing the coordinate frame alone should not change the material's energy spectrum. We therefore built rotational equivariance into the network itself.

We also restricted the network to a fixed neighborhood around each atom. In an ordinary graph neural network, adding message-passing layers brings information from progressively more distant atoms. SLEM keeps the dependence strictly local, making predictions on large structures easier to parallelize. We also used SO(2) convolutions to reduce the cost of handling higher-angular-momentum orbitals.

In the paper, we tested the accuracy and data efficiency of these operator predictions on several two- and three-dimensional materials. Locality and symmetry helped, although a strictly local approximation has its limits and needs care when long-range effects matter. And predicting a Hamiltonian does not mean we have already calculated conductivity or optical response. Working with the resulting large matrices became part of my later research.

</div>
