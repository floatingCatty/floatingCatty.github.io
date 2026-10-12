---
layout: research
permalink: /research/learned-hamiltonians-to-observables/
title: "从机器学习哈密顿量到真正可计算的电子物性"
title_en: "From learned Hamiltonians to scalable electronic properties"
description: "A technical guide to turning learned electronic Hamiltonians into density of states, optical response and quantum transport, with published DeePTB, SLEM, VBCSR and NEGF examples."
description_zh: "从 DeePTB 和 SLEM 预测哈密顿量，到利用稀疏算法计算态密度、光学响应和器件输运：一份有原始论文依据的技术路线说明。"
paper_year: 2026
project_kind: guide
tags:
  - Electronic structure
  - Scientific computing
paper_url: "https://doi.org/10.1038/s41467-024-51006-4"
code_url: "https://github.com/deepmodeling/DeePTB"
citation_urls:
  - "https://doi.org/10.1038/s41467-024-51006-4"
  - "https://proceedings.iclr.cc/paper_files/paper/2025/hash/7db2ffcbfd0bd361d47b7fa612bd2ba2-Abstract-Conference.html"
  - "https://arxiv.org/abs/2609.04397"
  - "https://doi.org/10.1103/PhysRevB.108.195143"
  - "https://doi.org/10.1038/s41524-025-01853-6"
  - "https://doi.org/10.1038/s41524-026-02137-3"
research_locale: en
translation_url: "/zh/research/learned-hamiltonians-to-observables/"
alternate_en_url: "/research/learned-hamiltonians-to-observables/"
alternate_zh_url: "/zh/research/learned-hamiltonians-to-observables/"
---

<div class="post-en" lang="en" markdown="1">

An accurate Hamiltonian is not yet an electronic-structure calculation in the sense that an experimentalist or device engineer needs. It describes a system. It does not, by itself, tell us its conductivity, the charge around a defect, or what happens when we put contacts on either side of a channel.

I have come across this distinction repeatedly while working on learned Hamiltonians, quantum transport and large sparse-matrix software. The prediction of an operator may take seconds, yet the next step still involves a numerical problem that is too large to solve naively. This note collects the **publicly documented pieces** of that route. It is a technical reading map, not a new paper or a report of unpublished benchmarks.

## One calculation, several quite different problems

A useful way to organize the work is:

**Atomic structure and environment → Hamiltonian and overlap → scalable linear algebra → observable → physical validation.**

These steps have different failure modes. Learning a matrix accurately is mostly a modeling problem. Applying it to a million-atom system is partly a data-layout and parallel-computing problem. Computing optical or transport response introduces another set of physical assumptions. The distinction matters because success at one stage is not evidence that the later stages work.

| Layer | Main question | Something that must be checked |
| --- | --- | --- |
| Operator prediction | Can a model produce the right matrix on structures it has not seen? | Band energies, matrix symmetries, local environments outside the training set |
| Orbital representation | What is the basis in which the model acts? | Overlap matrix, orbital ordering, basis transformations and Hermiticity |
| Numerical evaluation | Can we apply or factor the needed sparse operators at the target size? | Accuracy, memory, communication, and time-to-solution |
| Physical observable | Is the chosen quantity formulated correctly for this basis and boundary condition? | Spectra, charge, optical response, or transmission against a reference |
| Engineering interpretation | Does a computed difference correspond to a measurable effect? | Contacts, electrostatics, temperature, disorder and uncertainty |

## Learning an operator: DeePTB and SLEM solve related but different problems

