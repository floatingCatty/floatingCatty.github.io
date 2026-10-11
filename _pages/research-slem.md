---
layout: research
permalink: /research/slem/
title: "原子轨道有方向，AI 怎么学电子结构？"
title_en: "Atomic orbitals have directions. How can AI learn electronic structure?"
description: "SLEM predicts local quantum-operator matrices while respecting rotational symmetry, with tests on two- and three-dimensional materials."
description_zh: "SLEM 如何利用局域性和旋转对称性预测量子算符矩阵，并在二维、三维材料上检验精度。"
paper_year: 2025
paper_url: "https://arxiv.org/abs/2407.06053"
---

<div class="post-zh" lang="zh-Hans" markdown="1">

把一块晶体转个方向，它仍然是同一种材料。可是在计算机里，电子结构并不总是用几个与方向无关的数字来表示。原子轨道有形状和朝向，晶体旋转后，描述它们的矩阵元素也得按一定规律改变。材料的能谱却不该仅仅因为我们换了坐标方向就变掉。

人很容易接受这一点。神经网络若直接从原子坐标学习矩阵元素，就未必能自动遵守这些关系。我们当然可以让它看大量不同朝向的训练样本，但更合适的做法，是把旋转对称性的要求放进模型本身。SLEM 的工作就是从这里展开的。

## 为什么去预测一张矩阵

从密度泛函理论（DFT）得到的电子信息不只是一串能级。哈密顿矩阵描述能量和轨道耦合；重叠矩阵记录不同原子轨道之间并不总是正交；密度矩阵与电子怎样分布有关。这些矩阵可以交给后续的数值程序，继续算别的物性。

## 让网络只看附近的原子

在 SLEM 中，我们让同一类模型学习这些量子算符的矩阵元素。一个关键选择是严格局域：预测某处的矩阵元素时，网络只读取有限范围内的原子环境。普通的多层消息传递网络会随着层数增加，把信息从越来越远的邻居传过来；SLEM 则把有效感受范围控制在局部。

这样一来，计算更容易按不同原子区域并行展开。论文里我们在二维和三维材料上测试了多种量子算符的预测，也研究了训练数据较少时的表现。不过局域性是一种模型假设；如果所研究的物理过程依赖重要的长程效应，还需要仔细检验。

## 把旋转规律写进网络

另一个选择是等变性（equivariance）。简单说，输入晶体旋转后，网络预测的矩阵也按相应的轨道变换规则旋转。这样我们就不必指望网络仅靠数据去猜出所有角度之间的关系。

实现起来没有这句话那么简单。高角动量的轨道，例如 f、g 轨道，会带来更复杂的角度耦合。SLEM 使用 SO(2) 卷积等设计来降低相关计算的开销。它们听上去有点专门，但目的很朴素：在保留物理对称性的同时，不让高阶轨道的计算变得太贵。

最后还剩下一个实际问题。预测出了大体系的哈密顿矩阵，并不等于已经算出了它的电导率或光学响应；后面还要处理大矩阵和求解误差。SLEM 让我们更容易得到这些算符，至于怎样从中高效提取物性，是另一段计算工作。

</div>

<div class="post-en" lang="en" markdown="1">

Turn a crystal around and it is still the same material. In a computer, though, electronic structure is not always represented by numbers that ignore direction. Atomic orbitals have shapes and orientations. When the crystal rotates, the matrix elements describing those orbitals must transform in a particular way, even though the energy spectrum should not change merely because we chose a different coordinate frame.

That sounds obvious to us. A neural network trained directly on atomic coordinates and matrix entries does not necessarily obey those relations. We could show it many rotated versions of the same structures, but it makes more sense to build the symmetry into the model. That was one of the starting points for SLEM.

## Why predict a matrix?

Electronic-structure calculations based on density-functional theory (DFT) contain more information than a list of energy levels. The Hamiltonian matrix describes orbital energies and couplings. The overlap matrix accounts for atomic orbitals that are not necessarily orthogonal. The density matrix relates to how the electrons are distributed. These matrices can be handed to numerical programs that calculate other properties.

## Limiting the model to nearby atoms

In SLEM, we train the same type of model to predict elements of these quantum operators. An important design choice is strict locality: to predict a matrix element, the network looks only at atoms within a bounded neighborhood. In an ordinary deep message-passing network, information can travel from more distant neighbors as layers are added. SLEM keeps the effective receptive field local.

This makes the work easier to distribute across different atomic regions. In the paper, we tested the prediction of several quantum operators on two- and three-dimensional materials, including cases with limited training data. Locality is still a modeling assumption. If an important part of the physics depends on long-range effects, that assumption needs checking.

## Putting rotation rules into the network

The other choice is equivariance. In plain language, when the input crystal rotates, the predicted matrices rotate according to the corresponding transformation rules for their orbitals. The network does not have to discover every relation between orientations from examples alone.

Making this work is less simple than the definition sounds. Orbitals with higher angular momentum, such as f and g orbitals, introduce more complicated angular couplings. SLEM uses techniques including SO(2) convolution to reduce the associated computational cost. The purpose is practical: respect the symmetry without making high-order orbitals prohibitively expensive.

There is one more step after the prediction. Having a Hamiltonian matrix for a large system does not mean we already know its conductivity or optical response. Large matrices still have to be processed, and numerical errors still matter. SLEM helps us obtain the operators; extracting useful properties from them is a separate computation.

</div>
