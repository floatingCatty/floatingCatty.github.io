---
title: "AD-NEGF: an End-to-end Differentiable Quantum Transport Simulator for Sensitivity Analysis and Inverse Problems"
collection: publications
permalink: /publication/2022-02-10-ADNEGF-number-1
excerpt: 'We implement a quantum transport simulator based on Non-equilibrium Green\'s Function with PyTorch, and customly design the gradient computation.'
date: 2022-02-11
venue: 'arxiv'
paperurl: 'http://floatingCatty.github.io/files/2202.05098.pdf'
citation: 'Zhou, Yingzhanghao, et al. "AD-NEGF: An End-to-End Differentiable Quantum Transport Simulator for Sensitivity Analysis and Inverse Problems." arXiv preprint arXiv:2202.05098 (2022).'
---
Since proposed in the 70s, the Non-Equilibrium Green Function (NEGF) method has been recognized as a standard approach to quantum transport simulations. Although it achieves superiority in simulation accuracy, the tremendous computational cost makes it unbearable for high-throughput simulation tasks such as sensitivity analysis, inverse design, etc. In this work, we propose AD-NEGF, to our best knowledge the first end-to-end differentiable NEGF model for quantum transport simulations. We implement the entire numerical process in PyTorch, and design customized backward pass with implicit layer techniques, which provides gradient information at an affordable cost while guaranteeing the correctness of the forward simulation. The proposed model is validated with applications in calculating differential physical quantities, empirical parameter fitting, and doping optimization, which demonstrates its capacity to accelerate the material design process by conducting gradient-based parameter optimization.


[Download paper here](https://arxiv.org/pdf/2202.05098.pdf)

Recommended citation: Zhou, Yingzhanghao, et al. "AD-NEGF: An End-to-End Differentiable Quantum Transport Simulator for Sensitivity Analysis and Inverse Problems." arXiv preprint arXiv:2202.05098 (2022).
