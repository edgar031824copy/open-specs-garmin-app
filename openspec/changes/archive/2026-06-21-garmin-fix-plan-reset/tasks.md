## 1. UploadForm — clear stale state before upload

- [x] 1.1 [Frontend] Add `onBeforeUpload?: () => void` prop to `UploadForm` interface
- [x] 1.2 [Frontend] In `handleSubmit`, at the start of the `try` block (before `uploadPlan()`), call `localStorage.removeItem('planFilename')`, `localStorage.removeItem('planStartDate')`, and `onBeforeUpload?.()`

## 2. App — track upload count and remount PlanView

- [x] 2.1 [Frontend] Add `const [uploadCount, setUploadCount] = useState(0)` to `App`
- [x] 2.2 [Frontend] Pass `onBeforeUpload={() => setUploadCount(c => c + 1)}` to `<UploadForm>`
- [x] 2.3 [Frontend] Change `<PlanView .../>` to `<PlanView key={uploadCount} .../>`

## 3. Verify behavior

- [x] 3.1 [Frontend] Upload a plan, sync Garmin, then upload a second plan — confirm sync message from first upload is gone and filename banner shows the new file
