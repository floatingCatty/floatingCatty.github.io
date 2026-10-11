---
layout: research
permalink: /research/slem/
title: "让 AI 学会材料里的量子算符：SLEM"
title_en: "Can a model learn the quantum rules around each atom?"
description: "A plain-language explanation of SLEM, a strictly local equivariant model for Hamiltonian, overlap and density matrices in electronic-structure simulations."
paper_year: 2025
paper_url: "https://arxiv.org/abs/2407.06053"
---

<div class="post-zh" markdown="1">

想象两块由相同元素组成的材料。一块原子排列整齐，另一块有一点扭曲，或者多了一个缺陷。元素没有变，但电子行为可能很不一样。原子的邻居是谁、它们离得多远、朝什么方向排列，都会影响材料里的量子状态。

如果要让机器学习理解这种变化，我们究竟该让它预测什么？直接猜能带或某个性质当然可以，但那样往往很难把结果用于别的物理计算。我们更希望得到的是计算这些性质所需要的**量子算符**，例如哈密顿矩阵、重叠矩阵和密度矩阵。

## 一个局部问题，为什么会那么难

原子附近的环境看起来只是一个小范围的问题。可是电子轨道不仅有距离，还有方向。把整块材料旋转一下，材料的物理性质不该凭空改变；同时，描述不同方向轨道的矩阵元素又必须按正确规则变换。

SLEM（Strictly Localized Equivariant Message-passing）就是围绕这两个要求设计的：**严格控制每个预测所依赖的空间范围，同时保留旋转对称性。** 这里的 *equivariant* 并不是一个神奇的网络标签，而是说当输入结构旋转时，输出的量子算符也应按物理允许的方式旋转。

这类约束让模型有机会在数据有限时更有效地学习，也使预测能够在不同尺寸的结构上复用局部信息。论文中研究了哈密顿量、重叠矩阵与密度矩阵等 DFT 算符的预测，并检验了相应的精度和计算表现。

## 为什么预测算符，而不是只预测答案

一个能带数值只能回答一个特定问题。矩阵算符却保留了更多信息：原则上可以把它交给后续电子结构程序，进一步计算光谱、电子分布或响应性质。这相当于试着学会一部分“做计算的规则”，而不只是背诵计算结果。

但**算符预测准确，并不代表后续物性计算就自动完成了**。矩阵仍然可能很大；电子性质的求解、误差传播与不在训练分布中的材料也仍是实实在在的问题。这也是为什么我们后来继续研究如何从机器学习哈密顿量高效计算物理量。

## 这篇工作的意义

对我来说，SLEM 的价值不在于给 AI 再增加一个复杂的名字，而在于它认真利用了物理问题本身的结构：局域性、轨道表示和对称性。它们既是约束，也能帮助我们减少不必要的学习和计算。

</div>

<div class="post-en" markdown="1">

Imagine two pieces of material made from the same elements. In one, the atoms sit in a tidy pattern. In the other, a few have shifted or a defect has appeared. The ingredients are unchanged, yet the electrons may behave very differently. Their behavior depends on which atoms are nearby, how far apart they are, and how they are oriented.

What should a machine-learning model predict if we want it to understand these changes? It could predict a band energy or one particular property. But that answer may be difficult to reuse in another calculation. We would rather predict the **quantum operators** from which many properties can be calculated, including Hamiltonian, overlap, and density matrices.

## Why is a local problem difficult?

An atom's immediate surroundings seem like a small problem. Yet electron orbitals have directions as well as positions. Rotating a material should not invent a new physical material; at the same time, the matrix elements that describe directional orbitals must transform correctly.

SLEM stands for Strictly Localized Equivariant Message-passing. It is designed around two requirements: **keep each prediction tied to a strictly limited local environment, and respect rotational symmetry.** Here, *equivariant* means that when the input structure rotates, the predicted quantum operators transform according to the corresponding physical rules.

These constraints can help the model learn more efficiently from limited data and reuse local information in structures of different sizes. In the paper, we studied the prediction of several DFT operators, including Hamiltonian, overlap, and density matrices, and evaluated their accuracy and computational behavior.

## Why predict operators instead of answers?

A band energy answers one question. A quantum operator contains information that can, in principle, be passed to another electronic-structure method to study spectra, electronic distributions, or response properties. We are trying to learn part of the machinery of a calculation, not merely memorize its output.

But **an accurate predicted operator does not mean the physical calculation is finished**. The matrices can still be large. Computing observables, tracking errors, and handling materials unlike the training examples remain difficult. This is one reason I continued working on algorithms that extract physical properties from learned Hamiltonians.

## What I take from this work

For me, the interesting part of SLEM is not adding another elaborate name to AI. It is taking the structure of the physics seriously: locality, orbital representations, and symmetry. These are restrictions, but they can also spare us a great deal of unnecessary learning and computation.

</div>
