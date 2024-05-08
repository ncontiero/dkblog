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
  react: {
    overrides: {
      // https://github.com/jsx-eslint/eslint-plugin-react/issues/3717
      "react/boolean-prop-naming": "off",
    },
  },
});
