module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    modulePathIgnorePatterns: ["<rootDir>/dist"],
    testTimeout: 100000,
    testRegex: ".e2e.ts$"
};