---
title: "Accelerating Atom Simulations with Variable-Block Sparse Matrix Library"
collection: publications
permalink: /publication/2026-09-03-VBCSR-preprint
excerpt: "A distributed variable-block sparse matrix library for atomistic simulations, evaluated on block-sparse benchmarks and a million-atom-scale InP nanoparticle."
date: 2026-09-03
venue: 'arXiv:2609.04397 (2026 preprint)'
paperurl: 'https://arxiv.org/abs/2609.04397'
doi: '10.48550/arXiv.2609.04397'
paper_authors:
  - 'Zhanghao Zhouyin'
  - 'Hong Guo'
citation: 'Zhanghao Zhouyin and Hong Guo. "Accelerating Atom Simulations with Variable-Block Sparse Matrix Library." arXiv:2609.04397 (2026).'
research_url: '/research/vbcsr/'
---
VBCSR stores sparse matrices as variable-sized dense blocks, matching the different local orbital basis sizes found in atomistic simulations. The library distributes matrices across MPI processes and groups similarly shaped blocks so their operations can use efficient dense kernels. The preprint compares this approach against Python-accessible sparse-matrix implementations on several benchmarks and demonstrates an application to an InP nanoparticle with more than one million atoms. The reported speedups are benchmark-specific; they are not a universal guarantee for every matrix or machine.

[Read the preprint](https://arxiv.org/abs/2609.04397). [Explore the code](https://github.com/DeepElectron/vbcsr).
