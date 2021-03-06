import express from "express";
import {RequestHandler, Request} from "express";

///! add time stamp
export const requestTimeMW: RequestHandler = (req, _, next) => {
  (req as {requestTime: Date} & Request).requestTime = new Date()
  next();
};

///! print the current resquest info
export const loggerMW: RequestHandler = (req, res, next) => {
  try {
    console.log(`[Server]: incoming request ===== ${req.url} ==>>>`);
    console.log(`[Server]: method: ${req.method}`)
    console.log(`[Server]: ip: ${req.ip}`)


    if (isTimedRequest(req)) {
      console.log(`[Server]: request time: ${req.requestTime}`)
    }
    next();
  } catch (e) {
    console.log("[Server Error] no time log");

    console.log(`[Server]: ====================================<<<`);
    res.status(200).json({
      msg: "ok",
      detail: "failed to log time"
    });
  }
};


export const isTimedRequest = (req: Request): req is {requestTime: Date} & Request => {
  return (req as {[key: string]: any}).requestTime !== undefined;
};
