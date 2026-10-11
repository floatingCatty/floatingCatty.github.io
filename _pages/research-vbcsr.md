---
layout: research
permalink: /research/vbcsr/
title: "VBCSR：给大规模稀疏矩阵写的一套工具"
title_en: "VBCSR: distributed sparse matrices for scientific computing"
description: "VBCSR is a distributed variable-block sparse matrix library for electronic-structure and scientific computing workloads, with MPI and thresholded matrix products."
description_zh: "VBCSR 是一套支持 MPI 的变块稀疏矩阵工具，面向电子结构计算和其他科学计算任务。"
project_kind: "software"
code_url: "https://github.com/DeepElectron/vbcsr"
---

<div class="post-zh" lang="zh-Hans" markdown="1">

做电子结构计算时，我经常要处理很大的矩阵。原子轨道只和附近的轨道有明显的耦合，所以矩阵里很多元素都是零。把这些零也存下来、算一遍，实在是浪费。稀疏矩阵格式能避免这件事，可当矩阵分布在很多台机器上，事情又会复杂不少。

VBCSR 是为这类计算写的一套工具。一个原子或者一个局部自由度组，往往对应一小块矩阵，不同的块大小还可能不一样。我们用可变大小的块来存储这些数据，通过 MPI 把矩阵分到不同进程，再对块内运算做优化。底层是 C++，也提供 Python 接口，日常试算法会方便一些。

其中一个我比较看重的操作是稀疏矩阵乘法。比如计算密度矩阵时，可能要反复对稀疏矩阵做乘法；如果每次相乘都产生大量很小的非零元素，矩阵很快就会变密，内存和计算量一起涨。VBCSR 支持按阈值过滤乘积中的小元素，让后续运算继续保持稀疏。仓库里放了密度矩阵纯化、态密度和量子动力学等例子。

阈值过滤并不是免费的近似。扔掉多小的元素合适，要看具体体系和希望控制的误差；MPI 通信开销也会随矩阵分布方式而改变。这些细节很琐碎，但大规模计算很多时候就是被它们卡住的。

</div>

<div class="post-en" lang="en" markdown="1">

In electronic-structure calculations, I often have to work with very large matrices. Atomic orbitals mainly couple to nearby orbitals, so many matrix entries are zero. Storing and multiplying all those zeros would be wasteful. Sparse matrix formats avoid that, but distributing the calculation across many machines introduces other problems.

VBCSR is a library for that kind of work. An atom or a group of local degrees of freedom often corresponds to a small matrix block, and different blocks may have different sizes. We store these as variable-sized blocks, distribute the matrix across MPI processes, and optimize the operations inside each block. The core is written in C++, with a Python interface for experimenting with algorithms.

One operation I care about is sparse matrix multiplication. Density-matrix calculations, for example, may require multiplying sparse matrices repeatedly. If every multiplication creates many tiny nonzero entries, the matrix gradually becomes dense and both memory use and runtime increase. VBCSR can discard small product entries according to a threshold, keeping later operations sparse. The repository includes examples involving density-matrix purification, density of states, and quantum dynamics.

Thresholding is an approximation, of course. How much we can safely discard depends on the system and the error we can tolerate. MPI communication costs also depend on how the matrix is distributed. These details may sound mundane, but they often decide whether a large calculation can run at all.

</div>
