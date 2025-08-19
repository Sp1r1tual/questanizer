class ApiError extends Error {
  status;
  errors;

  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static BadRequest(message = "Bad request", errors = []) {
    return new ApiError(400, message, errors);
  }

  static UnauthorizedError(message = "User is not authorized") {
    return new ApiError(401, message);
  }

  static Forbidden(message = "Access denied") {
    return new ApiError(403, message);
  }

  static NotFound(message = "Resource not found") {
    return new ApiError(404, message);
  }

  static Conflict(message = "Conflict occurred") {
    return new ApiError(409, message);
  }

  static PayloadTooLarge(message = "Payload too large") {
    return new ApiError(413, message);
  }
}

export { ApiError };
