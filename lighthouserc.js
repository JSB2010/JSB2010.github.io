module.exports = {
  ci: {
    collect: {
      staticDistDir: './out',
      url: [
        'index.html',
        'about/index.html',
        'projects/index.html',
        'contact/index.html'
      ],
      numberOfRuns: 1,
    },
    upload: {
      target: 'temporary-public-storage',
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['warn', {minScore: 0.7}],
        'categories:accessibility': ['warn', {minScore: 0.8}],
        'categories:best-practices': ['warn', {minScore: 0.8}],
        'categories:seo': ['warn', {minScore: 0.8}],
        // Disable some assertions that might be too strict
        'uses-rel-preconnect': 'off',
        'uses-responsive-images': 'off',
        'offscreen-images': 'off',
        'unused-javascript': 'off',
        'uses-optimized-images': 'off',
        'unminified-css': 'off',
        'unminified-javascript': 'off',
      },
    },
  },
};
