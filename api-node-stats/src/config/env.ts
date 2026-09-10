try {
  process.loadEnvFile();
} catch {
  console.log("No se encontró archivo .env, se usarán variables de entorno del sistema");
}

export const env = {
  port: process.env.PORT || 8000,
};
