module.exports = {
    testEnvironment: "jsdom",
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    },
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    transform: {
        "^.+\\.[jt]sx?$": "babel-jest",
    },
    transformIgnorePatterns: ["/node_modules/(?!(@remix-run/router)/)"],
};
