const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Desativa a resolução de 'exports' do package.json, que causa o problema com o Firebase.

config.resolver.unstable_enablePackageExports = false;

module.exports = config;