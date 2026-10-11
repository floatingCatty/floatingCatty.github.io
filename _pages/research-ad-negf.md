---
layout: research
permalink: /research/ad-negf/
title: "如果能对量子器件求导：AD-NEGF"
title_en: "What if a quantum-device simulator could tell us how to improve a design?"
description: "AD-NEGF explained: differentiable non-equilibrium Green's function simulations, quantum transport, gradients, and what they do not solve."
paper_year: 2023
paper_url: "https://doi.org/10.1103/PhysRevB.108.195143"
code_url: "https://github.com/floatingCatty/ADNEGF"
---

<div class="post-zh" markdown="1">

设计一个电子器件时，我们通常会问：给定材料、结构和电压，它能通过多少电流？传统模拟器善于回答这类正向问题。可是工程师接下来的问题往往是反过来的：如果希望电流更大、漏电更小，究竟应该改哪里？

一种朴素的做法，是逐一改变参数，把模拟再跑一遍。但器件的自由度很多：尺寸、势垒、掺杂、接触条件……如果每个参数都要逐个试，搜索很快就会变得昂贵。

**AD-NEGF 的出发点是：能否让量子输运模拟不仅给出结果，还能告诉我们结果对设计参数有多敏感？**

## 从电子运动到电流

微小器件中的电子具有量子行为，简单的经典电阻模型有时不够。非平衡格林函数（NEGF）方法描述开放器件中电子的传输，能够考虑外加偏压和与电极的耦合。对于给定结构与模型参数，NEGF 可以算出输运相关的物理量。

但一次正向计算不能直接回答“哪个参数最值得改变”。这就需要导数：当某个参数略微变化时，目标量会往哪个方向变，变化多快。

## 让求导进入模拟器

AD-NEGF 把可微计算引入 NEGF 工作流，让模拟结果能够对输入设计变量提供梯度。论文将自动微分与面向求解过程的反向计算结合起来，讨论了从量子输运计算走向灵敏度分析和逆向设计的可能性。

这里的“可微”并不意味着把器件物理交给一个黑箱神经网络。**NEGF 的物理模型仍然是计算的核心；求导是为这个模型增加一种新的提问方式。** 有了梯度，可以更有针对性地搜索参数空间，而不是每次都盲目试探。

## 什么时候有用，什么时候不够

当设计变量很多、需要重复做灵敏度分析或优化时，梯度尤其有价值。但它不是万能的：局部梯度不会自动找到全局最优；如果物理模型不包含真实器件里的某个散射机制、缺陷或工艺变化，准确的梯度也无法弥补缺失的物理。数值稳定性、求解开销和模型校准仍然重要。

我喜欢这项工作的一个原因，是它把计算工具从“解释既定结构会发生什么”向“帮助我们决定下一步改什么”推进了一点。这一步很小，却会改变人使用模拟器的方式。

</div>

<div class="post-en" markdown="1">

When designing an electronic device, we often start with a forward question: given its materials, geometry, and voltage, how much current will flow? Simulators are good at answering that. But an engineer soon asks a question in the other direction: if I want more current or less leakage, what should I change?

One approach is to vary a parameter, run the simulation again, and compare the results. Yet a device may have many design choices: dimensions, barriers, doping, contacts. Trying them all separately can become expensive.

**AD-NEGF starts with a different question: could a quantum-transport simulator tell us not only what happens, but how sensitive the result is to each design choice?**

## From electron motion to current

In very small devices, electrons behave quantum mechanically, so a simple classical resistance model may not be enough. The non-equilibrium Green's function (NEGF) method describes electron transport in an open device, including its coupling to electrodes and the effects of applied bias. Given a structure and a model, NEGF produces transport quantities.

A forward calculation alone, however, does not tell us which parameter to change. For that, we want derivatives: if a design variable changes slightly, in which direction does the result move, and by how much?

## Taking derivatives through a simulator

AD-NEGF brings differentiable computation into the NEGF workflow so that simulated transport quantities can provide gradients with respect to design variables. The paper combines automatic differentiation with backward computations suited to the numerical solver, opening a route to sensitivity analysis and inverse design.

*Differentiable* does not mean replacing the device physics with an opaque neural network. **The NEGF model remains the core of the calculation; derivatives give us another way to ask questions of it.** Gradients can guide a search through design parameters rather than forcing us to try every possibility blindly.

## When is it useful, and where does it stop?

Gradients are useful when there are many design variables or when sensitivity analysis must be repeated. They are not magic. A local gradient does not guarantee a globally optimal design. And if the physical model leaves out an important scattering process, defect, or fabrication effect, an accurate derivative cannot put the missing physics back. Numerical stability, solver cost, and calibration still matter.

What I like about this work is the small shift in what a simulator can do: from explaining what a given device will do toward helping us decide what to change next. That changes how we can use simulation.

</div>
