export default class ExtendableError extends Error {
  constructor(type, message, status) {
    super();
    this.type = type;
    this.message = message;
    this.status = status;
    this.stack = (new Error()).stack;
  }
}
