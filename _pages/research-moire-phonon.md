---
layout: research
permalink: /research/moire-phonon/
title: "魔角石墨烯里的声子凝聚"
title_en: "Moiré phonon condensation in twisted bilayer graphene"
description: "A note on moiré phonon condensation, soft modes, and structural reconstruction in magic-angle twisted bilayer graphene."
description_zh: "关于魔角双层石墨烯结构重构、软声子模式和莫尔声子凝聚的一些计算与想法。"
paper_year: 2026
paper_url: "https://arxiv.org/abs/2607.06711"
paper_title: "Moiré Phonon Condensation in Magic-Angle Twisted Bilayer Graphene"
paper_doi: "10.48550/arXiv.2607.06711"
paper_authors:
  - "Zhanghao Zhouyin"
  - "Jyun-jie Jiang"
  - "Xianghua Kong"
  - "Hong Guo"
---

<div class="post-zh" lang="zh-Hans" markdown="1">

把两层石墨烯叠在一起，稍稍转过一个角度，便会出现比原本晶格大得多的莫尔图案。角度越小，莫尔周期越长，原子也会跟着重新排列。我最近做的一项工作，就是想弄清楚魔角附近这种结构变化究竟是怎么发生的。

我们最开始看到的是两种不同的形变。离魔角稍远一些，两层石墨烯主要表现为层间距离的起伏；接近魔角后，却逐渐变成两层一起弯曲。用一个包含上万个原子的超胞直接看位移，图很复杂，也不容易知道到底是哪些自由度在起作用。后来我们把位移投影到声子模式上，发现事情简单了许多。在 1.08° 的体系里，11,164 个原子的重构位移，超过 99.5% 的谱权重可以由两个 A1 对称性的声子模式描述。

沿着这两个模式继续分析，会看到其中的层对称弯曲模式随着转角减小逐渐软化，也就是结构沿这个方向变形所需要的恢复力越来越弱。到了魔角附近，原来稳定的形态便倾向于沿这个模式发生静态形变。我们把它叫作莫尔声子凝聚（moiré phonon condensation）。这里的“凝聚”指软声子模式形成静态位移，不是说材料里发生了玻色-爱因斯坦凝聚。

我们还建立了一个比较简单的连续介质模型，把这种变化和莫尔周期增长后应力与弯曲能之间的竞争联系起来。紧束缚计算也显示，这些形变模式会影响电子结构。现在论文还是预印本，关于实验中怎样直接观察这些模式，还需要进一步研究。

</div>

<div class="post-en" lang="en" markdown="1">

Put two sheets of graphene on top of each other and rotate one slightly. A moiré pattern appears, much larger than the original atomic lattice. As the twist angle gets smaller, the moiré period grows and the atoms rearrange. In a recent project, I wanted to understand what causes this reconstruction near the magic angle.

We first noticed two different kinds of distortion. Further from the magic angle, the main effect is a variation in the distance between the layers. Closer to the magic angle, the two layers start bending together. A displacement plot for a supercell with more than ten thousand atoms is complicated and tells us little about which collective motions matter. We projected the displacements onto phonon modes and found a much simpler picture. At 1.08°, more than 99.5% of the spectral weight of the reconstruction involving 11,164 atoms comes from just two phonon modes with A1 symmetry.

Following those modes, we found that a layer-symmetric bending mode softens as the twist angle decreases. In other words, the restoring force against that collective distortion becomes weaker. Near the magic angle, the structure tends to acquire a static displacement along the mode. We call this moiré phonon condensation. 'Condensation' here means that a soft phonon mode develops a static distortion. It is not Bose-Einstein condensation.

We also built a simple continuum model relating this change to the competition between stress and bending energy as the moiré period grows. Tight-binding calculations suggest that these distortions also affect the electronic structure. The paper is still a preprint, and finding a direct experimental signature of the modes remains an open question.

</div>
