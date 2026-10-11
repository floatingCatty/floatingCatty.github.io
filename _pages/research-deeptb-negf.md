---
layout: research
permalink: /research/deeptb-negf/
title: "DeePTB-NEGF：从学习到的哈密顿量计算量子输运"
title_en: "DeePTB-NEGF: transport from learned Hamiltonians"
description: "A DeePTB and DPNEGF workflow for quantum transport in graphene, h-BN and MoS2, compared with first-principles DFT-NEGF calculations."
description_zh: "DeePTB 和 DPNEGF 结合，计算石墨烯、氮化硼和二硫化钼的量子输运，并与 DFT-NEGF 对照。"
paper_year: 2025
paper_url: "https://arxiv.org/abs/2512.11291"
code_url: "https://github.com/deepmodeling/dpnegf"
---

<div class="post-zh" lang="zh-Hans" markdown="1">

做量子输运计算时，NEGF 通常需要先拿到体系的哈密顿矩阵。用 DFT 直接构造当然比较可靠，但材料一大，或者想换很多个结构反复计算，这一步往往就是主要开销。DeePTB 能从原子结构预测紧束缚哈密顿量，于是一个自然的问题是：能不能把它直接接到量子输运求解器里？

这篇合作工作尝试了这件事。我们把 DeePTB 预测的哈密顿量接到 DPNEGF，研究石墨烯、六方氮化硼和 MoS₂ 这三种二维材料，并与传统 DFT-NEGF 得到的能带和电子透射谱做比较。预印本报告了较好的一致性，以及在这些测试体系上的计算效率提升。

这里实际上有两层需要分开验证的近似。一层是学习到的哈密顿量是否准确，另一层是输运求解器能否正确处理接触、器件几何和边界条件。即使能带看起来相近，透射也不一定自然就会准确。所以我觉得把模型和物性计算接在一起，并做完整的输运对照，比单独展示一个好的哈密顿量误差更有意义。

目前公开的是预印本。它说明了这条计算路线在几个典型二维材料上的可行性，但不能据此说所有缺陷、界面或实际器件都已有同等的精度。

</div>

<div class="post-en" lang="en" markdown="1">

A quantum transport calculation usually begins with a Hamiltonian. Constructing it directly from DFT can be reliable, but it becomes expensive when the system is large or when we want to compare many different structures. DeePTB can predict a tight-binding Hamiltonian from an atomic structure, which raises a natural question: can we use that Hamiltonian directly in a quantum transport solver?

This collaborative work tests that idea. We connect a DeePTB-predicted Hamiltonian to DPNEGF and study three two-dimensional materials: graphene, hexagonal boron nitride and MoS₂. The preprint compares the resulting band structures and electronic transmission spectra with conventional DFT-NEGF calculations. It reports good agreement and lower computational cost for the tested systems.

There are really two separate things to validate. First, the learned Hamiltonian has to be accurate. Second, the transport solver has to treat contacts, device geometry and boundary conditions correctly. Similar-looking band structures do not automatically guarantee accurate transmission. That is why testing the entire route from the learned model to a transport observable matters more than reporting a Hamiltonian error alone.

The work is currently available as a preprint. It provides evidence for this approach on several representative materials, not a guarantee of the same accuracy for arbitrary defects, interfaces or devices.

</div>
