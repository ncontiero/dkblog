import { dkshs } from "@dkshs/eslint-config";

export default dkshs({
  react: {
    overrides: {
      // https://github.com/jsx-eslint/eslint-plugin-react/issues/3717
      "react/boolean-prop-naming": "off",

      "jsx-a11y/label-has-associated-control": [
        "warn",
        { controlComponents: ["Textarea", "Input"] },
      ],
    },
  },
});
