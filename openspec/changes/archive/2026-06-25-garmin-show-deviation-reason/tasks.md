## 1. Render deviation reason in PlanView (Frontend)

- [x] 1.1 In `PlanView.tsx`, after the "Actual:" `<p>` block, add a conditional render: if `s.alignment_status === 'not_aligned' && s.deviation_reason`, show a `<p>` with the reason text styled as small muted warning text.
