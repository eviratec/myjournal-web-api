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

module.exports = function (myJournal) {

  const api = myJournal.expressApp;
  const db = myJournal.db;

  api.use(function (req, res, next) {

    let authPt;

    req.authorized = false;
    req.authUser = null;
    req.authToken = null;

    if (!req.headers["authorization"]) {
      return next();
    }

    db.fetchTokenByKey(req.headers["authorization"])
      .then(function (token) {

        if (!token) {
          return next();
        }

        req.authorized = true;
        req.authUser = token.related("User");
        req.authToken = token;

        next();

      })
      .catch(function (err) {
        console.log(err);
        next();
      });

  });

  api.param(["subTypeName"], function (req, res, next, id) {
    req.subTypeName = id;
    next();
  });

  api.param(["subTypeName", "subTypeId"], function (req, res, next, id) {
    req.subTypeId = id;
    next();
  });

  api.param(["appId"], function (req, res, next, id) {

    req.appModel = null;

    db.fetchDetailedAppById(id)
      .then(function (app) {
        req.appModel = app;
        next();
      })
      .catch(function (err) {
        next();
      });

  });

  api.param("userId", function (req, res, next, id) {

    req.user = null;

    db.fetchUserById(id)
      .then(function (user) {
        req.user = user;
        next();
      })
      .catch(function (err) {
        next();
      });

  });

  api.param("apiId", function (req, res, next, id) {

    req.apiModel = null;

    db.fetchApiById(id, { withRelated: ["App"] })
      .then(function (api) {
        req.apiModel = api;
        next();
      })
      .catch(function (err) {
        next();
      });

  });

  api.param("schemaId", function (req, res, next, id) {

    req.schemaModel = null;

    db.fetchSchemaById(id, { withRelated: ["Schema"] })
      .then(function (schema) {
        req.schemaModel = schema;
        next();
      })
      .catch(function (err) {
        next();
      });

  });

  api.param("operationId", function (req, res, next, id) {

    req.operationModel = null;

    db.fetchOperationById(id)
      .then(function (op) {
        req.operationModel = op;
        next();
      })
      .catch(function (err) {
        console.log(err);
        res.sendStatus(500).send({
          ErrorMsg: `NO_OPERATION: No Operation found with ID ${id}`,
        });
      });

  });


  api.param("clientId", function (req, res, next, id) {

    req.clientModel = null;

    db.fetchClientById(id)
      .then(function (client) {
        req.clientModel = client;
        next();
      })
      .catch(function (err) {
        next();
      });

  });

  api.param("authAttemptId", function (req, res, next, id) {

    req.authAttempt = null;

    db.fetchAuthAttemptById(id)
      .then(function (authAttempt) {
        req.authAttempt = authAttempt;
        next();
      })
      .catch(function (err) {
        console.log(err);
        next();
      });

  });

};
