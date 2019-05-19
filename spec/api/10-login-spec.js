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

describe("AUTHENTICATION REST API", function () {

  describe("[ POST   ] /auth/attempts", function () {

    let api;

    let validLogin;
    let validPassword;

    let invalidLogin;
    let invalidPassword;

    let $testClient;

    beforeEach(function (done) {

      api = jasmine.startTestApi();
      $testClient = jasmine.createTestClient();

      validLogin = $testClient.uniqueLogin();
      validPassword = $testClient.generatePassword();

      invalidLogin = $testClient.uniqueLogin();
      invalidPassword = $testClient.generatePassword();

      $testClient.signup(validLogin, validPassword, function (err, res) {
        if (err) return done(err);
        done();
      });

    });

    afterEach(function (done) {
      api.server.close(done);
    });

    it("RETURNS `HTTP/1.1 400 Bad Request` WHEN THE LOGIN IS INVALID", function (done) {
      let d = {
        Login: invalidLogin,
        Password: invalidPassword,
      };
      $testClient.$post(null, "/auth/attempts", d, function (err, res) {
        expect(res.statusCode).toBe(400);
        done();
      });
    });

    it("RETURNS `HTTP/1.1 400 Bad Request` WHEN THE PASSWORD IS INCORRECT", function (done) {
      let d = {
        Login: validLogin,
        Password: invalidPassword,
      };
      $testClient.$post(null, "/auth/attempts", d, function (err, res) {
        expect(res.statusCode).toBe(400);
        done();
      });
    });

    it("RETURNS `HTTP/1.1 200 OK` WHEN THE ATTEMPT IS SUCCESSFUL", function (done) {
      let d = {
        Login: validLogin,
        Password: validPassword,
      };
      $testClient.$post(null, "/auth/attempts", d, function (err, res) {
        expect(res.statusCode).toBe(200);
        done();
      });
    });

    it("INCLUDES A `Token` IN THE BODY OF A SUCCESSFUL AUTH ATTEMPT", function (done) {
      let d = {
        Login: validLogin,
        Password: validPassword,
      };
      $testClient.$post(null, "/auth/attempts", d, function (err, res) {
        if (err) return done(err);
        expect(res.statusCode).toBe(200);
        expect(res.d).toEqual(jasmine.objectContaining({
          Token: jasmine.objectContaining({
            Id: jasmine.any(String),
            Key: jasmine.any(String),
            Created: jasmine.any(Number),
            Expiry: jasmine.any(Number),
          }),
        }));
        done();
      });
    });

  });

});
