// Run: SAKURA_OBJECT_STORAGE_ACCESS_TOKEN=... SAKURA_OBJECT_STORAGE_ACCESS_TOKEN_SECRET=... bun run examples/object-storage.ts
import { ObjectStorage } from "../src/object-storage";

const accessToken = process.env.SAKURA_OBJECT_STORAGE_ACCESS_TOKEN;
const accessTokenSecret = process.env.SAKURA_OBJECT_STORAGE_ACCESS_TOKEN_SECRET;
if (!accessToken || !accessTokenSecret) {
  throw new Error(
    "Set SAKURA_OBJECT_STORAGE_ACCESS_TOKEN and SAKURA_OBJECT_STORAGE_ACCESS_TOKEN_SECRET before running this example.",
  );
}

const client = new ObjectStorage({ accessToken, accessTokenSecret, site: "isk01" });

const { data: clusters } = await client.listClusters();
console.log(clusters);

const { data: buckets } = await client.listBuckets();
console.log(buckets);
