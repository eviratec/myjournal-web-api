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

describe("ENTRY REST API", function () {

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

  describe("/entries", function () {

    let journalData;
    let journal;
    let journalId;

    let entryData;

    beforeEach(function (done) {
      entryData = {
        Summary: "My Test Entry",
      };
      journalData = {
        Name: "My Test Journal",
      };
      $testClient.$post(authorization, `/journals`, journalData, function (err, res) {
        journal = res.d;
        journalId = journal.Id;

        entryData.JournalId = journalId;

        done();
      });
    });

    describe("createEntry <POST> with valid parameters", function () {

      describe("top-level entries", function () {

        it("RETURNS `HTTP/1.1 403 Forbidden` WHEN `Authorization` HEADER IS NOT PROVIDED", function (done) {
          $testClient.$post(null, `/entries`, entryData, function (err, res) {
            expect(res.statusCode).toBe(403);
            done();
          });
        });

        it("RETURNS `HTTP/1.1 200 OK` WHEN `Authorization` HEADER IS PROVIDED", function (done) {
          $testClient.$post(authorization, `/entries`, entryData, function (err, res) {
            expect(res.statusCode).toBe(200);
            done();
          });
        });

        it("RETURNS AN OBJECT IN THE RESPONSE BODY FOR A SUCCESSFUL REQUEST", function (done) {
          $testClient.$post(authorization, `/entries`, entryData, function (err, res) {
            expect(res.statusCode).toBe(200);
            expect(res.d).toEqual(jasmine.any(Object));
            done();
          });
        });

        it("RETURNS AN `Id` PROPERTY IN THE RESPONSE BODY OBJECT FOR A SUCCESSFUL REQUEST", function (done) {
          $testClient.$post(authorization, `/entries`, entryData, function (err, res) {
            expect(res.statusCode).toBe(200);
            expect(res.d).toEqual(jasmine.objectContaining({
              "Id": jasmine.any(String),
            }));
            done();
          });
        });

        it("CREATES A ENTRY REACHABLE USING THE `Id` PROPERTY IN THE RESPONSE BODY", function (done) {
          $testClient.$post(authorization, `/entries`, entryData, function (err, res) {
            let entryId = res.d.Id;
            $testClient.$get(authorization, `/entry/${entryId}`, function (err, res) {
              expect(res.statusCode).toBe(200);
              done();
            });
          });
        });

        it("SETS THE CORRECT VALUE FOR THE `Summary` PROPERTY", function (done) {
          $testClient.$post(authorization, `/entries`, entryData, function (err, res) {
            let entryId = res.d.Id;
            $testClient.$get(authorization, `/entry/${entryId}`, function (err, res) {
              expect(res.d.Summary).toBe("My Test Entry");
              done();
            });
          });
        });

        it("ADDS THE ENTRY TO THE JOURNAL'S ENTRIES PROPERTY", function (done) {
          $testClient.$post(authorization, `/entries`, entryData, function (err, res) {
            let entryId = res.d.Id;
            $testClient.$get(authorization, `/journal/${journalId}`, function (err, res) {
              expect(res.statusCode).toBe(200);
              expect(res.d).toEqual(jasmine.objectContaining({
                "Entries": jasmine.arrayContaining([
                  jasmine.objectContaining({
                    "Id": entryId,
                  }),
                ]),
              }));
              done();
            });
          });
        });

        it("ADDS THE ENTRY TO THE JOURNAL'S LIST OF ENTRIES", function (done) {
          $testClient.$post(authorization, `/entries`, entryData, function (err, res) {
            let entryId = res.d.Id;
            $testClient.$get(authorization, `/journal/${journalId}/entries`, function (err, res) {
              expect(res.statusCode).toBe(200);
              expect(res.d).toEqual(jasmine.arrayContaining([
                jasmine.objectContaining({
                  "Id": entryId,
                }),
              ]));
              done();
            });
          });
        });

      });

    });

    describe("/entry/:entryId", function () {

      describe("updating entry properties", function () {

        let entryId;
        let entryData;

        beforeEach(function (done) {
          entryData = {
            Summary: "Test Entry",
            JournalId: journalId,
          };
          $testClient.$post(authorization, `/entries`, entryData, function (err, res) {
            entryId = res.d.Id;
            done();
          });
        });

        describe("changing the value for the 'Occurred' property", function () {

          describe("to 'now'", function () {

            it("RETURNS `HTTP/1.1 200 OK`", function (done) {
              let data = {
                newValue: "now",
              };
              $testClient.$put(authorization, `/entry/${entryId}/occurred`, data, function (err, res) {
                expect(res.statusCode).toBe(200);
                done();
              });
            });

            it("UPDATES THE VALUE CORRECTLY", function (done) {
              let data = {
                newValue: "now",
              };
              $testClient.$put(authorization, `/entry/${entryId}/occurred`, data, function (err, res) {
                $testClient.$get(authorization, `/entry/${entryId}`, function (err, res) {
                  expect(res.d.Occurred).toEqual(jasmine.any(Number));
                  done();
                });
              });
            });

          });

          describe("to a timestamp", function () {

            let timestamp;

            beforeEach(function () {
              timestamp = Math.floor(Date.now()/1000);
            });

            it("RETURNS `HTTP/1.1 200 OK`", function (done) {
              let data = {
                newValue: timestamp,
              };
              $testClient.$put(authorization, `/entry/${entryId}/occurred`, data, function (err, res) {
                expect(res.statusCode).toBe(200);
                done();
              });
            });

            it("UPDATES THE VALUE CORRECTLY", function (done) {
              let data = {
                newValue: timestamp,
              };
              $testClient.$put(authorization, `/entry/${entryId}/occurred`, data, function (err, res) {
                $testClient.$get(authorization, `/entry/${entryId}`, function (err, res) {
                  expect(res.d.Occurred).toBe(timestamp);
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
              $testClient.$put(authorization, `/entry/${entryId}/occurred`, data, function (err, res) {
                expect(res.statusCode).toBe(200);
                done();
              });
            });

            it("UPDATES THE VALUE CORRECTLY", function (done) {
              let data = {
                newValue: null,
              };
              $testClient.$put(authorization, `/entry/${entryId}/occurred`, data, function (err, res) {
                $testClient.$get(authorization, `/entry/${entryId}`, function (err, res) {
                  expect(res.d.Occurred).toBe(null);
                  done();
                });
              });
            });

          });

        });

        describe("changing the value for the 'Summary' property", function () {

          it("RETURNS `HTTP/1.1 200 OK`", function (done) {
            let data = {
              newValue: "New Entry Summary",
            };
            $testClient.$put(authorization, `/entry/${entryId}/summary`, data, function (err, res) {
              expect(res.statusCode).toBe(200);
              done();
            });
          });

          it("UPDATES THE VALUE CORRECTLY", function (done) {
            let data = {
              newValue: "New Entry Summary",
            };
            $testClient.$put(authorization, `/entry/${entryId}/summary`, data, function (err, res) {
              $testClient.$get(authorization, `/entry/${entryId}`, function (err, res) {
                expect(res.d.Summary).toBe("New Entry Summary");
                done();
              });
            });
          });

        });

      });

      describe("deleting entries", function () {

        let entryId;
        let entryData;

        beforeEach(function (done) {
          entryData = {
            Summary: "Test Entry",
            JournalId: journalId,
          };
          $testClient.$post(authorization, `/entries`, entryData, function (err, res) {
            entryId = res.d.Id;
            done();
          });
        });

        describe("as the resource owner", function () {

          it("RETURNS `HTTP/1.1 403 Forbidden` WHEN `Authorization` HEADER IS NOT PROVIDED", function (done) {
            $testClient.$delete(null, `/entry/${entryId}`, function (err, res) {
              expect(res.statusCode).toBe(403);
              done();
            });
          });

          describe("successful request", function () {

            it("RETURNS `HTTP/1.1 200 OK` WHEN `Authorization` HEADER IS PROVIDED", function (done) {
              $testClient.$delete(authorization, `/entry/${entryId}`, function (err, res) {
                expect(res.statusCode).toBe(200);
                done();
              });
            });

            it("REMOVES THE ENTRY FROM THE JOURNAL'S ENTRIES PROPERTY", function (done) {
              $testClient.$delete(authorization, `/entry/${entryId}`, function (err, res) {
                $testClient.$get(authorization, `/journal/${journalId}`, function (err, res) {
                  expect(res.statusCode).toBe(200);
                  expect(res.d).not.toEqual(jasmine.objectContaining({
                    "Entries": jasmine.arrayContaining([
                      jasmine.objectContaining({
                        "Id": entryId,
                      }),
                    ]),
                  }));
                  done();
                });
              });
            });

            it("REMOVES THE ENTRY FROM THE JOURNAL'S LIST OF ENTRIES", function (done) {
              $testClient.$delete(authorization, `/entry/${entryId}`, function (err, res) {
                $testClient.$get(authorization, `/journal/${journalId}/entries`, function (err, res) {
                  expect(res.statusCode).toBe(200);
                  expect(res.d).not.toEqual(jasmine.arrayContaining([
                    jasmine.objectContaining({
                      "Id": entryId,
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