In [DeePTB](https://doi.org/10.1038/s41467-024-51006-4), we learned environment-dependent parameters of a compact Slater–Koster tight-binding Hamiltonian from first-principles electronic information. The point was not merely to interpolate one band diagram: the same trained model could be evaluated along atomic trajectories with local distortions. The published finite-temperature GaP example then used a **learned Hamiltonian and tight-binding propagation** on a structure of one million atoms. It was **not** a million-atom self-consistent DFT calculation. [Project explanation]({{ '/research/deeptb/' | relative_url }}) · [Code](https://github.com/deepmodeling/DeePTB).

[SLEM](https://proceedings.iclr.cc/paper_files/paper/2025/hash/7db2ffcbfd0bd361d47b7fa612bd2ba2-Abstract-Conference.html) starts closer to the matrices used in atomic-orbital DFT: the Hamiltonian, overlap and other quantum operators. Its strictly local, equivariant architecture deals explicitly with the transformation of orbital tensors under rotations. That buys something different from compact tight binding, but it also means that the **nonorthogonal basis is part of the computational problem**, not a detail to ignore. [Project explanation]({{ '/research/slem/' | relative_url }}).

In a nonorthogonal basis, the stationary problem is the generalized eigenproblem

$$
Hc_n = E_n S c_n,
$$

where the overlap matrix $S$ defines the orbital metric. If we simply pass the learned $H$ to an algorithm that assumes $S=I$, we may solve the wrong problem. We also need to verify that the predicted matrices obey the symmetries and numerical conditions expected by the downstream solver. Small errors in an operator need not lead to equally small errors in every derived property, particularly near delicate spectral features.

## Getting a spectrum is not the same as diagonalizing everything

For a finite basis with a Hermitian $H$ and positive-definite $S$, one can write the retarded resolvent and density of states as

$$
G^r(E)=\left[(E+i\eta)S-H\right]^{-1},
$$

$$
D_\eta(E)=-\frac{1}{\pi}\operatorname{Im}\operatorname{Tr}\!\left[S\,G^r(E)\right],\qquad \eta>0.
$$

This is a broadened density of states. The appearance of $S$ in the trace is not optional: it is how the metric enters this representation. The formula describes the target quantity; it does **not** mean we should form the dense inverse of a huge matrix.

For a well-localized sparse Hamiltonian, a matrix-vector product can be much cheaper than full diagonalization. Polynomial propagation and stochastic trace methods can exploit that distinction when their convergence, statistical error and required resolution are controlled. The important caveat is that a cheap action of $H$ does not automatically make every operation involving $S^{-1}$ cheap. Nor does it guarantee that sharply resolved local or response properties can be evaluated at the same cost as a coarse total DOS.

The 2024 DeePTB work provides a concrete published example: DeePTB Hamiltonians were post-processed with the tight-binding propagation method to obtain finite-temperature DOS and optical properties for a million-atom GaP structure. [Nature Communications 15, 6772](https://doi.org/10.1038/s41467-024-51006-4). Later, a separate [npj Computational Materials study](https://doi.org/10.1038/s41524-026-02137-3) combined DeePMD trajectory sampling with HSE-trained DeePTB models to study phonon-assisted optical properties in supercells up to 4,096 atoms. The two papers answer different scale/accuracy questions and should not be conflated.

## The sparse-matrix problem is physical as well as computational

Atomic-orbital matrices carry local structure. If an atom has several orbitals, its interactions with another atom appear as a small dense block. Different elements may have different numbers of orbitals, so the block dimensions are not necessarily uniform. Storing every entry as an unrelated scalar can lose the opportunity to use efficient block kernels.

[VBCSR](https://arxiv.org/abs/2609.04397) preserves those variable-sized blocks, groups compatible block shapes for optimized operations, and distributes matrices across MPI processes. Its public preprint reports sparse-matrix benchmarks and an application to an InP nanoparticle containing more than one million atoms. [Project explanation and runnable benchmark entry]({{ '/research/vbcsr/' | relative_url }}) · [Code](https://github.com/DeepElectron/vbcsr).

It is worth separating three claims: a block representation saves overhead for some sparsity patterns; a particular multiplication is faster on the tested hardware; and an entire physical calculation becomes cheaper at a larger scale. These are not interchangeable. Thresholding small entries can keep intermediate matrices sparse, but it changes the approximation and needs an observable-level error check. MPI communication, memory growth and the block-size distribution matter as much as a kernel microbenchmark.

## Transport changes the question: the system is open

A bulk spectrum says little about the current through a device unless the contacts, boundary conditions and electrostatics are also specified. In coherent NEGF, the device Green function contains the lead self-energies:

$$
G^r_C(E)=\left[(E+i\eta)S_C-H_C-\Sigma^r_L(E)-\Sigma^r_R(E)\right]^{-1}.
$$

The transmission depends on $G^r_C$ and its coupling to the leads, not only on the isolated device's eigenvalues. In nonorthogonal formulations the lead-device coupling and related observables must also be treated consistently with overlap; the compact expression here does not replace a full implementation.

This is why validating only the band structure is not enough. The [2025 npj Computational Materials DeePTB-NEGF paper](https://doi.org/10.1038/s41524-025-01853-6) used learned Hamiltonians for more than 10,000 break-junction configurations and for carbon-nanotube field-effect transistors, including an electrostatically gated 41 nm channel benchmarked against experimental transfer characteristics. It also reported a 180 nm nanotube **zero-bias transmission** calculation. Those last two are distinct tests; the 180 nm result should not be mistaken for a fully gated, finite-bias transistor benchmark.

The [2D-material transport work](https://arxiv.org/abs/2512.11291) tests graphene, h-BN and MoS₂ against DFT-NEGF transmission calculations. It is a separate study of representative materials, not evidence that all defects, contacts and industrial device geometries are already covered. [DeePTB-NEGF explanation]({{ '/research/deeptb-negf/' | relative_url }}).

A different direction is to differentiate the transport calculation itself. [AD-NEGF, Physical Review B 108, 195143 (2023)](https://doi.org/10.1103/PhysRevB.108.195143) uses automatic differentiation and implicit-layer methods within a tight-binding NEGF model for response derivatives and inverse design. That does not turn an approximate Hamiltonian into an exact one; it makes the chosen model's calculations differentiable. [Project explanation]({{ '/research/ad-negf/' | relative_url }}) · [Code](https://github.com/floatingCatty/ADNEGF).

## What I would check before believing a large calculation

When a new model or fast solver is described as accurate and scalable, I try to separate the evidence into a few concrete questions:

1. **Model domain:** Which structures, species, distortions and electronic states were covered by the reference data? Was the test genuinely held out?
2. **Operator consistency:** Are $H$ and, when present, $S$ Hermitian in the chosen representation? Is $S$ numerically usable, and are the basis conventions recorded?
3. **Observable accuracy:** What is the error in the **quantity being used**—DOS peak positions, charge, optical spectrum, transmission, or a response coefficient—rather than only in a training loss?
4. **Numerical convergence:** Does the answer change with broadening, polynomial order, stochastic samples, solver tolerance, sparse threshold or lead self-energy accuracy?
5. **Scaling evidence:** Are wall-clock time, memory, node count and communication reported for the **entire useful calculation** with a fixed accuracy target, not only for a favorable matrix kernel?

That list is also useful for a coding agent. An agent can assemble a model, run a sparse calculation and generate plots. It should also record the input, training-model version, operator conventions, solver parameters, reference and failed checks. Otherwise a fast automated run can be very difficult for another scientist to interpret. My separate [flower project](https://github.com/floatingCatty/flower) focuses on the reproducibility side, and its [worked scientific-agent example](https://github.com/floatingCatty/flower/blob/main/docs/REPRODUCING_AGENT_CALCULATIONS.md) shows how a run can be exported and compared numerically.

## Where this line of work leads

The useful unit of scientific software is not just a model that returns a matrix. It is a workflow that turns a structure into a physically meaningful answer, with the approximations and failure modes still visible. Learned quantum operators, sparse numerical infrastructure and observable-specific solvers each remove a different bottleneck. Together they make new scales and new kinds of questions accessible—but only where the whole chain has been validated.

This note draws on already public papers and repositories. It intentionally does not describe methods or results from manuscripts that have not yet been released.

### Original sources and code

- [DeePTB — Nature Communications **15**, 6772 (2024)](https://doi.org/10.1038/s41467-024-51006-4) · [GitHub](https://github.com/deepmodeling/DeePTB)
- [SLEM — ICLR 2025 proceedings](https://proceedings.iclr.cc/paper_files/paper/2025/hash/7db2ffcbfd0bd361d47b7fa612bd2ba2-Abstract-Conference.html)
- [VBCSR — arXiv:2609.04397 (2026 preprint)](https://arxiv.org/abs/2609.04397) · [GitHub](https://github.com/DeepElectron/vbcsr)
- [AD-NEGF — Physical Review B **108**, 195143 (2023)](https://doi.org/10.1103/PhysRevB.108.195143)
- [DeePTB-NEGF — npj Computational Materials **11**, 375 (2025)](https://doi.org/10.1038/s41524-025-01853-6)
- [Phonon-assisted optics — npj Computational Materials **12**, 268 (2026)](https://doi.org/10.1038/s41524-026-02137-3)
- [DeePTB-NEGF for 2D materials — arXiv:2512.11291](https://arxiv.org/abs/2512.11291)

</div>
