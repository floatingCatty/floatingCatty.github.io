---
layout: research
permalink: /research/deeptb/
title: "DeePTB：用机器学习做大规模电子结构计算"
title_en: "DeePTB: machine learning for large-scale electronic structure"
description: "DeePTB learns environment-dependent tight-binding parameters from first-principles calculations to study the electronic structure of large materials."
description_zh: "DeePTB 从第一性原理结果中学习随原子环境变化的紧束缚参数，用于大规模材料的电子结构计算。"
paper_year: 2024
paper_url: "https://www.nature.com/articles/s41467-024-51006-4"
code_url: "https://github.com/deepmodeling/DeePTB"
research_locale: en
translation_url: "/zh/research/deeptb/"
alternate_en_url: "/research/deeptb/"
alternate_zh_url: "/zh/research/deeptb/"
---

<div class="post-en" lang="en" markdown="1">

DeePTB is a project I worked on with Qiangqiang Gu. We were dealing with a practical problem: first-principles electronic-structure calculations are expensive, and large systems quickly become difficult to handle. At finite temperature, atoms keep moving, so a simulation needs many different atomic configurations. Running a fresh DFT (density-functional theory) calculation for each one soon becomes too costly.

We tried learning the parameters of a tight-binding model. Tight binding represents the motion of electrons between atomic orbitals using a Hamiltonian matrix, which is much cheaper to work with than a full DFT calculation. Conventional tight-binding models often rely on fixed parameters, and those parameters can become inaccurate when the atomic environment changes. DeePTB predicts them from the arrangement of nearby atoms and trains against electronic energy levels calculated from first principles.

In the paper, we tried this on a rather large example. We expanded molecular-dynamics configurations of gallium phosphide (GaP) to a million atoms, then used the learned Hamiltonian with the tight-binding propagation method to calculate temperature-dependent properties, including the density of states and optical conductivity. The million atoms refer to the size of the tight-binding calculation. We did not perform a self-consistent DFT calculation on a million atoms.

Of course, a trained model does not work reliably everywhere. If the bonding or local atomic environments differ substantially from the training data, the predictions need checking, and more DFT data may be needed. This also led into some of my later work on large-scale property calculations. Even when we can predict a Hamiltonian quickly, calculating the electrical, optical and transport properties we care about is still difficult.

</div>
