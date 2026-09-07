// Run: SAKURA_ACCESS_TOKEN=... SAKURA_ACCESS_TOKEN_SECRET=... bun run examples/simple-notification.ts
import { SimpleNotification } from "../src/simple-notification";

const accessToken = process.env.SAKURA_ACCESS_TOKEN;
const accessTokenSecret = process.env.SAKURA_ACCESS_TOKEN_SECRET;
if (!accessToken || !accessTokenSecret) {
  throw new Error(
    "Set SAKURA_ACCESS_TOKEN and SAKURA_ACCESS_TOKEN_SECRET before running this example.",
  );
}

const client = new SimpleNotification({ accessToken, accessTokenSecret });

const destinations = await client.listCommonServiceItems();
console.log(destinations);

const sources = await client.listNotificationSources();
console.log(sources);
