"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/api/scheduler.ts
var require_scheduler = __commonJS({
  "src/api/scheduler.ts"() {
    "use strict";
    impro;
    var job = new CronJob(
      "* * * * * *",
      // cronTime
      function() {
        console.log("You will see this message every second");
      },
      // onTick
      null,
      // onComplete
      true,
      // start
      "America/Los_Angeles"
      // timeZone
    );
  }
});

// node_modules/.pnpm/@umijs+preset-umi@4.3.22_@types+node@20.16.5_@types+react@18.3.8_typescript@4.9.5_webpack@5.94.0/node_modules/@umijs/preset-umi/dist/features/apiRoute/utils.js
var require_utils = __commonJS({
  "node_modules/.pnpm/@umijs+preset-umi@4.3.22_@types+node@20.16.5_@types+react@18.3.8_typescript@4.9.5_webpack@5.94.0/node_modules/@umijs/preset-umi/dist/features/apiRoute/utils.js"(exports2, module2) {
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var utils_exports = {};
    __export2(utils_exports, {
      esbuildIgnorePathPrefixPlugin: () => esbuildIgnorePathPrefixPlugin,
      matchApiRoute: () => matchApiRoute2
    });
    module2.exports = __toCommonJS2(utils_exports);
    function esbuildIgnorePathPrefixPlugin() {
      return {
        name: "ignore-path-prefix",
        setup(build) {
          build.onResolve({ filter: /^@fs/ }, (args) => ({
            path: args.path.replace(/^@fs/, "")
          }));
        }
      };
    }
    function matchApiRoute2(apiRoutes2, path) {
      if (path.startsWith("/"))
        path = path.substring(1);
      if (path.startsWith("api/"))
        path = path.substring(4);
      const pathSegments = path.split("/").filter((p) => p !== "");
      if (pathSegments.length === 0 || pathSegments.length === 1 && pathSegments[0] === "api") {
        const route2 = apiRoutes2.find((r) => r.path === "/");
        if (route2)
          return { route: route2, params: {} };
        else
          return void 0;
      }
      const params = {};
      const route = apiRoutes2.find((route2) => {
        const routePathSegments = route2.path.split("/").filter((p) => p !== "");
        if (routePathSegments.length !== pathSegments.length)
          return false;
        for (let i = 0; i < routePathSegments.length; i++) {
          const routePathSegment = routePathSegments[i];
          if (routePathSegment.match(/^\[.*]$/)) {
            params[routePathSegment.substring(1, routePathSegment.length - 1)] = pathSegments[i];
            if (i == routePathSegments.length - 1)
              return true;
            continue;
          }
          if (routePathSegment !== pathSegments[i])
            return false;
          if (i == routePathSegments.length - 1)
            return true;
        }
      });
      if (route)
        return { route, params };
    }
  }
});

