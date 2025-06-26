const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Desativa a resolução de 'exports' do package.json (necessário para Firebase)
config.resolver.unstable_enablePackageExports = false;

// Aplica a configuração do NativeWind (passando o caminho do CSS global, se necessário)
module.exports = withNativeWind(config, { input: './globals.css' });
