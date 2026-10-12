---
layout: research
permalink: /research/vbcsr/
title: "VBCSR：给大规模稀疏矩阵写的一套工具"
title_en: "VBCSR: distributed sparse matrices for scientific computing"
description: "VBCSR is a distributed variable-block sparse matrix library for electronic-structure and scientific computing workloads, with MPI and thresholded matrix products."
description_zh: "VBCSR 是一套支持 MPI 的变块稀疏矩阵工具，面向电子结构计算和其他科学计算任务。"
project_kind: "software"
code_url: "https://github.com/DeepElectron/vbcsr"
paper_url: "https://arxiv.org/abs/2609.04397"
paper_year: 2026
research_locale: en
translation_url: "/zh/research/vbcsr/"
alternate_en_url: "/research/vbcsr/"
alternate_zh_url: "/zh/research/vbcsr/"
---

<div class="post-en" lang="en" markdown="1">

In electronic-structure calculations, I often have to work with very large matrices. Atomic orbitals mainly couple to nearby orbitals, so many matrix entries are zero. Storing and multiplying all those zeros would be wasteful. Sparse matrix formats avoid that, but distributing the calculation across many machines introduces other problems.

VBCSR is a library for that kind of work. An atom or a group of local degrees of freedom often corresponds to a small matrix block, and different blocks may have different sizes. We store these as variable-sized blocks, distribute the matrix across MPI processes, and optimize the operations inside each block. The core is written in C++, with a Python interface for experimenting with algorithms.

One operation I care about is sparse matrix multiplication. Density-matrix calculations, for example, may require multiplying sparse matrices repeatedly. If every multiplication creates many tiny nonzero entries, the matrix gradually becomes dense and both memory use and runtime increase. VBCSR can discard small product entries according to a threshold, keeping later operations sparse. The repository includes examples involving density-matrix purification, density of states, and quantum dynamics.

Thresholding is an approximation, of course. How much we can safely discard depends on the system and the error we can tolerate. MPI communication costs also depend on how the matrix is distributed. These details may sound mundane, but they often decide whether a large calculation can run at all.

### How to check the performance yourself

The repository has a [benchmark report generator](https://github.com/DeepElectron/vbcsr/blob/main/generate_benchmark_report.py) backed by [`tests/benchmark_large_scale.py`](https://github.com/DeepElectron/vbcsr/blob/main/tests/benchmark_large_scale.py). These deliberately small **serial** settings are a starting point for checking the installation and timing workflow. They are not the production benchmark used in the paper.

```bash
git clone https://github.com/DeepElectron/vbcsr.git
cd vbcsr
# Install a working C++ / MPI / BLAS environment first (see the project README).
python -m pip install -e .
python -m pip install scipy matplotlib
python generate_benchmark_report.py \
  --output-dir bench-local --family random \
  --min-block 4 --max-block 8 --target-neighbors 8 \
  --spmv-blocks 80,160 --dense-blocks 100 --k-values 4,8 \
  --sparse-blocks 20,40 --min-seconds 0.5 --min-iterations 3
```

After running, inspect `bench-local/benchmark_report.md` and `bench-local/benchmark_report_data.json`. They report timings for sparse matrix-vector products, sparse matrix-dense matrix products and SpMM, along with SciPy comparison results. For a meaningful performance claim, record the CPU, BLAS backend, thread count, block sizes, sparsity structure and repetitions, then increase the test size and duration.

Keep two questions separate: **does the operation agree with the reference?** and **is it faster on this hardware?** If the reported relative difference is unacceptable, a speedup alone is not a useful result. Threshold-filtering errors need their own validation. This is a reproducible starting point, not a claim that I reran or revalidated the benchmark numbers while editing this page.

</div>
