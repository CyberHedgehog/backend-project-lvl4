module.exports = {
  presets: [
    ['@babel/env', {
      targets: {
        node: 'current',
      },
      ignoreBrowserslistConfig: true,
    }],
  ],
};
