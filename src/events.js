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

  const db = myJournal.db;
  const AuthAttempt = db.AuthAttempt;

  const EventEmitter = require("events");

  class MyJournalEmitter extends EventEmitter {
    constructor () {
      super();
    }
  }

  let events = myJournal.events = new MyJournalEmitter();

  events.addListener("auth/attempt:success", function (d) {
    async(function () {
      AuthAttempt.forge({
        Id: d.Id,
        Login: d.Login,
        Finished: true,
        Error: null,
        TokenId: d.TokenId,
        Created: Math.floor(Date.now()/1000),
      }).save();
    });
  });

  events.addListener("auth/attempt:error", function (d) {
    async(function () {
      AuthAttempt.forge({
        Id: d.Id,
        Login: d.Login,
        Finished: true,
        Error: d.Error,
        TokenId: null,
        Created: Math.floor(Date.now()/1000),
      }).save();
    });
  });

  events.addListener("resource:created", function (uri, createdByUserId) {
    async(function () {
      myJournal.authz.registerOwnership(uri, createdByUserId);
      if (uri.split(/\//g).length !== 5) {
        return;
      }
      myJournal.authz.registerOwnership("/"+uri.split(/\//g).slice(3,2).join("/"), createdByUserId);
    });
  });

  events.addListener("signup:success", function (d) {
    async(function () {
      let user = d[1];
      let userLogin = user.get("Login");
      // console.log("signup:success");
      // console.log(`New user account created <${userLogin}>`);
    });
  });

  function async (f) {
    process.nextTick(function () {
      try {
        f && f();
      }
      catch (err) {
        console.log(err);
      }
    });
  }

}
