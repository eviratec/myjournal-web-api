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

describe("CATEGORY REST API", function () {

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

  describe("/categories", function () {

    let d;

    beforeEach(function () {
      d = {
        Name: "My Test Category",
      };
    });

    describe("createCategory <POST> with valid parameters", function () {

      it("RETURNS `HTTP/1.1 403 Forbidden` WHEN `Authorization` HEADER IS NOT PROVIDED", function (done) {
        $testClient.$post(null, `/categories`, d, function (err, res) {
          expect(res.statusCode).toBe(403);
          done();
        });
      });

      it("RETURNS `HTTP/1.1 200 OK` WHEN `Authorization` HEADER IS PROVIDED", function (done) {
        $testClient.$post(authorization, `/categories`, d, function (err, res) {
          expect(res.statusCode).toBe(200);
          done();
        });
      });

      describe("successful request", function () {

        describe("response body", function () {

          it("is an object", function (done) {
            $testClient.$post(authorization, `/categories`, d, function (err, res) {
              expect(res.statusCode).toBe(200);
              expect(res.d).toEqual(jasmine.any(Object));
              done();
            });
          });

          it("has the correct value for property 'Name'", function (done) {
            $testClient.$post(authorization, `/categories`, d, function (err, res) {
              expect(res.statusCode).toBe(200);
              expect(res.d).toEqual(jasmine.objectContaining({
                Name: "My Test Category",
              }));
              done();
            });
          });

        });

        describe("subsequent requests", function () {
          describe("to /categories/all", function () {
            it("should include the newly created category", function (done) {
              $testClient.$post(authorization, `/categories`, d, function (err, res) {
                let Id = res.d.Id;
                $testClient.$get(authorization, `/categories/all`, function (err, res) {
                  expect(res.d).toEqual(jasmine.arrayContaining([
                    jasmine.objectContaining({
                      Id: Id,
                      Name: "My Test Category",
                    }),
                  ]));
                  done();
                });
              });
            });
          });
        });

      });

    });

  });

  describe("/categories/all", function () {

    describe("fetchAllCategories <GET>", function () {

      it("RETURNS `HTTP/1.1 403 Forbidden` WHEN `Authorization` HEADER IS NOT PROVIDED", function (done) {
        $testClient.$get(null, `/categories/all`, function (err, res) {
          expect(res.statusCode).toBe(403);
          done();
        });
      });

      it("RETURNS `HTTP/1.1 200 OK` WITH AN ARRAY WHEN `Authorization` HEADER IS PROVIDED", function (done) {
        $testClient.$get(authorization, `/categories/all`, function (err, res) {
          expect(res.statusCode).toBe(200);
          expect(Array.isArray(res.d)).toBe(true);
          done();
        });
      });

    });

  });

  describe("/category/:categoryId", function () {

    let categoryData;
    let category;
    let categoryId;

    beforeEach(function (done) {
      categoryData = {
        Name: "My Test Category",
      };
      $testClient.$post(authorization, `/categories`, categoryData, function (err, res) {
        category = res.d;
        categoryId = category.Id;
        done();
      });
    });

    describe("updating category properties", function () {

      describe("changing the value for the 'Name' property", function () {

        it("RETURNS `HTTP/1.1 200 OK`", function (done) {
          let data = {
            newValue: "New Category Name",
          };
          $testClient.$put(authorization, `/category/${categoryId}/name`, data, function (err, res) {
            expect(res.statusCode).toBe(200);
            done();
          });
        });

        it("UPDATES THE VALUE CORRECTLY", function (done) {
          let data = {
            newValue: "New Category Name",
          };
          $testClient.$put(authorization, `/category/${categoryId}/name`, data, function (err, res) {
            $testClient.$get(authorization, `/category/${categoryId}`, function (err, res) {
              expect(res.d.Name).toBe("New Category Name");
              done();
            });
          });
        });

      });

    });

    describe("deleting categories", function () {

      it("RETURNS `HTTP/1.1 403 Forbidden` WHEN `Authorization` HEADER IS NOT PROVIDED", function (done) {
        $testClient.$delete(null, `/category/${categoryId}`, function (err, res) {
          expect(res.statusCode).toBe(403);
          done();
        });
      });

      describe("as the resource owner", function () {

        describe("successful request", function () {

          it("RETURNS `HTTP/1.1 200 OK` WHEN `Authorization` HEADER IS PROVIDED", function (done) {
            $testClient.$delete(authorization, `/category/${categoryId}`, function (err, res) {
              expect(res.statusCode).toBe(200);
              done();
            });
          });

          describe("subsequent requests", function () {
            describe("to /categories/all", function () {
              it("should not include the deleted category", function (done) {
                $testClient.$delete(authorization, `/category/${categoryId}`, function (err, res) {
                  $testClient.$get(authorization, `/categories/all`, function (err, res) {
                    expect(res.d).not.toEqual(jasmine.arrayContaining([
                      jasmine.objectContaining({
                        Id: categoryId,
                        Name: "My Test Category",
                      }),
                    ]));
                    done();
                  });
                });
              });
            });
          });

        });

      });

    });

  });

});
