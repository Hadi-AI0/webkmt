module.exports = {
  apps: [{
    name: 'webkmt',
    script: 'server/app.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 8083
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 8083
    },
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    pid_file: './logs/pid',
    max_memory_restart: '1G',
    node_args: '--max_old_space_size=1024',
    
    // Restart settings
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    watch_options: {
      followSymlinks: false
    },
    
    // Advanced features
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000,
    
    // Kill timeout
    kill_timeout: 1600,
    
    // Source map support
    source_map_support: false,
    
    // Merge logs
    merge_logs: true,
    
    // Log rotation
    log_file: './logs/combined.log',
    time: true
  }],

  deploy: {
    production: {
      user: 'webkmt',
      host: ['your-server-ip'],
      ref: 'origin/main',
      repo: 'https://github.com/webkmt/website.git',
      path: '/var/www/webkmt',
      'pre-deploy-local': '',
      'post-deploy': 'npm install --production && mkdir -p logs && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'ssh_options': 'ForwardAgent=yes'
    }
  }
};