// node_modules/.pnpm/@umijs+preset-umi@4.3.22_@types+node@20.16.5_@types+react@18.3.8_typescript@4.9.5_webpack@5.94.0/node_modules/@umijs/preset-umi/dist/features/apiRoute/request.js
var require_request = __commonJS({
  "node_modules/.pnpm/@umijs+preset-umi@4.3.22_@types+node@20.16.5_@types+react@18.3.8_typescript@4.9.5_webpack@5.94.0/node_modules/@umijs/preset-umi/dist/features/apiRoute/request.js"(exports2, module2) {
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var request_exports = {};
    __export2(request_exports, {
      default: () => request_default,
      parseMultipart: () => parseMultipart,
      parseUrlEncoded: () => parseUrlEncoded
    });
    module2.exports = __toCommonJS2(request_exports);
    var import_utils = require_utils();
    var UmiApiRequest3 = class {
      constructor(req, apiRoutes2) {
        this._params = {};
        this._body = null;
        this._req = req;
        const m = (0, import_utils.matchApiRoute)(apiRoutes2, this.pathName || "");
        if (m)
          this._params = m.params;
      }
      get params() {
        return this._params;
      }
      get body() {
        return this._body;
      }
      get headers() {
        return this._req.headers;
      }
      get method() {
        return this._req.method;
      }
      get query() {
        var _a, _b;
        return ((_b = (_a = this._req.url) == null ? void 0 : _a.split("?")[1]) == null ? void 0 : _b.split("&").reduce((acc, cur) => {
          const [key, value] = cur.split("=");
          const k = acc[key];
          if (k) {
            if (k instanceof Array) {
              k.push(value);
            } else {
              acc[key] = [k, value];
            }
          } else {
            acc[key] = value;
          }
          return acc;
        }, {})) || {};
      }
      get cookies() {
        var _a;
        return (_a = this._req.headers.cookie) == null ? void 0 : _a.split(";").reduce((acc, cur) => {
          const [key, value] = cur.split("=");
          acc[key.trim()] = value;
          return acc;
        }, {});
      }
      get url() {
        return this._req.url;
      }
      get pathName() {
        var _a;
        return (_a = this._req.url) == null ? void 0 : _a.split("?")[0];
      }
      readBody() {
        if (this._req.headers["content-length"] === "0") {
          return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
          let body = [];
          this._req.on("data", (chunk) => {
            body.push(chunk);
          });
          this._req.on("end", () => {
            var _a, _b;
            const bodyBuffer = Buffer.concat(body);
            switch ((_a = this._req.headers["content-type"]) == null ? void 0 : _a.split(";")[0]) {
              case "application/json":
                try {
                  this._body = JSON.parse(bodyBuffer.toString());
                } catch (e) {
                  this._body = body;
                }
                break;
              case "multipart/form-data":
                const boundary = (_b = this.headers["content-type"]) == null ? void 0 : _b.split("boundary=")[1];
                if (!boundary) {
                  this._body = body;
                  break;
                }
                this._body = parseMultipart(bodyBuffer, boundary);
                break;
              case "application/x-www-form-urlencoded":
                this._body = parseUrlEncoded(bodyBuffer.toString());
                break;
              default:
                this._body = body;
                break;
            }
            resolve();
          });
          this._req.on("error", reject);
        });
      }
    };
    function parseMultipart(body, boundary) {
      const hexBoundary = Buffer.from(`--${boundary}`, "utf-8").toString("hex");
      return body.toString("hex").split(hexBoundary).reduce((acc, cur) => {
        var _a, _b;
        const [hexMeta, hexValue] = cur.split(
          Buffer.from("\r\n\r\n").toString("hex")
        );
        const meta = Buffer.from(hexMeta, "hex").toString("utf-8");
        const name = (_a = meta.split('name="')[1]) == null ? void 0 : _a.split('"')[0];
        if (!name)
          return acc;
        const fileName = (_b = meta.split('filename="')[1]) == null ? void 0 : _b.split('"')[0];
        if (fileName) {
          const fileBufferBeforeTrim = Buffer.from(hexValue, "hex");
          const fileBuffer = fileBufferBeforeTrim.slice(
            0,
            fileBufferBeforeTrim.byteLength - 2
          );
          const contentType = meta.split("Content-Type: ")[1];
          acc[name] = {
            fileName,
            data: fileBuffer,
            contentType
          };
          return acc;
        }
        const valueBufferBeforeTrim = Buffer.from(hexValue, "hex");
        const valueBuffer = valueBufferBeforeTrim.slice(
          0,
          valueBufferBeforeTrim.byteLength - 2
        );
        acc[name] = valueBuffer.toString("utf-8");
        return acc;
      }, {});
    }
    function parseUrlEncoded(body) {
      return body.split("&").reduce((acc, cur) => {
        const [key, value] = cur.split("=");
        acc[key] = decodeURIComponent(value);
        return acc;
      }, {});
    }
    var request_default = UmiApiRequest3;
  }
});

// node_modules/.pnpm/@umijs+preset-umi@4.3.22_@types+node@20.16.5_@types+react@18.3.8_typescript@4.9.5_webpack@5.94.0/node_modules/@umijs/preset-umi/dist/features/apiRoute/response.js
var require_response = __commonJS({
  "node_modules/.pnpm/@umijs+preset-umi@4.3.22_@types+node@20.16.5_@types+react@18.3.8_typescript@4.9.5_webpack@5.94.0/node_modules/@umijs/preset-umi/dist/features/apiRoute/response.js"(exports2, module2) {
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var response_exports = {};
    __export2(response_exports, {
      default: () => response_default
    });
    module2.exports = __toCommonJS2(response_exports);
    var UmiApiResponse3 = class {
      constructor(res) {
        this._res = res;
      }
      status(statusCode) {
        this._res.statusCode = statusCode;
        return this;
      }
      header(key, value) {
        this._res.setHeader(key, value);
        return this;
      }
      setCookie(key, value) {
        this._res.setHeader("Set-Cookie", `${key}=${value}; path=/`);
        return this;
      }
      end(data) {
        this._res.end(data);
        return this;
      }
      text(data) {
        this._res.setHeader("Content-Type", "text/plain; charset=utf-8");
        this._res.end(data);
        return this;
      }
      html(data) {
        this._res.setHeader("Content-Type", "text/html; charset=utf-8");
        this._res.end(data);
        return this;
      }
      json(data) {
        this._res.setHeader("Content-Type", "application/json");
        this._res.end(JSON.stringify(data));
        return this;
      }
    };
    var response_default = UmiApiResponse3;
  }
});

