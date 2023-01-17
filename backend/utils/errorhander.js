class ErrorHander extends Error {
  constructor(message, statusCode) {
    console.log("ErrorHander with class");
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorHander;
