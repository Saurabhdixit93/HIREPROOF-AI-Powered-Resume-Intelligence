import IORedis from "ioredis";
import { config } from "./env";

const redisUrl = config.redisUrl || "redis://localhost:6379";

const connection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
});

// Configure Redis eviction policy for BullMQ to prevent the 'noeviction' warnings if possible
connection.once("ready", async () => {
  try {
    // Check current maxmemory-policy
    const policyResult = await connection.config("GET", "maxmemory-policy");
    const currentPolicy =
      policyResult && Array.isArray(policyResult) ? policyResult[1] : null;

    if (currentPolicy && currentPolicy !== "noeviction") {
      try {
        await connection.config("SET", "maxmemory-policy", "noeviction");
        console.log("⚡️ Redis maxmemory-policy set to noeviction");
      } catch (setErr) {
        // Restricted config SET is common in managed Redis (e.g. Upstash)
        // We log this once as a tip for the user
        console.info(
          '💡 Note: Redis is using "%s" eviction policy. For BullMQ reliability, manual set to "noeviction" is recommended if supported by your provider.',
          currentPolicy,
        );
      }
    }
  } catch (getErr) {
    // Fail silently if CONFIG GET is restricted
  }
});

export default connection;
