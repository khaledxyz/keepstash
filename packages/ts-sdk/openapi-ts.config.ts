import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "../../apps/api/openapi.json",
  output: {
    path: "src/client",
    format: "biome",
    clean: true,
  },
  plugins: [
    {
      name: "@hey-api/typescript",
      exportFromIndex: true,
      enums: false,
      requests: {
        name: (operation) => `${operation.split("Controller")[1]}Data`,
      },
      responses: {
        name: (operation) => `${operation.split("Controller")[1]}Responses`,
        response: (operation) => `${operation.split("Controller")[1]}Response`,
      },
      definitions: {
        name: (schema) => schema.replace(/Dto$/, ""),
      },
    },

    {
      name: "@hey-api/client-fetch",
      exportFromIndex: true,
    },

    {
      name: "@hey-api/transformers",
      dates: true,
      bigInt: true,
    },
    {
      name: "@hey-api/sdk",
      asClass: true,
      exportFromIndex: true,
      transformer: true,
      classNameBuilder: (tag) => tag.toLowerCase(),
      methodNameBuilder: (operation) => {
        let name = operation.id;
        name = name.replace(/Controller/g, "");
        name = name.replace(/^[a-z]+(?=[A-Z])/, "");
        return name.charAt(0).toLowerCase() + name.slice(1);
      },
    },
  ],
});
