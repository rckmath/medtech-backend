export default class ExtendableError extends Error {
  constructor(message, status) {
    super();
    this.message = message;
    this.status = status;
    this.stack = (new Error()).stack;
  }
}
