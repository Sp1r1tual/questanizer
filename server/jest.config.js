export default {
    testEnvironment: "node",
    extensionsToTreatAsEsm: [".js"],
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov"],
    collectCoverageFrom: [
        "src/**/*.js",
        "!src/**/*.test.js",
        "!src/**/index.js",
    ],
};
