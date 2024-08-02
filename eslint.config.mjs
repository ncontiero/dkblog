import { dkshs } from "@dkshs/eslint-config";

export default dkshs({
  javascript: {
    overrides: {
      "node/no-unsupported-features/node-builtins": [
        "error",
        {
          ignores: ["fetch", "Blob", "File", "FormData", "Response", "Request"],
        },
      ],
    },
  },
});
