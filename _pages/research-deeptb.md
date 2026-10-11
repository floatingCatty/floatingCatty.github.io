---
layout: research
permalink: /research/deeptb/
title: "把量子计算带到更大的材料里：DeePTB"
title_en: "How can we study the electrons in a million-atom material?"
description: "DeePTB explained: a machine-learned tight-binding method for large-scale electronic structure, with its strengths, assumptions, and limitations."
paper_year: 2024
paper_url: "https://www.nature.com/articles/s41467-024-51006-4"
code_url: "https://github.com/deepmodeling/DeePTB"
---

<div class="post-zh" markdown="1">

我们经常说，材料的性质来自原子的排列。但只知道原子在哪里还不够。金属为什么导电，半导体为什么有带隙，拉伸一块材料又会怎样改变它的电子状态？这些问题最终都要回到电子上。

困难在于尺度。用量子力学从头计算电子行为，可以得到相当细致的答案，但通常需要很昂贵的计算。如果把材料放大到几十万、上百万个原子，或者想观察温度下持续变化的结构，计算成本就成了一个很现实的限制。

**DeePTB 想做的不是用神经网络直接猜一个材料的最终性质，而是先学会描述电子怎样在原子之间运动。** 这是我们选择紧束缚模型（tight-binding）的原因。它把一个复杂的量子问题写成一个相对紧凑的哈密顿量：哪些原子轨道能量较高，电子可以怎样从一个轨道耦合到另一个轨道。

## 从昂贵计算里学什么

常见的第一性原理方法，例如密度泛函理论（DFT），可以为模型提供训练数据。DeePTB 学习原子的局部环境和紧束缚参数之间的联系，再将这些参数组成电子哈密顿量。对一个新的结构，我们不必每次都重复完整的 DFT 计算，就能得到一个可用于后续电子结构分析的模型。

这里有一层物理约束很重要：网络并不是对每个结构重新发明一套毫无关系的预测。紧束缚表示保留了轨道与轨道耦合的结构，机器学习负责使这些参数能随局部原子环境变化。

## 为什么“大”很重要

真实材料很少像课本里那样完美。晶体有温度、有应变、有缺陷，原子会振动，局部结构会变化。许多现象需要足够大的计算区域才能出现。我们在论文中把 DeePTB 用于大体系及有限温度电子模拟，包括百万原子尺度的示例。这让原先受限于计算开销的一类问题有了新的处理方式。

但这里必须区分两件事：**百万原子电子模拟不等于百万原子的全自洽 DFT 计算。** DeePTB 在特定训练范围内用学到的紧束缚模型代替昂贵的电子结构步骤。精度也应当对照适当的第一性原理或实验数据检查，尤其当结构、成键方式和化学环境超出训练数据时。

## 这项工作之后，我仍然在问什么

得到哈密顿量，还不是终点。研究者通常想要的是导电性、局域电子态、输运响应，或缺陷对器件的影响。计算规模变大以后，从哈密顿量继续得到这些可观测性质，又会碰到新的数值瓶颈。后来我在大规模稀疏算子和物性计算上的工作，很大程度上就是从这里接着往下走的。

如果你第一次接触这个领域，可以先记住这条线索：**把高精度的量子计算知识压缩进一个可重复使用的电子模型，再让这个模型去描述更大的材料。**

</div>

<div class="post-en" markdown="1">

We often say that a material's properties depend on how its atoms are arranged. But the positions of the atoms are only part of the story. Why does a metal conduct electricity? Why does a semiconductor have a band gap? What happens to its electrons when we stretch it? To answer these questions, we need a description of the electrons.

The trouble is scale. Quantum-mechanical calculations can describe electrons in considerable detail, but they are expensive. Once a material contains hundreds of thousands of atoms, or its structure keeps changing with temperature, cost becomes a practical obstacle.

**With DeePTB, we did not try to make a neural network guess a final material property. We wanted it to learn how electrons move between atoms.** That is why we used a tight-binding model. It represents a large quantum problem through a more compact Hamiltonian: the energies of atomic orbitals and the couplings that let electrons move between them.

## What does the model learn?

First-principles calculations, such as density-functional theory (DFT), provide training data. DeePTB learns the relation between a local atomic environment and the parameters of a tight-binding Hamiltonian. For a new structure, it can produce an electronic model without repeating an entire DFT calculation.

The choice of representation matters. Rather than predicting unrelated numbers for every structure, the model retains the physical organization of orbitals and their couplings. Machine learning supplies parameters that respond to changes in the atoms around them.

## Why does size matter?

Real materials are not the flawless crystals of introductory textbooks. Their atoms vibrate; they may be strained or contain defects; local arrangements shift. Some effects only become visible in a sufficiently large calculation. In our paper, DeePTB was applied to large systems and finite-temperature electronic simulations, including examples at the million-atom scale.

There is a distinction worth making: **a million-atom electronic simulation with a learned model is not a million-atom self-consistent DFT calculation.** DeePTB replaces part of the expensive work with a learned tight-binding representation. Its accuracy still needs to be tested against suitable reference calculations or experiments, especially when the chemistry or atomic environment differs from the training data.

## The question it left me with

Obtaining a Hamiltonian is not the end of the calculation. We often want conductivity, local electronic states, transport, or the effect of a defect on a device. At larger scales, extracting those observables from the Hamiltonian becomes another numerical problem. Much of my subsequent work on sparse operators and electronic properties begins there.

If the field is new to you, the central idea is simple: **learn a reusable electronic description from expensive quantum calculations, then use it to study larger and less ideal materials.**

</div>
