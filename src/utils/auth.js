const auth = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith("Bearer "))
      return sendResponse(res, 403, "Failed", {
        message: "Invalid authorization method!",
      });
    const token = authHeader.split(" ")[1];
    if (!token || token === null) {
      return sendResponse(res, 403, "Failed", {
        message: "Authorization token not found!",
      });
    }
    jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
      if (err)
        return sendResponse(res, 403, "Failed", {
          message: `Invalid Bearer token / ${err.message}`,
        });
      const { iat, exp, ...rest } = decoded;
      const user = await userService.findOne({ _id: rest._id });
      if (!user) {
        return sendResponse(res, 400, "Failed", {
          message: "User not found!",
        });
      }
      if (!(user.token === token)) {
        return sendResponse(res, 403, "Failed", {
          message: "Multiple session not allowed. Please logout!",
        });
      }
      req.user = user;
      next();
    });
  };