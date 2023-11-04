function createApiResponse({ success, status, message, data = null }) {
  const response = {
    success,
    status,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return response;
}

export default createApiResponse;
