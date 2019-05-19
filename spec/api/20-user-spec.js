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

describe("USER REST API", function () {

  describe("[ GET    ] /user/:userId", function () {

    let api;

    let userId;
    let authorization;

    let login;
    let password;

    let $testClient;

    beforeEach(function (done) {

      api = jasmine.startTestApi();
      $testClient = jasmine.createTestClient();

      login = $testClient.uniqueLogin();
      password = $testClient.generatePassword();

      $testClient.initUser(login, password, function (err, d) {
        if (err) return done(err);
        userId = d.UserId;
        authorization = d.TokenKey;
        done();
      });

    });

    afterEach(function (done) {
      api.server.close(done);
    });

    it("RETURNS `HTTP/1.1 403 Forbidden` WHEN `Authorization` HEADER IS NOT PROVIDED", function (done) {
      $testClient.$get(null, `/user/${userId}`, function (err, res) {
        expect(res.statusCode).toBe(403);
        done();
      });
    });

    it("RETURNS `HTTP/1.1 200 OK` WHEN `Authorization` HEADER IS PROVIDED", function (done) {
      $testClient.$get(authorization, `/user/${userId}`, function (err, res) {
        expect(res.statusCode).toBe(200);
        done();
      });
    });

    it("RETURNS `HTTP/1.1 404 Not Found` WHEN REQUESTED `userId` DOES NOT BELONG TO THE AUTHORIZED USER", function (done) {
      let differentLogin = $testClient.uniqueLogin();
      let differentPassword = $testClient.generatePassword();
      $testClient.initUser(differentLogin, differentPassword, function (err, d) {
        if (err) return done(err);
        $testClient.$get(authorization, `/user/${d.UserId}`, function (err, res) {
          if (err) return done(err);
          expect(res.statusCode).toBe(200);
          done();
        });
      });

    });

  });

});
