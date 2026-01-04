import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit("my-limited-request");

    if (!success) {
      res.set("Retry-After", "60"); // Tells the client to wait 60 seconds
      return res.status(429).json({ message: "Too many requests" });
    }
    next();
  } catch (error) {
    console.log("limit error ", { error });
    next(error);
  }
};

export default rateLimiter;
