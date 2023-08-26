module.exports = {
    preset: 'ts-jest',
    transform: {
        '^.+\\.(ts|tsx)?$': 'ts-jest',
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    // stop after first failing test
    bail: true,
    // stop after 3 failed tests
    bail: 3
};