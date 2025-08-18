export default {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(png|jpg|jpeg|gif|svg)$": "<rootDir>/src/__mocks__/image.mock.js",
  },
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/(?!(@remix-run/router|axios))/"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.test.{js,jsx,ts,tsx}",
    "!src/**/__mocks__/**",
    "!src/index.js",
  ],
};
