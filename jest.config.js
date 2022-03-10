const path = require("path");

const fromRoot = (d) => path.join(__dirname, d);

module.exports = {
  roots: [fromRoot("app"), fromRoot("tests")],
  resetMocks: true,
  coveragePathIgnorePatterns: [],
  maxWorkers: 1,
  setupFiles: ["<rootDir>/tests/dotenv-config.js"],
  collectCoverageFrom: ["**/app/**/*.{js,ts,tsx}"],
  coverageThreshold: null,
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "esbuild-jest",
    "^.+\\.jsx?$": "esbuild-jest",
  },
  moduleDirectories: ["node_modules", "tests"],
  moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx"],
  moduleNameMapper: {
    "~/(.*)": fromRoot("app/$1"),
    "tests/(.*)": "<rootDir>/tests/$1",
  },
};
