---
layout: research
permalink: /research/nqs-impurity/
title: "用神经网络求解量子嵌入里的杂质问题"
title_en: "Neural quantum states for quantum embedding"
description: "A research note on a neural-quantum-state impurity solver in ghost Gutzwiller quantum embedding and its sampling bottleneck."
description_zh: "用神经量子态求解 ghost Gutzwiller 量子嵌入中的杂质模型，以及高精度采样带来的计算开销。"
paper_year: 2026
paper_url: "https://doi.org/10.1103/rkd8-q6yl"
paper_title: "Neural-quantum-states impurity solver for quantum embedding problems"
paper_doi: "10.1103/rkd8-q6yl"
paper_authors:
  - "Zhanghao Zhouyin"
  - "Tsung-Han Lee"
  - "Ao Chen"
  - "Nicola Lanatà"
  - "Hong Guo"
research_locale: en
translation_url: "/zh/research/nqs-impurity/"
alternate_en_url: "/research/nqs-impurity/"
alternate_zh_url: "/zh/research/nqs-impurity/"
---

<div class="post-en" lang="en" markdown="1">

When electrons interact strongly, calculating the electronic state of a material becomes difficult. We could try solving for many electrons at once, but the number of possible quantum states grows rapidly with system size. Quantum embedding takes a different approach. It treats a smaller, difficult part as an impurity problem and repeatedly exchanges information between that problem and an effective environment.

In this paper, we worked on an impurity solver for the ghost Gutzwiller approximation (gGA). Exact diagonalization is a useful reference, but its cost becomes large as the number of impurity degrees of freedom grows. We tried representing the many-electron wavefunction with a neural quantum state (NQS). Our model uses a graph Transformer, so it can handle impurity orbitals with different patterns of connectivity.

The difficult part appears inside the embedding iterations. Results from the impurity solver are fed back into an outer self-consistency loop. Small sampling errors in charge or other observables can accumulate between iterations. We therefore added error control. On the Anderson lattice model, the results agreed well with calculations using an exact-diagonalization impurity solver.

At first, I also expected training the neural network to take most of the time. Looking at the computational cost showed something different: for this problem, accurately sampling the observables is harder than optimizing the network. A neural quantum state may represent a complicated wavefunction, but that does not make the full self-consistent calculation cheap. Reducing the cost of high-accuracy sampling is still an open problem.

</div>
