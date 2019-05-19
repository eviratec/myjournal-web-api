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

describe("LIST REST API", function () {

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

  describe("/lists", function () {

    let categoryData;
    let category;
    let categoryId;

    let listData;

    beforeEach(function (done) {
      listData = {
        Title: "My Test List",
      };
      categoryData = {
        Title: "My Test Category",
      };
      $testClient.$post(authorization, `/categories`, categoryData, function (err, res) {
        category = res.d;
        categoryId = category.Id;

        listData.CategoryId = categoryId;

        done();
      });
    });

    describe("createList <POST> with valid parameters", function () {

      describe("top-level lists", function () {

        it("RETURNS `HTTP/1.1 403 Forbidden` WHEN `Authorization` HEADER IS NOT PROVIDED", function (done) {
          $testClient.$post(null, `/lists`, listData, function (err, res) {
            expect(res.statusCode).toBe(403);
            done();
          });
        });

        it("RETURNS `HTTP/1.1 200 OK` WHEN `Authorization` HEADER IS PROVIDED", function (done) {
          $testClient.$post(authorization, `/lists`, listData, function (err, res) {
            expect(res.statusCode).toBe(200);
            done();
          });
        });

        it("RETURNS AN OBJECT IN THE RESPONSE BODY FOR A SUCCESSFUL REQUEST", function (done) {
          $testClient.$post(authorization, `/lists`, listData, function (err, res) {
            expect(res.statusCode).toBe(200);
            expect(res.d).toEqual(jasmine.any(Object));
            done();
          });
        });

        it("RETURNS AN `Id` PROPERTY IN THE RESPONSE BODY OBJECT FOR A SUCCESSFUL REQUEST", function (done) {
          $testClient.$post(authorization, `/lists`, listData, function (err, res) {
            expect(res.statusCode).toBe(200);
            expect(res.d).toEqual(jasmine.objectContaining({
              "Id": jasmine.any(String),
            }));
            done();
          });
        });

        it("CREATES A LIST REACHABLE USING THE `Id` PROPERTY IN THE RESPONSE BODY", function (done) {
          $testClient.$post(authorization, `/lists`, listData, function (err, res) {
            let listId = res.d.Id;
            $testClient.$get(authorization, `/list/${listId}`, function (err, res) {
              expect(res.statusCode).toBe(200);
              done();
            });
          });
        });

        it("ADDS THE LIST TO THE CATEGORY'S LISTS PROPERTY", function (done) {
          $testClient.$post(authorization, `/lists`, listData, function (err, res) {
            let listId = res.d.Id;
            $testClient.$get(authorization, `/category/${categoryId}`, function (err, res) {
              expect(res.statusCode).toBe(200);
              expect(res.d).toEqual(jasmine.objectContaining({
                "Lists": jasmine.arrayContaining([
                  jasmine.objectContaining({
                    "Id": listId,
                  }),
                ]),
              }));
              done();
            });
          });
        });

        it("ADDS THE LIST TO THE CATEGORY'S LIST OF LISTS", function (done) {
          $testClient.$post(authorization, `/lists`, listData, function (err, res) {
            let listId = res.d.Id;
            $testClient.$get(authorization, `/category/${categoryId}/lists`, function (err, res) {
              expect(res.statusCode).toBe(200);
              expect(res.d).toEqual(jasmine.arrayContaining([
                jasmine.objectContaining({
                  "Id": listId,
                }),
              ]));
              done();
            });
          });
        });

      });

      describe("nested lists", function () {

        let parentListData;
        let parentList;
        let parentListId;

        let childListData;

        beforeEach(function (done) {
          childListData = {
            Title: "My Test Child List",
          };
          parentListData = {
            Title: "My Test Parent List",
          };
          $testClient.$post(authorization, `/lists`, parentListData, function (err, res) {
            parentList = res.d;
            parentListId = parentList.Id;

            childListData.ParentId = parentListId;

            done();
          });
        });

        it("RETURNS `HTTP/1.1 403 Forbidden` WHEN `Authorization` HEADER IS NOT PROVIDED", function (done) {
          $testClient.$post(null, `/lists`, childListData, function (err, res) {
            expect(res.statusCode).toBe(403);
            done();
          });
        });

        it("RETURNS `HTTP/1.1 200 OK` WHEN `Authorization` HEADER IS PROVIDED", function (done) {
          $testClient.$post(authorization, `/lists`, childListData, function (err, res) {
            expect(res.statusCode).toBe(200);
            done();
          });
        });

        it("RETURNS AN OBJECT IN THE RESPONSE BODY FOR A SUCCESSFUL REQUEST", function (done) {
          $testClient.$post(authorization, `/lists`, childListData, function (err, res) {
            expect(res.statusCode).toBe(200);
            expect(res.d).toEqual(jasmine.any(Object));
            done();
          });
        });

        it("RETURNS AN `Id` PROPERTY IN THE RESPONSE BODY OBJECT FOR A SUCCESSFUL REQUEST", function (done) {
          $testClient.$post(authorization, `/lists`, childListData, function (err, res) {
            expect(res.statusCode).toBe(200);
            expect(res.d).toEqual(jasmine.objectContaining({
              "Id": jasmine.any(String),
            }));
            done();
          });
        });

        it("CREATES A LIST REACHABLE USING THE `Id` PROPERTY IN THE RESPONSE BODY", function (done) {
          $testClient.$post(authorization, `/lists`, childListData, function (err, res) {
            let listId = res.d.Id;
            $testClient.$get(authorization, `/list/${listId}`, function (err, res) {
              expect(res.statusCode).toBe(200);
              done();
            });
          });
        });

        it("ADDS THE LIST TO THE PARENT'S LISTS PROPERTY", function (done) {
          $testClient.$post(authorization, `/lists`, childListData, function (err, res) {
            let listId = res.d.Id;
            $testClient.$get(authorization, `/list/${parentListId}`, function (err, res) {
              expect(res.statusCode).toBe(200);
              expect(res.d).toEqual(jasmine.objectContaining({
                "Lists": jasmine.arrayContaining([
                  jasmine.objectContaining({
                    "Id": listId,
                  }),
                ]),
              }));
              done();
            });
          });
        });

        it("ADDS THE LIST TO THE PARENTS'S LIST OF LISTS", function (done) {
          $testClient.$post(authorization, `/lists`, childListData, function (err, res) {
            let listId = res.d.Id;
            $testClient.$get(authorization, `/list/${parentListId}/lists`, function (err, res) {
              expect(res.statusCode).toBe(200);
              expect(res.d).toEqual(jasmine.arrayContaining([
                jasmine.objectContaining({
                  "Id": listId,
                }),
              ]));
              done();
            });
          });
        });

      });

    });

    describe("/list/:listId", function () {

      describe("updating list properties", function () {

        let listId;
        let listData;

        beforeEach(function (done) {
          listData = {
            Title: "Test List",
            CategoryId: categoryId,
          };
          $testClient.$post(authorization, `/lists`, listData, function (err, res) {
            listId = res.d.Id;
            done();
          });
        });

        describe("changing the value for the 'Completed' property", function () {

          describe("to 'now'", function () {

            it("RETURNS `HTTP/1.1 200 OK`", function (done) {
              let data = {
                newValue: "now",
              };
              $testClient.$put(authorization, `/list/${listId}/completed`, data, function (err, res) {
                expect(res.statusCode).toBe(200);
                done();
              });
            });

            it("UPDATES THE VALUE CORRECTLY", function (done) {
              let data = {
                newValue: "now",
              };
              $testClient.$put(authorization, `/list/${listId}/completed`, data, function (err, res) {
                $testClient.$get(authorization, `/list/${listId}`, function (err, res) {
                  expect(res.d.Completed).toEqual(jasmine.any(Number));
                  done();
                });
              });
            });

          });

          describe("to null", function () {

            it("RETURNS `HTTP/1.1 200 OK`", function (done) {
              let data = {
                newValue: null,
              };
              $testClient.$put(authorization, `/list/${listId}/completed`, data, function (err, res) {
                expect(res.statusCode).toBe(200);
                done();
              });
            });

            it("UPDATES THE VALUE CORRECTLY", function (done) {
              let data = {
                newValue: null,
              };
              $testClient.$put(authorization, `/list/${listId}/completed`, data, function (err, res) {
                $testClient.$get(authorization, `/list/${listId}`, function (err, res) {
                  expect(res.d.Completed).toBe(null);
                  done();
                });
              });
            });

          });

        });

        describe("changing the value for the 'Name' property", function () {

          it("RETURNS `HTTP/1.1 200 OK`", function (done) {
            let data = {
              newValue: "New List Title",
            };
            $testClient.$put(authorization, `/list/${listId}/title`, data, function (err, res) {
              expect(res.statusCode).toBe(200);
              done();
            });
          });

          it("UPDATES THE VALUE CORRECTLY", function (done) {
            let data = {
              newValue: "New List Title",
            };
            $testClient.$put(authorization, `/list/${listId}/title`, data, function (err, res) {
              $testClient.$get(authorization, `/list/${listId}`, function (err, res) {
                expect(res.d.Title).toBe("New List Title");
                done();
              });
            });
          });

        });

      });

      describe("deleting top-level lists", function () {

        let listId;
        let listData;

        beforeEach(function (done) {
          listData = {
            Title: "Test List",
            CategoryId: categoryId,
          };
          $testClient.$post(authorization, `/lists`, listData, function (err, res) {
            listId = res.d.Id;
            done();
          });
        });

        describe("as the resource owner", function () {

          it("RETURNS `HTTP/1.1 403 Forbidden` WHEN `Authorization` HEADER IS NOT PROVIDED", function (done) {
            $testClient.$delete(null, `/list/${listId}`, function (err, res) {
              expect(res.statusCode).toBe(403);
              done();
            });
          });

          describe("successful request", function () {

            it("RETURNS `HTTP/1.1 200 OK` WHEN `Authorization` HEADER IS PROVIDED", function (done) {
              $testClient.$delete(authorization, `/list/${listId}`, function (err, res) {
                expect(res.statusCode).toBe(200);
                done();
              });
            });

            it("REMOVES THE LIST FROM THE CATEGORY'S LISTS PROPERTY", function (done) {
              $testClient.$delete(authorization, `/list/${listId}`, function (err, res) {
                $testClient.$get(authorization, `/category/${categoryId}`, function (err, res) {
                  expect(res.statusCode).toBe(200);
                  expect(res.d).not.toEqual(jasmine.objectContaining({
                    "Lists": jasmine.arrayContaining([
                      jasmine.objectContaining({
                        "Id": listId,
                      }),
                    ]),
                  }));
                  done();
                });
              });
            });

            it("REMOVES THE LIST FROM THE CATEGORY'S LIST OF LISTS", function (done) {
              $testClient.$delete(authorization, `/list/${listId}`, function (err, res) {
                $testClient.$get(authorization, `/category/${categoryId}/lists`, function (err, res) {
                  expect(res.statusCode).toBe(200);
                  expect(res.d).not.toEqual(jasmine.arrayContaining([
                    jasmine.objectContaining({
                      "Id": listId,
                    }),
                  ]));
                  done();
                });
              });
            });

          });

        });

      });

      describe("deleting nested lists", function () {

        let parentListData;
        let parentList;
        let parentListId;

        let listId;
        let listData;

        beforeEach(function (done) {
          listData = {
            Title: "My Test Child List",
          };
          parentListData = {
            Title: "My Test Parent List",
          };
          $testClient.$post(authorization, `/lists`, parentListData, function (err, res) {
            parentList = res.d;
            parentListId = parentList.Id;

            listData.ParentId = parentListId;
            $testClient.$post(authorization, `/lists`, listData, function (err, res) {
              listId = res.d.Id;
              done();
            });
          });
        });

        describe("as the resource owner", function () {

          it("RETURNS `HTTP/1.1 403 Forbidden` WHEN `Authorization` HEADER IS NOT PROVIDED", function (done) {
            $testClient.$delete(null, `/list/${listId}`, function (err, res) {
              expect(res.statusCode).toBe(403);
              done();
            });
          });

          describe("successful request", function () {

            it("RETURNS `HTTP/1.1 200 OK` WHEN `Authorization` HEADER IS PROVIDED", function (done) {
              $testClient.$delete(authorization, `/list/${listId}`, function (err, res) {
                expect(res.statusCode).toBe(200);
                done();
              });
            });

            it("REMOVES THE LIST FROM THE PARENT'S LISTS PROPERTY", function (done) {
              $testClient.$delete(authorization, `/list/${listId}`, function (err, res) {
                $testClient.$get(authorization, `/list/${parentListId}`, function (err, res) {
                  expect(res.statusCode).toBe(200);
                  expect(res.d).not.toEqual(jasmine.objectContaining({
                    "Lists": jasmine.arrayContaining([
                      jasmine.objectContaining({
                        "Id": listId,
                      }),
                    ]),
                  }));
                  done();
                });
              });
            });

            it("REMOVES THE LIST FROM THE PARENT'S LIST OF LISTS", function (done) {
              $testClient.$delete(authorization, `/list/${listId}`, function (err, res) {
                $testClient.$get(authorization, `/list/${parentListId}/lists`, function (err, res) {
                  expect(res.statusCode).toBe(200);
                  expect(res.d).not.toEqual(jasmine.arrayContaining([
                    jasmine.objectContaining({
                      "Id": listId,
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
