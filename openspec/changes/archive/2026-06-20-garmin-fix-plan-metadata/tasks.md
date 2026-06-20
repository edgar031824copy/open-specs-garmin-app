## 1. Upload Form — Write Metadata on Success [Frontend]

- [x] 1.1 In `UploadForm.tsx`, after the upload API call succeeds, call `localStorage.setItem('planFilename', file.name)` and `localStorage.setItem('planStartDate', planStartDate)` before transitioning to the plan view

## 2. Plan View — Read and Display Metadata [Frontend]

- [x] 2.1 In `PlanView.tsx`, on mount read `localStorage.getItem('planFilename')` and `localStorage.getItem('planStartDate')` into component state
- [x] 2.2 Render a metadata banner above the session table: show filename and start date when both are present; render nothing when either is missing

## 3. Verify [Frontend]

- [x] 3.1 Upload a plan file and confirm the banner displays the correct filename and start date
- [x] 3.2 Upload a second plan file and confirm the banner updates to the new values
- [x] 3.3 Confirm no banner is shown on a fresh page load before any upload
