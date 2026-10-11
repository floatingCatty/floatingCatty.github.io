---
layout: research
permalink: /research/ad-negf/
title: "算出了电流，下一步怎么改器件？"
title_en: "We've calculated the current. What should we change in the device?"
description: "AD-NEGF adds differentiable gradients to tight-binding quantum transport calculations for sensitivity analysis and Hamiltonian inverse design."
description_zh: "AD-NEGF 如何为紧束缚量子输运计算增加梯度，用于灵敏度分析和哈密顿量逆向设计。"
paper_year: 2023
paper_url: "https://doi.org/10.1103/PhysRevB.108.195143"
code_url: "https://github.com/floatingCatty/ADNEGF"
---

<div class="post-zh" lang="zh-Hans" markdown="1">

做量子器件模拟时，我们通常先给出结构和电压，让程序算出有多少电流通过。算出来的电流可能太小，也可能漏电太大。接下来的问题就更具体了：如果把模型里的一个势垒稍微调高一点，电流会变多少？

参数不多时，可以修改一个、重跑一次模拟，再比较结果。但材料参数、轨道耦合和器件条件可能有许多可调量。每次都从头算，既慢，也不容易看清哪个参数影响最大。我们做 AD-NEGF，就是想从模拟器里直接取得这类灵敏度信息。

纳米尺度的电子器件里，电子会体现出波动性，也会受到电极和外加偏压的影响。非平衡格林函数（NEGF）方法就是研究这类开放量子体系的常用工具。给它一个描述电子运动的哈密顿量，再指定电极和偏压等条件，就可以计算电子透射和电流。

我们的论文使用紧束缚模型下的 NEGF。这一点很重要：论文中的可微模拟器有清楚的物理模型，并不是把电流交给一个神经网络直接猜。我们在原有求解流程上增加求导能力，让输出的电流、透射等量可以对模型参数求梯度。

计算里还有一个不那么显眼的难处。NEGF 求解包含矩阵运算和需要通过方程确定的中间量，直接把整个计算当成普通算术一路反传，并不总是合适。因此论文把自动微分与隐式层（implicit layer）的求导方法结合起来。

## 梯度能把问题推进到哪里

拿到梯度以后，我们就能估计在当前参数附近，哪个变量的微小变化会显著影响某个输运量。它既能用于灵敏度分析，也能帮助计算依赖电流或透射导数的物性。论文还演示了一个逆向问题：给定希望得到的输运性质，在紧束缚描述中反过来寻找可能实现它的哈密顿量。

这里的逆向设计有明确的范围。论文并没有证明真实芯片的任意工艺参数都可以直接这样优化。哈密顿量里的一个参数，也未必总能一一对应到可制造的结构。模型如果忽略了重要的散射、缺陷或接触效应，导数再准确也无法补上缺失的物理。

梯度描述的还是当前参数附近的变化趋势，不会自动保证找到全局最优解。不过，对那些需要反复运行的输运计算，能同时得到结果和它对参数的敏感程度，已经让我们可以少做许多盲目的试算。

</div>

<div class="post-en" lang="en" markdown="1">

A quantum-device simulation usually begins with a structure and an applied voltage. The program calculates how much current flows through the device. Perhaps the current is too small, or perhaps the leakage is too large. The next question is more specific: if we raise one of the barriers in the model a little, how much will the current change?

With only a few parameters, we can change one, rerun the simulation, and compare the results. But a device model can have many adjustable material parameters, orbital couplings, and boundary conditions. Repeating the calculation for every change is slow, and it does not readily show which parameter matters most. With AD-NEGF, we wanted the simulator itself to provide that sensitivity information.

At nanometer scales, electrons show wave behavior and are affected by electrodes and applied bias. The non-equilibrium Green's function (NEGF) method is a standard way to study such open quantum systems. Given a Hamiltonian that describes the electronic motion, along with the electrodes and bias conditions, it can calculate electron transmission and current.

Our paper uses NEGF with a tight-binding model. This matters: the differentiable simulator in the paper has an explicit physical model. It does not ask a neural network to guess the current. We added a way to compute derivatives through the solver, so quantities such as current and transmission can provide gradients with respect to model parameters.

There is a less visible numerical difficulty. NEGF involves matrix operations and intermediate quantities defined by equations. Treating the whole calculation as a long chain of ordinary arithmetic operations is not always the best way to differentiate it. We therefore combined automatic differentiation with the implicit-layer approach.

## What the gradients let us ask

Once we have a gradient, we can estimate which small parameter changes near the current design have a strong effect on a transport quantity. That helps with sensitivity analysis and with properties that depend on derivatives of current or transmission. The paper also demonstrates an inverse problem: given a desired transport property, find a possible tight-binding Hamiltonian that produces it.

The scope of that inverse design is specific. The paper does not establish that arbitrary fabrication parameters of a real chip can be optimized this way. A parameter in a Hamiltonian does not always correspond directly to something we can manufacture. And if the model leaves out important scattering, defects, or contact effects, accurate derivatives cannot replace the missing physics.

A gradient also describes behavior near the current parameter values; it does not promise a global optimum. Still, when a transport calculation must be repeated many times, obtaining the result and its sensitivity together can save a good deal of trial and error.

</div>
