---
title: "Neural-Quantum-States Impurity Solver for Quantum Embedding Problems"
collection: publications
permalink: /publication/2025-09-15-NQS-impurity-solver
excerpt: 'A graph-transformer neural-quantum-states impurity solver for the ghost Gutzwiller quantum embedding framework, benchmarked against exact diagonalization on the Anderson Lattice Model.'
date: 2025-09-15
venue: 'Physical Review B (2026), arXiv:2509.12431'
paperurl: 'https://arxiv.org/abs/2509.12431'
citation: 'Zhou, Yinzhanghao, Tsung-Han Lee, Ao Chen, Nicola Lanatà, and Hong Guo. "Neural-Quantum-States Impurity Solver for Quantum Embedding Problems." Physical Review B (2026). arXiv:2509.12431.'
---
We design and benchmark a neural-quantum-states (NQS) impurity solver for quantum embedding methods, focusing on the ghost Gutzwiller Approximation (gGA) framework. We introduce a graph-transformer-based NQS architecture capable of representing arbitrarily connected impurity orbitals, and develop an error-control mechanism to stabilize the iterative updates throughout the quantum embedding loops. The approach is validated with benchmark gGA calculations of the Anderson Lattice Model, yielding results in excellent agreement with exact-diagonalization impurity solvers. Analyzing the computational budget, we identify the principal bottleneck to be the high-accuracy sampling of physical observables required by the embedding loop, rather than the NQS variational optimization itself.


[Download paper here](https://arxiv.org/abs/2509.12431)

Recommended citation: Zhou, Yinzhanghao, et al. "Neural-Quantum-States Impurity Solver for Quantum Embedding Problems." Physical Review B (2026). arXiv:2509.12431.
