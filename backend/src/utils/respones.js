//! Success Response
// This function is used to send a success response to the client
export const successResponse = (res, statusCode = 200, message = 'Success', data = null) => {
    const response = {
      success: true,
      message,
    };
  
    if (data !== null) {
      response.data = data;
    }
  
    return res.status(statusCode).json(response);
  };


  //! Error Response
  // This function is used to send an error response to the client
  export const errorResponse = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
    const response = {
      success: false,
      message,
    };
  
    if (errors !== null) {
      response.errors = errors;
    }
  
    return res.status(statusCode).json(response);
  };

  //! Paginated Response
  // This function is used to send a paginated response to the client
  export const paginatedResponse = (res, statusCode = 200, message = 'Success', data = [], pagination = {}) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      pagination: {
        page: pagination.page || 1,
        limit: pagination.limit || 10,
        totalPages: pagination.totalPages || 1,
        totalItems: pagination.totalItems || 0,
        hasNextPage: pagination.hasNextPage || false,
        hasPrevPage: pagination.hasPrevPage || false
      }
    });
  };