---
layout: research
permalink: /research/slem/
title: "SLEM：从原子结构预测量子算符"
title_en: "SLEM: predicting quantum operators from atomic structures"
description: "SLEM uses local, rotation-equivariant representations to predict quantum-operator matrices from atomic structures."
description_zh: "SLEM 利用局域性和旋转等变性，从原子结构预测哈密顿量、重叠矩阵等量子算符。"
paper_year: 2025
paper_url: "https://arxiv.org/abs/2407.06053"
research_locale: en
translation_url: "/zh/research/slem/"
alternate_en_url: "/research/slem/"
alternate_zh_url: "/zh/research/slem/"
---

<div class="post-en" lang="en" markdown="1">

A band diagram is only part of what comes out of an electronic-structure calculation. The Hamiltonian matrix records orbital energies and couplings, the overlap matrix describes how the orbitals overlap, and the density matrix relates to where electrons are distributed. These are the quantities we often need for later property calculations.

In DeePTB, we mainly learned the parameters of a tight-binding model. With SLEM, we wanted to go further and predict these DFT matrices directly from atomic structures using a more general atomic-orbital basis.

There is a tricky part: atomic orbitals have directions. The p and d orbitals, for example, are not just numbers attached to atoms. If we rotate a crystal, the matrices describing orbital couplings must transform accordingly. Yet changing the coordinate frame alone should not change the material's energy spectrum. We therefore built rotational equivariance into the network itself.

We also restricted the network to a fixed neighborhood around each atom. In an ordinary graph neural network, adding message-passing layers brings information from progressively more distant atoms. SLEM keeps the dependence strictly local, making predictions on large structures easier to parallelize. We also used SO(2) convolutions to reduce the cost of handling higher-angular-momentum orbitals.

In the paper, we tested the accuracy and data efficiency of these operator predictions on several two- and three-dimensional materials. Locality and symmetry helped, although a strictly local approximation has its limits and needs care when long-range effects matter. And predicting a Hamiltonian does not mean we have already calculated conductivity or optical response. Working with the resulting large matrices became part of my later research.

</div>
