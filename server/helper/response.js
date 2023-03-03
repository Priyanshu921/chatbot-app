export const response = {
  data: {},
  statusCode: 200,
  errors: {},
  global_error: '',
  message: '',
};
export const apiResponse =(res,data) =>  res.status(data.statusCode).json({...response,...data})