// Importamos para crear un archivo y escribir en estos desde el FileSystem
const { writeFileSync, mkdirSync } = require("fs");
require("dotenv").config();

const apiBaseUrl = process.env["API_BASE_URL"];
const envPath = "./src/environments";

const targetPath = `${envPath}/environment.ts`;
const targetPathDev = `${envPath}/environment.development.ts`;

if (!apiBaseUrl) {
  throw new Error("API_BASE_URL is not set");
}

const envFileContent = `
export const environment = {
  apiBaseUrl: "${apiBaseUrl}"
};
`;

mkdirSync(envPath, { recursive: true });

writeFileSync(targetPath, envFileContent);
writeFileSync(targetPathDev, envFileContent);

console.log("Environment files successfully created 👌");
