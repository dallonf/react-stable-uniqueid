module.exports = (api) => {
  const isTest = api.env('test');
  return {
    presets: [
      [
        '@babel/env',
        isTest
          ? { targets: { node: 'current' } }
          : {
              targets: '> 0.25%, not dead, ie 11',
              modules: process.env.TARGET === 'esm' ? false : 'umd',
            },
      ],
      '@babel/react',
    ],
  };
};
