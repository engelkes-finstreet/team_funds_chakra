const path = require("path");

const fromRoot = (d) => path.join(__dirname, d);

module.exports = {
  roots: [fromRoot("app")],
  resetMocks: true,
  coveragePathIgnorePatterns: [],
  collectCoverageFrom: ["**/app/**/*.{js,ts,tsx}"],
  coverageThreshold: null,
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "esbuild-jest",
    "^.+\\.jsx?$": "esbuild-jest",
  },
  moduleDirectories: ["node_modules", fromRoot("tests")],
  moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx"],
  moduleNameMapper: {
    "~/(.*)": fromRoot("app/$1"),
  },
};
