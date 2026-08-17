// Shared helper for the example scripts in this directory.
// In your own project, install the package and import from "mankai" instead:
//   import { AiEngine } from "mankai";
import { AiEngine } from "../src/ai-engine";

export function createClient(): AiEngine {
  const apiKey = process.env.SAKURA_AI_ENGINE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Set the SAKURA_AI_ENGINE_API_KEY environment variable before running this example.",
    );
  }
  return new AiEngine({ apiKey });
}
