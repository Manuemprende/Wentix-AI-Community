module.exports = {
  apps: [
    {
      name: 'wentix-ai-community',
      script: 'dist/server.cjs',
      cwd: '/var/www/wentix-ai',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_memory_restart: '512M',
      restart_delay: 3000,
      min_uptime: '10s',
      max_restarts: 10,
      watch: false,
      autorestart: true
    }
  ]
};
