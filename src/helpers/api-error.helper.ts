interface ApiError extends Error {
  statusCode: number;
  errors: string[];
  success: boolean;
}

const generateApiError = (
  statusCode: number,
  message: string,
  errors: string[]
): ApiError => {
  const error = new Error(message) as ApiError;
  error.statusCode = statusCode;
  error.errors = errors;
  error.success = false;
  return error;
};

export { generateApiError };
