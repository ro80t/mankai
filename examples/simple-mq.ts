// Run: SAKURA_SIMPLEMQ_API_KEY=... bun run examples/simple-mq.ts <queue-name>
import { SimpleMq } from "../src/simple-mq";

const apiKey = process.env.SAKURA_SIMPLEMQ_API_KEY;
if (!apiKey) {
  throw new Error(
    "Set the SAKURA_SIMPLEMQ_API_KEY environment variable before running this example.",
  );
}

const queueName = process.argv[2];
if (!queueName) {
  throw new Error("Usage: bun run examples/simple-mq.ts <queue-name>");
}

const client = new SimpleMq({ apiKey });

await client.sendMessage({ queueName, sendRequest: { content: "Hello!" } });

const received = await client.receiveMessage({ queueName });
console.log(received);
