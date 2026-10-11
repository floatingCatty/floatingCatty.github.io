---
layout: research
permalink: /research/nqs-impurity/
title: "用神经网络求解量子嵌入里的杂质问题"
title_en: "Neural quantum states for quantum embedding"
description: "A research note on a neural-quantum-state impurity solver in ghost Gutzwiller quantum embedding and its sampling bottleneck."
description_zh: "用神经量子态求解 ghost Gutzwiller 量子嵌入中的杂质模型，以及高精度采样带来的计算开销。"
paper_year: 2026
paper_url: "https://doi.org/10.1103/rkd8-q6yl"
paper_title: "Neural-quantum-states impurity solver for quantum embedding problems"
paper_doi: "10.1103/rkd8-q6yl"
paper_authors:
  - "Zhanghao Zhouyin"
  - "Tsung-Han Lee"
  - "Ao Chen"
  - "Nicola Lanatà"
  - "Hong Guo"
---

<div class="post-zh" lang="zh-Hans" markdown="1">

电子之间的相互作用比较强时，计算材料的电子状态会变得很困难。一个直接的办法是把许多电子放在一起求解，但体系稍微大一点，可能的量子态数量就增长得很快。量子嵌入方法换了一种处理方式：把其中最难的一小部分当作杂质问题来算，再让它与周围的有效环境反复交换信息。

我做的这篇工作，考虑的是 ghost Gutzwiller approximation（gGA）中的杂质求解器。通常可以用精确对角化作为参照，只是它的计算开销随杂质自由度增加会变得很大。我们尝试用神经量子态（NQS）表示多电子波函数，网络采用图 Transformer，让杂质轨道之间不必拘泥于某一种固定连接方式。

麻烦出现在嵌入计算的迭代里。杂质求解器一次得到的结果还要送回外层自洽过程，电荷和其他物理量只要有一点采样噪声，误差就可能一轮轮积累。我们因此加入了误差控制，在 Anderson 晶格模型的测试中，结果可以与使用精确对角化杂质求解器的计算很好地吻合。

原先我也以为主要时间会花在训练神经网络上。实际分析计算开销后发现，对这个问题来说，更难的是把需要的物理量采样到足够高的精度。神经量子态本身能表示复杂波函数，并不意味着自洽计算就会很便宜。怎样减少高精度采样的成本，是这项工作留下的问题。

</div>

<div class="post-en" lang="en" markdown="1">

When electrons interact strongly, calculating the electronic state of a material becomes difficult. We could try solving for many electrons at once, but the number of possible quantum states grows rapidly with system size. Quantum embedding takes a different approach. It treats a smaller, difficult part as an impurity problem and repeatedly exchanges information between that problem and an effective environment.

In this paper, we worked on an impurity solver for the ghost Gutzwiller approximation (gGA). Exact diagonalization is a useful reference, but its cost becomes large as the number of impurity degrees of freedom grows. We tried representing the many-electron wavefunction with a neural quantum state (NQS). Our model uses a graph Transformer, so it can handle impurity orbitals with different patterns of connectivity.

The difficult part appears inside the embedding iterations. Results from the impurity solver are fed back into an outer self-consistency loop. Small sampling errors in charge or other observables can accumulate between iterations. We therefore added error control. On the Anderson lattice model, the results agreed well with calculations using an exact-diagonalization impurity solver.

At first, I also expected training the neural network to take most of the time. Looking at the computational cost showed something different: for this problem, accurately sampling the observables is harder than optimizing the network. A neural quantum state may represent a complicated wavefunction, but that does not make the full self-consistent calculation cheap. Reducing the cost of high-accuracy sampling is still an open problem.

</div>
