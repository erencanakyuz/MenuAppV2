const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
// const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config'); // Commented out due to compatibility issues

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {};

// Revert to original configuration without Reanimated wrapper
module.exports = mergeConfig(getDefaultConfig(__dirname), config);
