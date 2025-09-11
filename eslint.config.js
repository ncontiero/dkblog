import { ncontiero } from "@ncontiero/eslint-config";

export default ncontiero({
  ignores: ["./src/lib/generated/**"],
  javascript: {
    overrides: {
      "node/no-unsupported-features/node-builtins": [
        "error",
        { allowExperimental: true },
      ],
    },
  },
});
