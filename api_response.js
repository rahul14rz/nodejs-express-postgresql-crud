function createApiResponse({ success, status, message, ...keyValuePairs }) {
  const response = {
    success,
    status,
    message,
  };

  for (const key in keyValuePairs) {
    response[key] = keyValuePairs[key];
  }

  return response;
}

export default createApiResponse;
