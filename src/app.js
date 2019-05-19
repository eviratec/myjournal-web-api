/**
 * Copyright (c) 2019 Callan Peter Milne
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 * OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

const SERVER_NAME = require("./const/SERVER_NAME.js");
const SERVER_PROTOCOL = require("./const/SERVER_PROTOCOL.js");
const POWERED_BY = require("./const/POWERED_BY.js");

const LOCAL_REDIRECT_BASE = `${SERVER_PROTOCOL}://${SERVER_NAME}`;

const CORS = require("./const/CORS.js");

const LOCATION = "Location";
const CACHE_CONTROL = "no-store";
const VARY = "Origin";

class MyJournal {
  constructor () {

    const bcrypt = require("bcryptjs");
    const express = require("express");

    this.bcrypt = bcrypt;

    this.expressApp = express();

    this.expressApp.use(require("body-parser").json());

    this.expressApp.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", CORS.allow.origin);
      res.header("Access-Control-Allow-Headers", CORS.allow.headers);
      res.header("Access-Control-Allow-Methods", CORS.allow.methods);
      res.header("Access-Control-Max-Age", CORS.max.age);
      res.header("Access-Control-Allow-Credentials", CORS.allow.credentials);
      res.header("Access-Control-Expose-Headers", CORS.expose.headers);
      res.header("Vary", VARY);
      res.header("Cache-Control", CACHE_CONTROL);
      res.header("X-Powered-By", POWERED_BY);
      if ("options" !== req.method.toLowerCase()) {
        return next();
      }
      res.send(200);
    });

    this.expressApp.use(function(req, res, next) {
      res.localRedirect = function (location) {
        res.setHeader(LOCATION, `${LOCAL_REDIRECT_BASE}${location}`);
        res.status(303).send("");
      };
      next();
    });

    this.expressApp.use(function(req, res, next) {
      res.returnNewObject = function (object) {
        res.status(200).send(object);
      };
      next();
    });

    function requireAuth (req, res, next) {
      if (!req.authorized) {
        return res.sendStatus(403);
      }
      next();
    }

    this.expressApp.requireAuth = requireAuth;

    this.db = require("./db")();
    this.authz = require("./authz")(this.db);
    this.authN = require("./authN")(this.db);

    require("./events")(this);
    require("./params")(this);
    require("./routes")(this);

  }
}

module.exports = MyJournal;
