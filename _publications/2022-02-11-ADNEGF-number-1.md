---
title: "Automatic differentiable nonequilibrium Green's function formalism: An end-to-end differentiable quantum transport simulator"
collection: publications
permalink: /publication/2022-02-10-ADNEGF-number-1
excerpt: "An end-to-end differentiable Non-equilibrium Green's Function quantum transport simulator implemented in PyTorch, providing gradients for sensitivity analysis and inverse design."
date: 2023-11-27
venue: 'Physical Review B 108, 195143 (2023)'
paperurl: 'https://doi.org/10.1103/PhysRevB.108.195143'
citation: 'Zhanghao Zhouyin, Xiang Chen, Peng Zhang, Jun Wang, and Lei Wang. "Automatic differentiable nonequilibrium Green''s function formalism: An end-to-end differentiable quantum transport simulator." Physical Review B 108, 195143 (2023).'
paper_authors:
  - 'Zhanghao Zhouyin'
  - 'Xiang Chen'
  - 'Peng Zhang'
  - 'Jun Wang'
  - 'Lei Wang'
journal: 'Physical Review B'
volume: 108
doi: '10.1103/PhysRevB.108.195143'
article_number: '195143'
research_url: '/research/ad-negf/'
---
Since proposed in the 70s, the Non-Equilibrium Green Function (NEGF) method has been recognized as a standard approach to quantum transport simulations. Although it achieves superiority in simulation accuracy, the tremendous computational cost makes it unbearable for high-throughput simulation tasks such as sensitivity analysis, inverse design, etc. In this work, we propose AD-NEGF, to our best knowledge the first end-to-end differentiable NEGF model for quantum transport simulations. We implement the entire numerical process in PyTorch, and design customized backward pass with implicit layer techniques, which provides gradient information at an affordable cost while guaranteeing the correctness of the forward simulation. The proposed model is validated with applications in calculating differential physical quantities, empirical parameter fitting, and doping optimization, which demonstrates its capacity to accelerate the material design process by conducting gradient-based parameter optimization.


[Download paper here](https://doi.org/10.1103/PhysRevB.108.195143)

Recommended citation: Zhanghao Zhouyin, Xiang Chen, Peng Zhang, Jun Wang, and Lei Wang. "Automatic differentiable nonequilibrium Green's function formalism: An end-to-end differentiable quantum transport simulator." Physical Review B 108, 195143 (2023).
