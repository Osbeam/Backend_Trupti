// exports.sendResponse = (res, code, message, data) => {
//     const response = {
//       status: {
//         code,
//         message,
//       },
//     };
//     if (data) {
//       response.data = data;
//     }
//     return res.status(code).json(response);
//   };




exports.sendResponse = (res, code, message, data) => {
  if (data) {
    data = data;
  }
  return res.status(code).json(data);
};