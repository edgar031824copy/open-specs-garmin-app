# LIT-37 State of the Art: Spec-Driven Workflow Services & Agentic Development Lifecycle

> Research conducted for **[LIT-37] [E1] Spec-Driven Workflow Service (OpenSpec-style)**  
> Date: 2026-06-11 | Method: Deep research — 6 search angles, 27 sources, 126 claims extracted, 25 adversarially verified (3-vote), 7 confirmed

---

## Executive Summary

The field of spec-driven agentic development has reached a critical inflection point in 2026. Multiple independent frameworks have converged on the same core insight: **lifecycle structure is a reliability mechanism**, not bureaucratic overhead. The strongest verified evidence points to three architectural patterns that directly inform LIT-37's design choices: (1) evaluation-driven closed feedback loops as the backbone of any agentic lifecycle, (2) role-differentiated agent pipelines over flat loops, and (3) versioned JSON Schema ontologies as the canonical artifact layer that replaces prose handoffs between phases.

OpenSpec (the framework LIT-37 proposes to adopt) shows verified evidence of a genuinely extensible artifact system — user-editable `schema.yaml` plus per-artifact markdown templates that change at runtime without rebuilds. However, several of its boldest claims (exact slash command names, cross-tool compatibility breadth) did **not survive adversarial verification** and should be treated as aspirational documentation rather than shipping behavior.

---

## 1. Verified Findings

### 1.1 Evaluation-Driven Lifecycle (EDDOps)
**Confidence: 3-0 (unanimous)**

