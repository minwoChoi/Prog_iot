module.exports = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store', // API 전역 캐싱 방지
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*', // 프론트엔드 요청 경로
        destination: 'http://your-insecure-api.com/:path*', // 백엔드 API 경로 (HTTP)
      },
    ];
  },
};
