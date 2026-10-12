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
research_locale: en
translation_url: "/zh/research/deeptb-negf/"
alternate_en_url: "/research/deeptb-negf/"
alternate_zh_url: "/zh/research/deeptb-negf/"
---

<div class="post-en" lang="en" markdown="1">

A quantum transport calculation usually begins with a Hamiltonian. Constructing it directly from DFT can be reliable, but it becomes expensive when the system is large or when we want to compare many different structures. DeePTB can predict a tight-binding Hamiltonian from an atomic structure, which raises a natural question: can we use that Hamiltonian directly in a quantum transport solver?

This collaborative work tests that idea. We connect a DeePTB-predicted Hamiltonian to DPNEGF and study three two-dimensional materials: graphene, hexagonal boron nitride and MoS₂. The preprint compares the resulting band structures and electronic transmission spectra with conventional DFT-NEGF calculations. It reports good agreement and lower computational cost for the tested systems.

There are really two separate things to validate. First, the learned Hamiltonian has to be accurate. Second, the transport solver has to treat contacts, device geometry and boundary conditions correctly. Similar-looking band structures do not automatically guarantee accurate transmission. That is why testing the entire route from the learned model to a transport observable matters more than reporting a Hamiltonian error alone.

The work is currently available as a preprint. It provides evidence for this approach on several representative materials, not a guarantee of the same accuracy for arbitrary defects, interfaces or devices.

</div>
