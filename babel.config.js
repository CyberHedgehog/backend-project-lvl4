module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current',
      },
      ignoreBrowserslistConfig: true,
    }],
  ],
  plugins: ['@babel/plugin-proposal-class-properties'],
};
