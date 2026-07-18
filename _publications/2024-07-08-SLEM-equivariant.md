---
title: "Learning local equivariant representations for quantum operators"
collection: publications
permalink: /publication/2024-07-08-SLEM-equivariant
excerpt: 'SLEM: a strictly-localized equivariant neural network that predicts DFT quantum operators (Hamiltonian, overlap and density matrices) with high accuracy, strong data efficiency, and device-scale parallelism.'
date: 2024-07-08
venue: 'ICLR 2025 (arXiv:2407.06053)'
paperurl: 'https://arxiv.org/abs/2407.06053'
citation: 'Zhouyin, Zhanghao, Zixi Gan, MingKang Liu, Shishir Kumar Pandey, Linfeng Zhang, and Qiangqiang Gu. "Learning local equivariant representations for quantum operators." International Conference on Learning Representations (ICLR), 2025. arXiv:2407.06053.'
---
We introduce SLEM (Strictly Localized Equivariant Message-passing), a deep learning framework for predicting quantum operator matrices — Hamiltonian, overlap, and density matrices — in density functional theory. SLEM's key innovation is a strict locality-based design for equivariant representations of quantum tensors while preserving physical symmetries. This allows it to capture complex many-body dependencies without expanding the effective receptive field, yielding superior data efficiency and transferability. Through an SO(2) convolution technique and an invariant overlap parameterization, SLEM reduces the computational complexity of high-order tensor operations, enabling the treatment of $f$ and $g$ orbitals. We demonstrate strong performance across diverse 2D and 3D materials with limited training data, and the architecture supports efficient parallelization toward device-level system sizes.


[Download paper here](https://arxiv.org/abs/2407.06053)

Recommended citation: Zhouyin, Zhanghao, et al. "Learning local equivariant representations for quantum operators." International Conference on Learning Representations (ICLR), 2025. arXiv:2407.06053.
