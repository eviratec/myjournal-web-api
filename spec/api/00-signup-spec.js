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

describe("SIGNUP REST API", function () {

  describe("[ POST   ] /signups", function () {

    let api;
    let urlBase;

    let $testClient;


    beforeEach(function () {
      api = jasmine.startTestApi();
      $testClient = jasmine.createTestClient();
    });

    afterEach(function (done) {
      api.server.close(done);
    });

    it("RETURNS `HTTP/1.1 202 Accepted` ON SUCCESS", function (done) {
      let d = {
        Email: "test-" + Date.now() + "@localhost",
        NewPassword: "$t3$71Ng1-2_E",
      };
      $testClient.$post(null, "/signups", d, function (err, res) {
        expect(res.statusCode).toBe(202);
        done();
      });
    });

    it("RETURNS `HTTP/1.1 400 Bad Request` WHEN THE EMAIL IS TAKEN", function (done) {
      let d = {
        Email: "test-" + Date.now() + "@localhost",
        NewPassword: "$t3$71Ng1-2_E",
      };
      $testClient.$post(null, "/signups", d, function (err, res) {
        $testClient.$post(null, "/signups", d, function (err, res) {
          expect(res.statusCode).toBe(400);
          done();
        });
      });
    });

    it("RETURNS `HTTP/1.1 400 Bad Request` WHEN THE EMAIL IS RESTRICTED", function (done) {
      let d = {
        Email: "admin",
        NewPassword: "$t3$71Ng1-2_E",
      };
      $testClient.$post(null, "/signups", d, function (err, res) {
        expect(res.statusCode).toBe(400);
        done();
      });
    });

  });

});
