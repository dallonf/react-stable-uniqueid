module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: '> 0.25%, not dead, ie 11',
        modules: process.env.TARGET === 'esm' ? false : 'umd',
      },
    ],
    '@babel/react',
  ],
};
