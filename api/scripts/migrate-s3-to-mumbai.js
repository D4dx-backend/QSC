/**
 * Migrate all objects from dietfoodms (me-south-1, Bahrain) to qsc-mumbai (ap-south-1, Mumbai).
 *
 * Uses S3 server-side CopyObject — only connects to the DESTINATION region (Mumbai).
 * AWS handles cross-region transfer internally, so this works even if Bahrain S3
 * is unreachable from the local machine.
 *
 * Usage:
 *   node scripts/migrate-s3-to-mumbai.js          # dry-run (list only)
 *   node scripts/migrate-s3-to-mumbai.js --run     # actually copy
 */

const {
  S3Client,
  ListObjectsV2Command,
  CopyObjectCommand,
  HeadObjectCommand,
} = require("@aws-sdk/client-s3");

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

// ── config ──────────────────────────────────────────────────────────────
const SRC_BUCKET = "dietfoodms";
const SRC_REGION = "me-south-1";

const DST_BUCKET = "qsc-mumbai";
const DST_REGION = "ap-south-1";

const CONCURRENCY = 10; // parallel copy operations
const DRY_RUN = !process.argv.includes("--run");

const creds = {
  accessKeyId: process.env.SPACES_ACCESS_KEY_ID,
  secretAccessKey: process.env.SPACES_SECRET_ACCESS_KEY,
};

// Both clients point to DESTINATION region — CopyObject handles cross-region
const dstS3 = new S3Client({ region: DST_REGION, credentials: creds });

// ── helpers ─────────────────────────────────────────────────────────────

// List objects from source bucket via the destination-region client.
// S3 ListObjectsV2 works cross-region when using the correct bucket name.
async function listAllKeys() {
  const keys = [];
  let token;
  // Use a separate client for the source region just for listing
  const listS3 = new S3Client({ region: SRC_REGION, credentials: creds });
  do {
    const res = await listS3.send(
      new ListObjectsV2Command({
        Bucket: SRC_BUCKET,
        ContinuationToken: token,
      })
    );
    for (const obj of res.Contents || []) {
      keys.push({ Key: obj.Key, Size: obj.Size });
    }
    token = res.NextContinuationToken;
  } while (token);
  return keys;
}

// Alternative: list from destination bucket to find what's already copied
async function listDstKeys() {
  const keys = new Set();
  let token;
  do {
    const res = await dstS3.send(
      new ListObjectsV2Command({
        Bucket: DST_BUCKET,
        ContinuationToken: token,
      })
    );
    for (const obj of res.Contents || []) {
      keys.add(obj.Key);
    }
    token = res.NextContinuationToken;
  } while (token);
  return keys;
}

async function copyObject(key) {
  // CopySource format: /source-bucket/key  (key must be URI-encoded)
  const copySource = `${SRC_BUCKET}/${encodeURIComponent(key)}`;
  await dstS3.send(
    new CopyObjectCommand({
      Bucket: DST_BUCKET,
      Key: key,
      CopySource: copySource,
      ACL: "public-read",
      MetadataDirective: "COPY",
    })
  );
}

async function runBatch(items, fn, concurrency) {
  let idx = 0;
  const results = [];
  async function worker() {
    while (idx < items.length) {
      const i = idx++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

// ── main ────────────────────────────────────────────────────────────────
(async () => {
  console.log(`Source: s3://${SRC_BUCKET} (${SRC_REGION})`);
  console.log(`Dest:   s3://${DST_BUCKET} (${DST_REGION})`);
  console.log(`Using: S3 CopyObject (server-side, only connects to ${DST_REGION})`);
  console.log(DRY_RUN ? "MODE: DRY RUN (add --run to copy)\n" : "MODE: COPY\n");

  // List source objects — this needs Bahrain connectivity.
  // If it times out, pass --use-manifest <file.json> with a pre-exported key list.
  let keys;
  if (process.argv.includes("--use-manifest")) {
    const mIdx = process.argv.indexOf("--use-manifest");
    const manifestPath = process.argv[mIdx + 1];
    keys = JSON.parse(require("fs").readFileSync(manifestPath, "utf8"));
    console.log(`Loaded ${keys.length} keys from manifest: ${manifestPath}`);
  } else {
    console.log("Listing source objects (connecting to me-south-1)...");
    keys = await listAllKeys();
  }
  const totalMB = keys.reduce((s, k) => s + k.Size, 0) / 1024 / 1024;
  console.log(`Found ${keys.length} objects (${totalMB.toFixed(2)} MB)\n`);

  if (DRY_RUN) {
    keys.slice(0, 20).forEach((k) => console.log(`  ${k.Key}  (${(k.Size / 1024).toFixed(1)} KB)`));
    if (keys.length > 20) console.log(`  ... and ${keys.length - 20} more`);
    // Save manifest for offline use
    const manifestFile = path.join(__dirname, "s3-manifest.json");
    require("fs").writeFileSync(manifestFile, JSON.stringify(keys, null, 2));
    console.log(`\nManifest saved to ${manifestFile}`);
    console.log("Dry run complete. Run with --run to migrate.");
    return;
  }

  // Check what already exists in destination
  console.log("Listing destination objects...");
  const existingKeys = await listDstKeys();
  console.log(`Already in destination: ${existingKeys.size}\n`);

  let copied = 0,
    skipped = 0,
    failed = 0;

  await runBatch(
    keys,
    async (obj) => {
      try {
        if (existingKeys.has(obj.Key)) {
          skipped++;
          return;
        }
        await copyObject(obj.Key);
        copied++;
        if ((copied + skipped + failed) % 50 === 0) {
          console.log(`Progress: ${copied} copied, ${skipped} skipped, ${failed} failed / ${keys.length} total`);
        }
      } catch (err) {
        failed++;
        console.error(`FAIL ${obj.Key}: ${err.message}`);
      }
    },
    CONCURRENCY
  );

  console.log(`\nDone! Copied: ${copied}, Skipped: ${skipped}, Failed: ${failed}`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