// node_modules/.pnpm/@umijs+preset-umi@4.3.22_@types+node@20.16.5_@types+react@18.3.8_typescript@4.9.5_webpack@5.94.0/node_modules/@umijs/preset-umi/dist/features/apiRoute/index.js
var require_apiRoute = __commonJS({
  "node_modules/.pnpm/@umijs+preset-umi@4.3.22_@types+node@20.16.5_@types+react@18.3.8_typescript@4.9.5_webpack@5.94.0/node_modules/@umijs/preset-umi/dist/features/apiRoute/index.js"(exports2, module2) {
    var __create2 = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __getProtoOf2 = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toESM2 = (mod, isNodeMode, target) => (target = mod != null ? __create2(__getProtoOf2(mod)) : {}, __copyProps2(
      // If the importer is in node compatibility mode or this is not an ESM
      // file that has been converted to a CommonJS file using a Babel-
      // compatible transform (i.e. "__esModule" has not been set), then set
      // "default" to the CommonJS "module.exports" for node compatibility.
      isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target,
      mod
    ));
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var apiRoute_exports = {};
    __export2(apiRoute_exports, {
      UmiApiRequest: () => import_request.default,
      UmiApiResponse: () => import_response.default,
      matchApiRoute: () => import_utils.matchApiRoute
    });
    module2.exports = __toCommonJS2(apiRoute_exports);
    var import_request = __toESM2(require_request());
    var import_response = __toESM2(require_response());
    var import_utils = require_utils();
  }
});

// src/.umi/api/scheduler.ts
var scheduler_exports = {};
__export(scheduler_exports, {
  default: () => scheduler_default
});
module.exports = __toCommonJS(scheduler_exports);

// src/.umi/api/_middlewares.ts
var middlewares_default = async (req, res, next) => {
  next();
};

