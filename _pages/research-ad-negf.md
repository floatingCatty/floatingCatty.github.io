---
layout: research
permalink: /research/ad-negf/
title: "AD-NEGF：可微的量子输运计算"
title_en: "AD-NEGF: differentiable quantum transport calculations"
description: "AD-NEGF computes gradients through tight-binding quantum-transport calculations for sensitivity analysis and inverse Hamiltonian design."
description_zh: "AD-NEGF 为紧束缚量子输运计算增加梯度，用于灵敏度分析和哈密顿量逆向设计。"
paper_year: 2023
paper_url: "https://doi.org/10.1103/PhysRevB.108.195143"
code_url: "https://github.com/floatingCatty/ADNEGF"
research_locale: en
translation_url: "/zh/research/ad-negf/"
alternate_en_url: "/research/ad-negf/"
alternate_zh_url: "/zh/research/ad-negf/"
---

<div class="post-en" lang="en" markdown="1">

When I was working on quantum transport at Tianjin University, I often used the non-equilibrium Green's function (NEGF) method to calculate electron transmission and current through a device. Given a Hamiltonian describing electronic energies and couplings, along with electrodes and an applied bias, the program produces a result. But if we want to know how much the current changes when a parameter is adjusted, we usually have to run the calculation again. That gets slow when there are many parameters.

We wanted to see whether we could differentiate the transport calculation itself. For example, we might want the gradient of the current with respect to an orbital coupling, an atomic position or another input variable. Those derivatives tell us what the model is sensitive to. We can also try adjusting the Hamiltonian in the other direction to reproduce a target transport property.

In AD-NEGF, we implemented the NEGF workflow with PyTorch and wrote custom backward calculations for some of the solver steps. NEGF includes matrix inversions and intermediate quantities that must be obtained numerically, so ordinary automatic differentiation is not always the best approach. We also used implicit differentiation. We checked the gradients and demonstrated an example of optimizing a Hamiltonian for a target transport property.

That design exercise is still mostly at the level of the model. Connecting a Hamiltonian parameter to a device structure we can actually fabricate, and dealing with scattering, defects and contacts, requires additional modeling. Differentiating the solver makes many calculations easier than repeated trial and error, but there is still work to do before it can be used directly for device design.

</div>
