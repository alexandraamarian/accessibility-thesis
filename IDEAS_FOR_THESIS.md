# Ideas for Thesis

## For the thesis document (no code changes)

### 1. Threat-to-validity section

Acknowledge weaknesses honestly: small sample size, lab vs. real-world usage, Hawthorne effect (participants behave differently when observed), and the fact that thresholds were calibrated empirically rather than derived from exact literature values.

### 2. Comparison table with existing solutions

Compare the approach against OS-level accessibility (Windows Ease of Access, macOS Accessibility), browser extensions, and manual settings dialogs. Show what each approach requires from the user vs. what ours does automatically. Positions the work clearly in the landscape.

### 3. Ethical discussion on silent adaptation

The user never consented to the UI changing. Is that paternalistic? When is it helpful vs. disorienting? This is a genuine open question in HCI research and shows critical thinking.

## For implementation (code changes)

### 4. Adaptation reversal / undo mechanism

Right now adaptations only escalate. A small non-intrusive "undo last change" toast would let users reject an unwanted adaptation. Addresses the "what if it's annoying" criticism and gives another data point: how often do users reject adaptations.

### 5. Signal timeline per session in researcher dashboard

Show a timeline of when each signal spiked and when each adaptation fired during a session. Valuable for debugging and for the thesis results chapter. The data already exists, it just needs a visualization.

### 6. Post-study qualitative question ~~DONE~~

After SUS and NASA-TLX, an open-ended question: "Did you notice any changes in the interface? If so, how did they make you feel?" Gives qualitative data to complement quantitative scores. Mixed-methods approach.

### 7. Record browser/device metadata ~~DONE~~

Log navigator.userAgent, screen resolution, and input device (touch vs. mouse) automatically. Allows analysis of whether adaptations behave differently across devices.

### 8. Pilot study calibration report

Run 2-3 pilot sessions, then write a section about how thresholds were adjusted based on pilot observations. Methodologically standard and honestly answers the "where do the numbers come from" question. Turns a weakness into a strength.

### 9. Limitations section: blind / screen reader users

The adaptive engine's signal pipeline is designed around pointer-based behavioral signals (mouse tremor, missed taps, dwell time, scroll patterns). These signals are fundamentally inaccessible to screen reader users who navigate via keyboard. While a blind user can now complete the study flow thanks to accessibility fixes, the adaptation engine will not fire any rules for them — their data represents a baseline/control condition regardless of group assignment. This is an inherent limitation of behavioral adaptation systems that rely on visual-motor signals, and it highlights the need for future work on modality-specific signal pipelines (keyboard timing, screen reader navigation patterns) to extend adaptive accessibility to users with total vision loss.

### 10. Screen reader accessibility improvements ~~DONE~~

Document the concrete WCAG fixes made to support blind users in the study: skip-to-main navigation link, aria-live announcements when UI adaptations fire, proper ARIA attributes on NASA-TLX sliders (valuemin/max/now/text), semantic timer role on task elapsed time, descriptive progress tracker step labels ("Step 1 of 8: Consent"), and improved language switcher with aria-pressed state. These fixes don't change the study's data collection but demonstrate that the system was designed with inclusive participation in mind — a blind user can complete the full study flow even if the adaptation engine cannot collect meaningful signals from them. Good material for the "Inclusive Design Considerations" or "Accessibility" subsection.

### 11. Future work: modality-specific signal pipelines

Propose keyboard/screen-reader-based signals as future work: tab navigation speed, heading jump frequency, arrow key patterns, time between ARIA live region announcements and next user action, screen reader command frequency. These could power adaptation rules relevant to blind users (e.g., simplify heading hierarchy if the user repeatedly jumps back, or increase verbosity hints if navigation slows down). Frames the current pointer-based approach as a first step rather than the full solution.