EDDOps ([arxiv:2411.13768](https://arxiv.org/html/2411.13768v3)) proposes a four-step evaluation-driven lifecycle for LLM agent development:
1. Define Evaluation Plan
2. Develop Evaluation Test Cases
3. Conduct Offline and Online Evaluations
4. Analyze and Improve

This forms a **closed feedback loop** that governs both runtime behavior and re-development decisions. The key design principle is that evaluation evidence — not intuition — drives every change gate.

**Relevance to LIT-37:** The `verify/archive` phase in OpenSpec's lifecycle maps directly onto steps 3–4. LIT-37's observable signal (`features_following_spec / features_total`) is an instance of this evaluation-driven gate. The architecture is sound and has academic backing.

---

### 1.2 Role-Differentiated Agent Pipelines (Agentsway)
**Confidence: 2-1**

Agentsway ([arxiv:2510.23664](https://arxiv.org/pdf/2510.23664)) defines a structured development lifecycle with **distinct agent roles** for planning, prompting, coding, testing, and fine-tuning — not a flat agentic loop, but a role-differentiated pipeline with human orchestration at the center.

> "The framework defines distinct roles for planning, prompting, coding, testing, and fine-tuning agents, each contributing to iterative improvement and adaptive learning throughout the development process."

**Relevance to LIT-37:** The `explore → proposal → spec+design → tasks → apply → verify/archive` lifecycle in OpenSpec is structurally similar — each phase has a distinct role/output contract. This validates the multi-phase design over simpler "one agent does everything" approaches.

---

### 1.3 V-Bounce: AI Across All SDLC Phases
**Confidence: 3-0 (unanimous)**

The V-Bounce model ([arxiv:2408.03416](https://arxiv.org/pdf/2408.03416)) proposes integrating AI into **every phase** of the SDLC — from planning to deployment — not just the implementation step.

> "AI is integrated seamlessly into every phase of development, from planning to deployment."

**Relevance to LIT-37:** This directly supports the OpenSpec approach of structuring pre-implementation phases (`explore`, `proposal`, `spec+design`) as first-class lifecycle steps with AI involvement, rather than treating specs as human-only artifacts.

---

### 1.4 OpenSpec's Runtime-Extensible Artifact Schema
**Confidence: 2-1**

OpenSpec ([github.com/Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec)) implements its artifact schema via a user-editable `schema.yaml` plus per-artifact markdown templates. Changes take effect **immediately at runtime** without rebuilding or releasing the package.

> "OPSX opens it up. Now anyone can: 1. Experiment with instructions — edit a template, see if the AI does better. 2. Test granularly — validate each artifact's instructions independently. 3. Customize workflows — define your own artifacts and dependencies. 4. Iterate quickly — change a template, test immediately, no rebuild."

**Relevance to LIT-37:** This is the extensibility mechanism that enables LIT-37's "plugin-friendly by target (Solo / Team / Scale)" requirement. The schema layer is the interface for customization — teams can fork artifact definitions without forking the workflow engine.

> ⚠️ **Note:** Several other OpenSpec claims were refuted — including the specific slash command names (`/opsx:explore`, `/opsx:apply`, etc.) and the claim of 20+ compatible AI coding assistants. These should be verified against the actual repository before being cited in demos or articles.

---

### 1.5 OMA: Versioned JSON Schema Ontology Layer
**Confidence: 3-0 (unanimous)**

AWS's Oh My AIDLC Ops (OMA) ([github.com/aws-samples/sample-oh-my-aidlcops](https://github.com/aws-samples/sample-oh-my-aidlcops)) defines exactly **8 versioned JSON Schema ontology entities** as the canonical artifact layer replacing prose handoffs between lifecycle phases:

| Entity | Purpose |
|--------|---------|
| Agent | Agent capability definition |
| Skill | Discrete skill spec |
| Deployment | Deployment contract |
| Incident | Runtime incident record |
| Budget | Resource allocation spec |
| Risk | Risk assessment artifact |
| Spec | Feature/change specification |
| ADR | Architecture Decision Record |

> "8 JSON-Schema entities in schemas/ontology/ — validated ontology documents replacing prose handoffs between phases"

**Relevance to LIT-37:** LIT-37 acceptance criterion #2 ("each phase produces a versioned artifact against a schema") has a concrete reference implementation here. OMA's 8-entity ontology is a deployable starting point for the artifact schema layer.

---

### 1.6 OMA's Dual-Axis Reliability Model
**Confidence: 3-0 (unanimous)**

OMA's reliability model splits correctness from safety along two independent axes:

- **Ontology Engineering** → guarantees correctness of agent outputs (WHAT and WHEN)  
- **Harness Engineering** → enforces safety of agent execution (HOW)

> "the reliability dual-axis: Ontology Engineering guarantees the correctness of what agents produce (the WHAT/WHEN), and Harness Engineering enforces the safety of how they execute (the HOW)"

**Relevance to LIT-37:** This is a clean separation that maps onto LIT-37's two concerns: (a) artifact schema correctness (spec artifacts are valid) and (b) workflow execution safety (the lifecycle engine doesn't skip phases or corrupt state). These can and should be designed independently.

---

### 1.7 Low-Code Orchestration Introduces Novel Failure Modes
**Confidence: 2-1**

Research ([arxiv:2509.23735](https://arxiv.org/pdf/2509.23735)) confirms that low-code orchestration platforms introduce **new and poorly understood failure modes** that specifically hinder reliability and maintainability in multi-agent systems.

> "low-code orchestration platforms introduce new and poorly understood failure modes that hinder reliability and maintainability"

**Relevance to LIT-37:** LIT-37's pattern note explicitly says "the call here is NOT to build a homegrown framework." This finding validates that caution — adopting an existing framework avoids the maintenance burden, but teams should be aware that the failure modes of the chosen platform (visual builder, YAML DSL, etc.) may not be well-documented. The observable signal (`features_following_spec / features_total`) provides a lagging indicator, not an early warning system for platform failures.

---

## 2. Refuted / Unverified Claims to Avoid

The following claims appeared in source material but were rejected by the adversarial verification pass. Do not cite these without independent verification:

| Claim | Source | Vote |
|-------|--------|------|
| Human-refined specs reduce LLM code errors by up to 50% | arxiv:2602.00180 | 0-3 |
| OpenSpec slash commands are `/opsx:explore`, `/opsx:apply`, etc. | github.com/Fission-AI/OpenSpec | 0-3 |
| OpenSpec works with 20+ AI coding assistants | openspec.pro | 1-2 |
| OpenSpec defines a four-stage workflow without rigid phase gates | openspec.pro | 0-3 |
| OMA's 3 phases can run reliably without continuous human intervention | github.com/aws-samples/sample-oh-my-aidlcops | 0-3 |
| Agentic workflow failures propagate differently than traditional failures | arxiv:2509.23735 | 0-3 |
| AI-native SDLC shifts effort away from implementation | arxiv:2408.03416 | 1-2 |

---

## 3. Landscape Overview

### Active Frameworks in the Space (2025–2026)

| Framework | Type | Lifecycle Model | Artifact Layer |
|-----------|------|----------------|----------------|
| **OpenSpec** (Fission-AI) | CLI + slash commands | explore → propose → spec+design → tasks → apply → archive | schema.yaml + markdown templates |
| **OMA** (AWS Samples) | Harness + ontology | Inception → Construction → Operations | 8 versioned JSON Schema entities |
| **EDDOps** | Research lifecycle | Define → Develop → Evaluate → Improve | Evaluation plans + test cases |
| **Agentsway** | Research framework | Planning → Prompting → Coding → Testing → Fine-tuning | Role-differentiated agent outputs |
| **V-Bounce** | Research model | All SDLC phases (planning → deployment) | Phase-spanning AI integration |
| **Kiro** (Amazon) | IDE + spec-first | Spec → Tasks → Implement | Steering documents + task lists |
| **Taskmaster AI** | CLI | Spec → Tasks → Implement | tasks.json |
| **GSD / Spec Kit** | GitHub tooling | Specs-first | Markdown specs in repo |

### Key Sources Consulted
- [arxiv:2411.13768](https://arxiv.org/html/2411.13768v3) — EDDOps (evaluation-driven lifecycle)
- [arxiv:2510.23664](https://arxiv.org/pdf/2510.23664) — Agentsway (role-differentiated pipeline)
- [arxiv:2408.03416](https://arxiv.org/pdf/2408.03416) — V-Bounce (AI-native SDLC)
- [github.com/Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec) — OpenSpec (target framework)
- [github.com/aws-samples/sample-oh-my-aidlcops](https://github.com/aws-samples/sample-oh-my-aidlcops) — OMA (artifact ontology reference)
- [arxiv:2509.23735](https://arxiv.org/pdf/2509.23735) — Multi-agent failure modes
- [deeplearning.ai — SDD course](https://www.deeplearning.ai/courses/spec-driven-development-with-coding-agents)
- [Medium: SDD ecosystem map (30 frameworks)](https://medium.com/@visrow/spec-driven-development-is-eating-software-engineering-a-map-of-30-agentic-coding-frameworks-6ac0b5e2b484)

---

## 4. Gaps & Open Questions for LIT-37

1. **Cross-team artifact alignment** — OMA's 8-entity ontology is a reference, but no verified evidence exists for how well it scales across teams with heterogeneous toolchains. LIT-37's AC#3 ("plugs into different targets without forking") requires empirical validation.

2. **Phase gate enforcement** — The refuted OpenSpec slash-command claims suggest the phase gate mechanism may be advisory rather than enforced. How OpenSpec prevents phase skipping (e.g., going directly from `explore` to `apply`) needs direct code inspection.

3. **Observable signal calibration** — `features_following_spec / features_total` is a lagging metric. No verified evidence exists for what leading indicators predict lifecycle adherence before artifacts are produced.

4. **Solo vs. Scale plugin differences** — The research confirms plugin-friendly design is architecturally feasible (OpenSpec's runtime extensibility), but no verified evidence addresses the specific behavioral differences needed for solo/team/scale targets within a single lifecycle engine.

---

## 5. Recommendations for LIT-37 PoC

Based on verified findings:

1. **Adopt OpenSpec's runtime-extensible schema layer** as the artifact customization mechanism — the `schema.yaml` + template model is verified and directly matches AC#2.

2. **Model the reliability architecture on OMA's dual-axis** — keep ontology (artifact schema correctness) and harness (execution safety) concerns separate from day one.

3. **Use EDDOps' evaluation loop as the `verify` phase template** — Define Evaluation Plan and Develop Test Cases are the pre-conditions; Conduct + Analyze map to the verify/archive phase output.

4. **Do not build a low-code visual orchestrator** — the research confirms these introduce novel, poorly-understood failure modes. A CLI with explicit phase hooks (as LIT-37 specifies) is the safer path.

5. **Verify OpenSpec slash command names and compatibility claims directly** from the repo — several were refuted by the adversarial pass and should not appear in the Labs demo without confirmation.

---

*Research method: 6 parallel search angles → 27 sources fetched → 126 claims extracted → 25 adversarially verified (3-vote panel) → 7 confirmed. Synthesis pass failed due to session limits; findings assembled manually from raw verification output.*
