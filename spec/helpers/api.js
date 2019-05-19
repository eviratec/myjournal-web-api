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

(function (jasmine) {

  const DEFAULT_TEST_API_PORT = 9999;
  const APPLICATION_JSON = "application/json";

  const http = require("http");

  const TestApi = require("../../");

  class ApiTestClient {
    constructor (remotePort) {
      this.remoteAddress = "127.0.0.1";
      this.remotePort = remotePort || DEFAULT_TEST_API_PORT;
    }

    uniqueLogin () {
      return `test-${Date.now()}@localhost`;
    }

    generatePassword () {
      return `!!${Date.now()}R${Math.random()}@$!`;
    }

    login (login, password, cb) {
      let d = {
        Login: login,
        Password: password,
      };
      this.$post(null, "/auth/attempts", d, (err, res) => {
        if (err) return cb(err);
        cb(undefined, {
          TokenKey: res.d.Token.Key,
          UserId: res.d.Token.UserId,
          Login: res.d.Login,
        });
      });
      return this;
    }

    initUser (login, password, cb) {
      this.signup(login, password, (err, res) => {
        this.login(login, password, (err, res) => {
          cb(err,res);
        });
      });
    }

    signup (login, password, cb) {
      let d = {
        Email: login,
        NewPassword: password,
      };
      this.$post(null, "/signups", d, cb);
      return this;
    }

    $get (authorization, path, cb) {
      const options = {
        hostname: this.remoteAddress,
        port: this.remotePort,
        path: path,
        method: "GET",
        headers: {
          "Accept": APPLICATION_JSON
        }
      };

      if (authorization) {
        options.headers["Authorization"] = authorization;
      }

      setTimeout(() => {

        let req = http.request(options, function (res) {
          res.setEncoding("utf8");
          res.d = "";
          res.on("data", function (chunk) {
            res.d += chunk;
          });
          res.on("end", function () {
            let d = res.d;
            if (res.d) {
              try {
                res.d = JSON.parse(res.d);
              }
              catch (e) {
                res.d = d;
              }
            }
            cb(undefined, res);
          });
        });

        req.on("error", (e) => {
          console.error(`problem with request: ${e.message}`);
          cb(e);
        });

        req.end();

      }, 50);

    }

    $post (authorization, path, data, cb) {
      const postData = JSON.stringify(data);
      const options = {
        hostname: this.remoteAddress,
        port: this.remotePort,
        path: path,
        method: "POST",
        headers: {
          "Content-Type": APPLICATION_JSON,
          "Content-Length": Buffer.byteLength(postData)
        }
      };

      if (authorization) {
        options.headers["Authorization"] = authorization;
      }

      const req = http.request(options, (res) => {
        res.setEncoding("utf8");
        res.d = "";
        res.on("data", (chunk) => {
          res.d += chunk;
        });
        res.on("end", () => {
          if (res.d) {
            try {
              res.d = JSON.parse(res.d);
            }
            catch (e) {}
          }
          cb(undefined, res);
        });
      });

      req.on("error", (e) => {
        console.error(`problem with request: ${e.message}`);
        cb(e);
      });

      req.write(postData);
      req.end();
    }

    $put (authorization, path, body, cb) {
      const putData = JSON.stringify(body);
      const options = {
        hostname: this.remoteAddress,
        port: this.remotePort,
        path: path,
        method: "PUT",
        headers: {
          "Content-Type": APPLICATION_JSON,
          "Content-Length": Buffer.byteLength(putData)
        }
      };

      if (authorization) {
        options.headers["Authorization"] = authorization;
      }

      const req = http.request(options, (res) => {
        res.setEncoding("utf8");
        res.d = "";
        res.on("data", (chunk) => {
          res.d += chunk;
        });
        res.on("end", () => {
          if (res.d) {
            try {
              res.d = JSON.parse(res.d);
            }
            catch (e) {}
          }
          cb(undefined, res);
        });
      });

      req.on("error", (e) => {
        console.error(`problem with request: ${e.message}`);
        cb(e);
      });

      req.write(putData);
      req.end();
    }

    $delete (authorization, path, cb) {
      const options = {
        hostname: this.remoteAddress,
        port: this.remotePort,
        path: path,
        method: "DELETE",
        headers: {
          "Accept": APPLICATION_JSON
        }
      };

      if (authorization) {
        options.headers["Authorization"] = authorization;
      }

      setTimeout(() => {

        let req = http.request(options, function (res) {
          res.setEncoding("utf8");
          res.d = "";
          res.on("data", function (chunk) {
            res.d += chunk;
          });
          res.on("end", function () {
            let d = res.d;
            if (res.d) {
              try {
                res.d = JSON.parse(res.d);
              }
              catch (e) {
                res.d = d;
              }
            }
            cb(undefined, res);
          });
        });

        req.on("error", (e) => {
          console.error(`problem with request: ${e.message}`);
          cb(e);
        });

        req.end();

      }, 50);

    }
  }

  jasmine.startTestApi = function (port) {
    return TestApi(port || DEFAULT_TEST_API_PORT);
  }

  jasmine.createTestClient = function (port) {
    let testClient = new ApiTestClient(port);
    return testClient;
  }

})(jasmine);
