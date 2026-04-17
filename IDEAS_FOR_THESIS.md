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
