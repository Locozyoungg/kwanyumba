import requestIp from "request-ip";
import useragent from "useragent";

export const trackUserDevice = (req, res, next) => {
  req.clientInfo = {
    ip: requestIp.getClientIp(req),
    device: useragent.parse(req.headers["user-agent"]).toString(),
  };
  next();
};
