---
layout: research
permalink: /zh/research/vbcsr/
title: "VBCSR：给大规模稀疏矩阵写的一套工具"
title_en: "VBCSR: distributed sparse matrices for scientific computing"
description: "VBCSR is a distributed variable-block sparse matrix library for electronic-structure and scientific computing workloads, with MPI and thresholded matrix products."
description_zh: "VBCSR 是一套支持 MPI 的变块稀疏矩阵工具，面向电子结构计算和其他科学计算任务。"
project_kind: "software"
code_url: "https://github.com/DeepElectron/vbcsr"
paper_url: "https://arxiv.org/abs/2609.04397"
paper_year: 2026
research_locale: zh
translation_url: "/research/vbcsr/"
translation_of: "/research/vbcsr/"
alternate_en_url: "/research/vbcsr/"
alternate_zh_url: "/zh/research/vbcsr/"
---

<div class="post-zh" lang="zh-Hans" markdown="1">

做电子结构计算时，我经常要处理很大的矩阵。原子轨道只和附近的轨道有明显的耦合，所以矩阵里很多元素都是零。把这些零也存下来、算一遍，实在是浪费。稀疏矩阵格式能避免这件事，可当矩阵分布在很多台机器上，事情又会复杂不少。

VBCSR 是为这类计算写的一套工具。一个原子或者一个局部自由度组，往往对应一小块矩阵，不同的块大小还可能不一样。我们用可变大小的块来存储这些数据，通过 MPI 把矩阵分到不同进程，再对块内运算做优化。底层是 C++，也提供 Python 接口，日常试算法会方便一些。

其中一个我比较看重的操作是稀疏矩阵乘法。比如计算密度矩阵时，可能要反复对稀疏矩阵做乘法；如果每次相乘都产生大量很小的非零元素，矩阵很快就会变密，内存和计算量一起涨。VBCSR 支持按阈值过滤乘积中的小元素，让后续运算继续保持稀疏。仓库里放了密度矩阵纯化、态密度和量子动力学等例子。

阈值过滤并不是免费的近似。扔掉多小的元素合适，要看具体体系和希望控制的误差；MPI 通信开销也会随矩阵分布方式而改变。这些细节很琐碎，但大规模计算很多时候就是被它们卡住的。

### 如何检查实际性能

仓库已经有一套 [benchmark 生成脚本](https://github.com/DeepElectron/vbcsr/blob/main/generate_benchmark_report.py)，底层调用 [`tests/benchmark_large_scale.py`](https://github.com/DeepElectron/vbcsr/blob/main/tests/benchmark_large_scale.py)。下面是一组特意缩小过的单机测试参数，便于先检查安装和计时流程，不是我们论文使用的正式性能数据。

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

运行后可以打开 `bench-local/benchmark_report.md` 和 `bench-local/benchmark_report_data.json`，查看 SpMV、稀疏矩阵乘多个向量和 SpMM 的计时，以及与 SciPy 的误差比较。真正要比较速度，必须同时写清 CPU、BLAS、线程数、块大小、非零结构和重复次数；小规模测试通过后，再逐步提高规模和运行时长。

尤其要区分两件事：**运算结果与参照一致**和**在某台机器上更快**。如果输出里的相对差异无法接受，就不该只引用加速比。阈值过滤的误差也需要单独验证。这里给的是可执行的测试入口，我没有在这次网站修改中重新跑这些性能数字。

</div>
