/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./src/models/*.js",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: "sqlite.db",
  },
};