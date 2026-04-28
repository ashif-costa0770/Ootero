import app from "./src/app.js";
import startAutoSyncJob from "./src/jobs/orderSync.job.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

  // 🕒 Start order auto-sync job
  startAutoSyncJob();
});