// Run: SAKURA_IAM_ACCESS_TOKEN=... bun run examples/iam.ts
import { Iam } from "../src/iam";

const accessToken = process.env.SAKURA_IAM_ACCESS_TOKEN;
if (!accessToken) {
  throw new Error(
    "Set the SAKURA_IAM_ACCESS_TOKEN environment variable before running this example.",
  );
}

const client = new Iam({ accessToken });

const users = await client.users.listUsers({});
console.log(users);

const projects = await client.projects.listProjects({});
console.log(projects);
