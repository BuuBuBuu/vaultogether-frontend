export const getValidationErrorMessage = (error) => {
  if (error.response?.status === 400 && error.response?.data?.validationErrors) {
    const errors = error.response.data.validationErrors;
    // return the errors to front
    return Object.entries(errors)
      .map(([field, message]) => `${field}: ${message}`)
      .join('\n');
  }
  return null;
};
