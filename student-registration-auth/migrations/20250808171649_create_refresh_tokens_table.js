// migrations/20250808123456_create_refresh_tokens_table.js
exports.up = function (knex) {
  return knex.schema.createTable("refresh_tokens", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("token").notNullable().unique();
    table.timestamp("expires_at").notNullable();
    table.timestamps(true, true); // created_at, updated_at
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("refresh_tokens");
};