// src/.umi/api/scheduler.ts
var import_scheduler = __toESM(require_scheduler());
var import_apiRoute = __toESM(require_apiRoute());
var apiRoutes = [{ "path": "v1/car_orders/color_top3", "id": "v1/car_orders/color_top3", "file": "v1/car_orders/color_top3.ts", "absPath": "/v1/car_orders/color_top3", "__content": "import type { UmiApiRequest, UmiApiResponse } from 'umi';\nimport { Sequelize, Op } from 'sequelize';\nimport model from '../../model';\n\nexport default async function (req: UmiApiRequest, res: UmiApiResponse) {\n  try {\n    let sqlText;\n    let latency;\n    if (req.method === 'GET') {\n      const result = await model.OLAPCarOrder.findAll({\n        where: {\n          [Op.and]: [\n            Sequelize.where(\n              Sequelize.fn('DATE', Sequelize.col('order_time')),\n              Sequelize.literal('CURRENT_DATE'),\n            ),\n          ],\n        },\n        group: 'car_color',\n        attributes: ['carColor', [Sequelize.fn('COUNT', 'car_color'), 'count']],\n        order: [['count', 'DESC']],\n        limit: 3,\n        logging: (sql, timing) => {\n          sqlText = sql?.replaceAll('Executed (default): ', '');\n          latency = timing;\n        },\n      });\n      res.status(200).json({\n        data: result,\n        sqlText,\n        latency,\n      });\n    } else {\n      res.status(405).json({ errorMessage: 'Method not allowed' });\n    }\n  } catch (err) {\n    console.log(err);\n    res.status(500).json({ errorMessage: 'Internal Server Error' });\n  }\n}\n" }, { "path": "v1/car_orders/latest", "id": "v1/car_orders/latest", "file": "v1/car_orders/latest.ts", "absPath": "/v1/car_orders/latest", "__content": "import type { UmiApiRequest, UmiApiResponse } from 'umi';\nimport { Op } from 'sequelize';\nimport { toNumber } from 'lodash';\nimport model from '../../model';\n\nexport default async function (req: UmiApiRequest, res: UmiApiResponse) {\n  try {\n    let sqlText;\n    let latency;\n    if (req.method === 'GET') {\n      const { orderId } = req.query || {};\n      if (orderId) {\n        const result = await model.OLAPCarOrder.findAll({\n          where: {\n            orderId: {\n              [Op.gt]: toNumber(orderId),\n            },\n          },\n          order: [['orderId', 'DESC']],\n          logging: (sql, timing) => {\n            sqlText = sql?.replaceAll('Executed (default): ', '');\n            latency = timing;\n          },\n        });\n        res.status(200).json({\n          data: result,\n          sqlText,\n          latency,\n        });\n      } else {\n        const result = await model.OLAPCarOrder.findAll({\n          order: [['orderId', 'DESC']],\n          limit: 10,\n          logging: (sql, timing) => {\n            sqlText = sql?.replaceAll('Executed (default): ', '');\n            latency = timing;\n          },\n        });\n        res.status(200).json({\n          data: result,\n          sqlText,\n          latency,\n        });\n      }\n    } else {\n      res.status(405).json({ errorMessage: 'Method not allowed' });\n    }\n  } catch (err) {\n    console.log(err);\n    res.status(500).json({ errorMessage: 'Internal Server Error' });\n  }\n}\n" }, { "path": "v1/car_orders/status", "id": "v1/car_orders/status", "file": "v1/car_orders/status.ts", "absPath": "/v1/car_orders/status", "__content": "import type { UmiApiRequest, UmiApiResponse } from 'umi';\nimport { toNumber } from 'lodash';\nimport model from '../../model';\n\nexport default async function (req: UmiApiRequest, res: UmiApiResponse) {\n  try {\n    const { orderId } = req.query || {};\n    let latencyTP;\n    let latencyAP;\n    if (req.method === 'GET') {\n      const lastestTPCarOrder = await model.OLTPCarOrder.findOne({\n        order: [['orderId', 'DESC']],\n        logging: (sql, timing) => {\n          latencyTP = timing;\n        },\n      });\n      const lastestAPCarOrder = await model.OLAPCarOrder.findOne({\n        order: [['orderId', 'DESC']],\n        logging: (sql, timing) => {\n          latencyAP = timing;\n        },\n      });\n      res\n        .status(200)\n        .header('X-TP-Sql-Latency', `${latencyTP}`)\n        .header('X-AP-Sql-Latency', `${latencyAP}`)\n        .json({\n          syncing: lastestAPCarOrder?.orderId !== lastestTPCarOrder?.orderId,\n          shouldRefresh: orderId\n            ? toNumber(orderId) !== lastestAPCarOrder?.orderId\n            : false,\n          latencyTP,\n          latencyAP,\n        });\n    } else {\n      res.status(405).json({ errorMessage: 'Method not allowed' });\n    }\n  } catch (err) {\n    console.log(err);\n    res.status(500).json({ errorMessage: 'Internal Server Error' });\n  }\n}\n" }, { "path": "v1/car_orders/batch", "id": "v1/car_orders/batch", "file": "v1/car_orders/batch.ts", "absPath": "/v1/car_orders/batch", "__content": "import type { UmiApiRequest, UmiApiResponse } from 'umi';\nimport model from '../../model';\n\nexport default async function (req: UmiApiRequest, res: UmiApiResponse) {\n  try {\n    let sqlText;\n    let latency;\n    if (req.method === 'POST') {\n      const carOrders = await model.OLTPCarOrder.bulkCreate(req.body, {\n        logging: (sql, timing) => {\n          sqlText = sql?.replaceAll('Executed (default): ', '');\n          latency = timing;\n        },\n      });\n      res.status(200).json({\n        data: carOrders,\n        sqlText,\n        latency,\n      });\n    } else {\n      res.status(405).json({ errorMessage: 'Method not allowed' });\n    }\n  } catch (err) {\n    console.log(err);\n    res.status(500).json({ errorMessage: 'Internal Server Error' });\n  }\n}\n" }, { "path": "v1/car_orders", "id": "v1/car_orders/index", "file": "v1/car_orders/index.ts", "absPath": "/v1/car_orders", "__content": "import type { UmiApiRequest, UmiApiResponse } from 'umi';\nimport model from '../../model';\n\nexport default async function (req: UmiApiRequest, res: UmiApiResponse) {\n  try {\n    let sqlText;\n    let latency;\n    if (req.method === 'GET') {\n      const carOrders = await model.OLAPCarOrder.findAll({\n        logging: (sql, timing) => {\n          sqlText = sql?.replaceAll('Executed (default): ', '');\n          latency = timing;\n        },\n      });\n      res.status(200).json({\n        data: carOrders,\n        sqlText,\n        latency,\n      });\n    } else if (req.method === 'POST') {\n      const carOrder = await model.OLTPCarOrder.create(req.body, {\n        logging: (sql, timing) => {\n          sqlText = sql?.replaceAll('Executed (default): ', '');\n          latency = timing;\n        },\n      });\n      res.status(200).json({\n        data: carOrder,\n        sqlText,\n        latency,\n      });\n    } else {\n      res.status(405).json({ errorMessage: 'Method not allowed' });\n    }\n  } catch (err) {\n    console.log(err);\n    res.status(500).json({ errorMessage: 'Internal Server Error' });\n  }\n}\n" }, { "path": "v1/car_orders/total", "id": "v1/car_orders/total", "file": "v1/car_orders/total.ts", "absPath": "/v1/car_orders/total", "__content": "import type { UmiApiRequest, UmiApiResponse } from 'umi';\nimport model from '../../model';\n\nexport default async function (req: UmiApiRequest, res: UmiApiResponse) {\n  try {\n    let sqlText;\n    let latency;\n    if (req.method === 'GET') {\n      const total = await model.OLAPCarOrder.count({\n        logging: (sql, timing) => {\n          sqlText = sql?.replaceAll('Executed (default): ', '');\n          latency = timing;\n        },\n      });\n      res.status(200).json({\n        total,\n        sqlText,\n        latency,\n      });\n    } else {\n      res.status(405).json({ errorMessage: 'Method not allowed' });\n    }\n  } catch (err) {\n    console.log(err);\n    res.status(500).json({ errorMessage: 'Internal Server Error' });\n  }\n}\n" }, { "path": "scheduler", "id": "scheduler", "file": "scheduler.ts", "absPath": "/scheduler", "__content": "" }, { "path": "model", "id": "model", "file": "model.ts", "absPath": "/model", "__content": "import { Sequelize, DataTypes } from 'sequelize';\nimport mysql2 from 'mysql2';\n\nconst oltp = new Sequelize(process.env.OLTP_DATABASE_URL as string, {\n  benchmark: true,\n  logging: false,\n  dialectModule: mysql2,\n});\nconst olap = new Sequelize(process.env.OLAP_DATABASE_URL as string, {\n  benchmark: true,\n  logging: false,\n  dialectModule: mysql2,\n});\n\nconst option = {\n  orderId: {\n    field: 'order_id',\n    type: DataTypes.BIGINT,\n    autoIncrement: true,\n    primaryKey: true,\n    allowNull: false,\n  },\n  orderTime: {\n    field: 'order_time',\n    type: DataTypes.TIME,\n    allowNull: false,\n  },\n  carPrice: {\n    field: 'car_price',\n    type: DataTypes.DECIMAL,\n    allowNull: false,\n  },\n  carColor: {\n    field: 'car_color',\n    type: DataTypes.STRING,\n    allowNull: false,\n  },\n  saleRegion: {\n    field: 'sale_region',\n    type: DataTypes.STRING,\n    allowNull: false,\n  },\n  saleNation: {\n    field: 'sale_nation',\n    type: DataTypes.STRING,\n    allowNull: false,\n  },\n  customerName: {\n    field: 'customer_name',\n    type: DataTypes.STRING,\n    allowNull: false,\n  },\n};\n\nconst OLTPCarOrder = oltp.define('tp_car_orders', option, {\n  timestamps: false,\n});\nconst OLAPCarOrder = olap.define('ap_car_orders', option, {\n  timestamps: false,\n});\n\nexport default { OLTPCarOrder, OLAPCarOrder };\n" }];
var scheduler_default = async (req, res) => {
  const umiReq = new import_apiRoute.UmiApiRequest(req, apiRoutes);
  await umiReq.readBody();
  const umiRes = new import_apiRoute.UmiApiResponse(res);
  await new Promise((resolve) => middlewares_default(umiReq, umiRes, resolve));
  await (0, import_scheduler.default)(umiReq, umiRes);
};
