import { rm } from "node:fs/promises";

import { $ } from "bun";

interface OpenApiSpec {
  name: string;
  url: string;
}

const specs: OpenApiSpec[] = [
  {
    name: "ai-engine",
    url: "https://manual.sakura.ad.jp/api/cloud/portal/openapis/ai-engine-inference-api.yaml",
  },
];

for (const spec of specs) {
  const outDir = `src/openapi/${spec.name}`;

  await $`bunx openapi-generator-cli generate -i ${spec.url} -g typescript-fetch -o ${outDir} --additional-properties=supportsES6=true,typescriptThreePlus=true,withInterfaces=true --type-mappings=float64=number --skip-validate-spec`;

  await rm(`${outDir}/docs`, { recursive: true, force: true });

  // The generated runtime.ts declares `cause` as a plain constructor param property,
  // which trips `noImplicitOverride` since `Error.cause` exists in the ESNext lib.
  const runtimePath = `${outDir}/runtime.ts`;
  const runtime = await Bun.file(runtimePath).text();
  await Bun.write(
    runtimePath,
    runtime.replace("constructor(public cause: Error", "constructor(public override cause: Error"),
  );
}
