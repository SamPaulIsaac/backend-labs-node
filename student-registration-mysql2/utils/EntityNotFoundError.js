class EntityNotFoundError extends Error {
  constructor(message, status = 404) {
    super(message);
    this.status = status;
  }
}

module.exports = EntityNotFoundError;
