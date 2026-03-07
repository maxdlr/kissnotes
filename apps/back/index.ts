import dotenv from "dotenv";
import "reflect-metadata";

// console.clear();
dotenv.config({ path: "../../.env" });

import registerGlobals from "@/services/registerGlobals";
registerGlobals();

import routes from "@/routes";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import setCors from "@/services/cors";
import { AppDataSource } from "@/services/database/datasource";
import { requestLogger } from "@/services/requestLogger";
import serviceErrorHandler from "@/services/serviceErrorHandlers";
import wrapRoutesHandlers from "@/services/wrapRoutesHandlers";
import printStartupInfo from "@/utils/printStartupInfo";
import { loadFixtures } from "@/services/fixtures";
import { TryCatch } from "@/decorators/TryCatch";

/**
 * ======================
 * 0 - Init Express
 * ======================
 */
const app = express();
const port =
  process.env.NODE_ENV === "test" ? 0 : process.env.BACK_PORT || 8080;

/**
 * ======================
 * 2 - Cors
 * ======================
 */
app.use((req: any, res, next) => {
  setCors(req, res);
  return req.method === "OPTIONS" ? res.sendStatus(200) : next();
});

/**
 * ======================
 * 3 - Cookie Parser
 * ======================
 */
app.use(cookieParser(process.env.COOKIE_SECRET));

/**
 * ======================
 * 4 - Body Parser
 * ======================
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * ======================
 * BodyParser
 * ======================
 */
const customBodyParser = (req: Request, res: Response, next: NextFunction) => {
  const url = req.originalUrl;
  let limit = "250kb"; // default limit

  // set custom limit based on URL
  if (url.includes("/signed-liquidation/") || url.includes("/liquidations/")) {
    limit = "25mb";
  }

  if (url.includes("/dsns")) {
    limit = "25mb";
  }

  // use body-parser with custom limit
  bodyParser.json({ limit })(req, res, next);
};

app.use(customBodyParser);

/**
 * ======================
 * Event Emitters
 * ======================
 */

/**
 * ======================
 * 6 - Routes
 * ======================
 */
// Wrap all routes handlers to catch errors even if there are no try/catch blocks
app.use(requestLogger);
wrapRoutesHandlers(routes);
app.use("/api", routes);

/**
 * ======================
 * Error Management
 * ======================
 */
app.use(serviceErrorHandler);

/**
 * ======================
 * TypeOrm
 * ======================
 */

AppDataSource.initialize()
  .then(async () => await loadFixtures())
  .catch((error) => console.trace(error));

/**
 * ======================
 * Listener!
 * ======================
 */
// if (process.env.NODE_ENV === 'development') {
//   if (!process.env.SSL_CRT_FOLDER) {
//     console.error('You need to provide a SSL_CRT_FOLDER');
//     exit(1);
//   }
//
//   const options = {
//     key: fs.readFileSync(__dirname + '/certs/localhost-key.pem'),
//     cert: fs.readFileSync(__dirname + '/certs/localhost.pem'),
//     ca: fs.readFileSync(process.env.SSL_CRT_FOLDER + '/rootCA.pem'),
//   };
//
//
//   https.createServer(options, app).listen(port, () => {
//     printStartupInfo(port, true);
//   });
// } else {
//   app.listen(port, () => {
//     printStartupInfo(port, false);
//   });
// }
//

app.listen(port, () => printStartupInfo(port, true));
