---
layout: research
permalink: /research/deeptb/
title: "一百万个原子的电子结构，怎么算？"
title_en: "How do you calculate electronic structure in a million-atom material?"
description: "How DeePTB learns tight-binding parameters from first-principles electronic energies and applies them to million-atom electronic-property calculations."
description_zh: "DeePTB 如何从第一性原理电子能级学习紧束缚参数，再用于百万原子电子物性计算。"
paper_year: 2024
paper_url: "https://www.nature.com/articles/s41467-024-51006-4"
code_url: "https://github.com/deepmodeling/DeePTB"
---

<div class="post-zh" lang="zh-Hans" markdown="1">

把一块半导体加热，原子不会一直待在晶格上的同一个位置。它们在振动，原子之间的距离也在变，电子感受到的环境便跟着改变。想知道温度怎样影响材料的电子状态和光学性质，光计算一个整齐的、静止的晶胞是不够的。

密度泛函理论（DFT）可以从量子力学出发计算电子结构。不过，要在很多个热振动构型上反复计算，再把体系放大到几十万、上百万个原子，成本很快就会高到难以承受。DeePTB 是我们为这个问题尝试的一条路。

## 让模型学紧束缚参数

我们先用紧束缚模型来描述电子。它把问题写成一张矩阵，叫作哈密顿量：矩阵里有原子轨道的能量，也有电子在不同轨道之间的耦合。经验紧束缚模型计算得很快，只是那组固定参数遇到应变、热振动或新的局部结构时，未必还能准确描述电子。

DeePTB 让神经网络读取原子附近的局部环境，预测这组紧束缚参数。训练的参照是较小体系的第一性原理电子能级。我们把预测参数组装成哈密顿量，算出能级，再与参照结果比较；不需要预先准备一整张作为标签的紧束缚哈密顿矩阵。

所以对一个新的原子构型，我们可以生成随局部结构变化的电子模型，再用它计算电子性质。它仍然是一个有轨道、有耦合关系的物理模型；机器学习负责的是其中随环境变化的数值。

## 一百万个原子，具体算了什么

论文里有一个磷化镓（GaP）的例子。我们从分子动力学采样的原子构型出发，将结构扩展成包含一百万个原子的体系，再用 DeePTB 生成电子哈密顿量。接下来借助紧束缚传播方法（TBPM），计算随温度变化的态密度、光学电导率、介电函数和折射率。

这里的“一百万个原子”说的是紧束缚电子模型及其后续物性计算的规模。我们没有对这一百万个原子直接做一次全自洽 DFT。这个区别关系到你应该怎样理解论文的计算成本，也关系到结果究竟依赖哪些近似。

模型学到的参数不能保证对所有材料都准。如果出现训练集没有覆盖的化学环境、成键方式或缺陷，就得用新的第一性原理数据检查。另一个问题也还在：即使哈密顿量可以很快得到，从大矩阵里进一步求各种物性，仍需要合适的数值算法。我后来继续做大尺度电子性质计算，很大一部分原因就在这里。

</div>

<div class="post-en" lang="en" markdown="1">

Heat a semiconductor and its atoms do not stay neatly fixed on their lattice sites. They vibrate, the distances between them change, and so does the environment felt by the electrons. If we want to study how temperature affects electronic states and optical properties, a calculation on a single, perfectly ordered unit cell will not tell us enough.

Density-functional theory (DFT) can calculate electronic structure from quantum mechanics. But repeating those calculations for many thermally distorted structures, especially with hundreds of thousands or a million atoms, is prohibitively expensive. DeePTB was our attempt to work around that cost.

## Learning the tight-binding parameters

We start from a tight-binding model. It describes the electrons using a matrix called the Hamiltonian. The matrix contains orbital energies and the couplings that allow electrons to move between orbitals. An empirical tight-binding model is fast, but a fixed set of parameters may stop being accurate when atoms are strained, vibrate, or acquire new neighbors.

DeePTB uses a neural network to read the local environment around the atoms and predict those tight-binding parameters. The training reference is a set of electronic energy levels from first-principles calculations on smaller systems. We assemble the predicted Hamiltonian, calculate its energy levels, and compare them with the reference. We do not need a precomputed tight-binding Hamiltonian as the training label.

For a new atomic configuration, the model can then supply a Hamiltonian that changes with the local structure. We still have orbitals and couplings with a physical interpretation. Machine learning supplies their environment-dependent values.

## What we calculated with a million atoms

One example in the paper is gallium phosphide (GaP). We started from atomic configurations sampled by molecular dynamics, expanded them into a system containing one million atoms, and generated electronic Hamiltonians with DeePTB. We then used the tight-binding propagation method (TBPM) to calculate temperature-dependent density of states, optical conductivity, dielectric function, and refractive index.

The 'million atoms' refers to the size of the tight-binding electronic model and the subsequent property calculations. We did not run a self-consistent DFT calculation on all one million atoms. That distinction matters for understanding the computational cost and the approximations behind the results.

Learned parameters cannot be assumed accurate for every material. A new chemical environment, bonding pattern, or defect absent from training needs to be checked against fresh first-principles data. There is another problem, too: even when the Hamiltonian is cheap to obtain, extracting properties from a large matrix still takes suitable numerical algorithms. This is part of why I continued working on large-scale electronic-property calculations.

</div>
