module.exports = {
  apps: [
    {
      name: "v-dental",
      script: "dist/src/main.js",
      instances: "max", // Utilize all CPU cores
      exec_mode: "cluster", // Enable cluster mode
      autorestart: true,
      watch: false, // Disable in production
      max_memory_restart: "1G", // Restart if memory exceeds 1GB
      env_production: {
        NODE_ENV: "pro", // Changed from "pro" to standard "production"
        DATABASE_PORT: "5434",
        DATABASE_PASSWORD: "k9/BZLT.#iugb?EWp.2W",
        DATABASE_HOST: "localhost",
        DATABASE_NAME: "v-dental-clinic",
        DATABASE_USER: "postgres",
        JWT_SECRET: "k9/BZLT.#iugb?EWp.2W",
        PORT: 3001,
        EMAIL_HOST: "smtp.gmail.com",
        EMAIL_PORT: 465,
        EMAIL_SECURE: true,
        EMAIL_USER: "hady812012@gmail.com",
        EMAIL_PASSWORD: "cmrv zxad ktsw xfjw",
      },
      error_file: "./logs/tivo-err.log",
      out_file: "./logs/tivo-out.log",
      log_file: "./logs/tivo-combined.log",
      time: true,
    },
  ],
};
