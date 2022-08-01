export default {
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    collectCoverageFrom: ['src/**/*.ts', '!**/node_modules/**', '!src/config/**', '!src/index.ts', '!src/app.ts'],
    coverageReporters: ['html', 'text', 'text-summary', 'cobertura'],
    testMatch: ['**/*.test.ts'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
}