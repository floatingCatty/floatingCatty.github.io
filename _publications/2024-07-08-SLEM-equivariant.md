---
title: "Learning local equivariant representations for quantum operators"
collection: publications
permalink: /publication/2024-07-08-SLEM-equivariant
excerpt: 'SLEM: a strictly-localized equivariant neural network that predicts DFT quantum operators (Hamiltonian, overlap and density matrices) with high accuracy, strong data efficiency, and device-scale parallelism.'
date: 2024-07-08
venue: 'ICLR 2025 (arXiv:2407.06053)'
paperurl: 'https://proceedings.iclr.cc/paper_files/paper/2025/hash/7db2ffcbfd0bd361d47b7fa612bd2ba2-Abstract-Conference.html'
preprint_url: 'https://arxiv.org/abs/2407.06053'
citation_date: '2025'
citation: 'YinZhangHao Zhou, Zixi Gan, Shishir Pandey, Linfeng Zhang, and Qiangqiang Gu. "Learning local equivariant representations for quantum operators." ICLR (2025).'
paper_authors:
  - 'YinZhangHao Zhou'
  - 'Zixi Gan'
  - 'Shishir Pandey'
  - 'Linfeng Zhang'
  - 'Qiangqiang Gu'
preprint_authors:
  - 'Zhanghao Zhouyin'
  - 'Zixi Gan'
  - 'MingKang Liu'
  - 'Shishir Kumar Pandey'
  - 'Linfeng Zhang'
  - 'Qiangqiang Gu'
conference: 'ICLR 2025'
research_url: '/research/slem/'
---
We introduce SLEM (Strictly Localized Equivariant Message-passing), a deep learning framework for predicting quantum operator matrices — Hamiltonian, overlap, and density matrices — in density functional theory. SLEM's key innovation is a strict locality-based design for equivariant representations of quantum tensors while preserving physical symmetries. This allows it to capture complex many-body dependencies without expanding the effective receptive field, yielding superior data efficiency and transferability. Through an SO(2) convolution technique and an invariant overlap parameterization, SLEM reduces the computational complexity of high-order tensor operations, enabling the treatment of $f$ and $g$ orbitals. We demonstrate strong performance across diverse 2D and 3D materials with limited training data, and the architecture supports efficient parallelization toward device-level system sizes.


[Read the ICLR proceedings version](https://proceedings.iclr.cc/paper_files/paper/2025/hash/7db2ffcbfd0bd361d47b7fa612bd2ba2-Abstract-Conference.html). [Read the arXiv preprint](https://arxiv.org/abs/2407.06053).

The ICLR proceedings and the arXiv preprint list different author sets. The ICLR record lists five authors, while the arXiv version also lists MingKang Liu. The citation metadata on this page follows the ICLR proceedings.

Recommended citation: YinZhangHao Zhou, Zixi Gan, Shishir Pandey, Linfeng Zhang, and Qiangqiang Gu. "Learning local equivariant representations for quantum operators." ICLR 2025.
