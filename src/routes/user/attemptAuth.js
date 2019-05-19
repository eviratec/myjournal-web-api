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

const v4uuid = require("uuid/v4");

function attemptAuth (myjournal) {

  const api = myjournal.expressApp;
  const db = myjournal.db;
  const events = myjournal.events;
  const authz = myjournal.authz;
  const authN = myjournal.authN;

  const AuthAttempt = db.AuthAttempt;
  const Token = db.Token;

  return function (req, res) {
    if (!req.body.Login || !req.body.Password) {
      return res.status(400)
        .send({ ErrorMsg: "ERR_INCOMPLETE: Missing Login or Password" });
    }

    let login = req.body.Login;
    let password = req.body.Password;
    let attemptId = v4uuid();
    let tokenId = v4uuid();

    // Attempt to verify login/password
    authN.verify(login, password)
      .then(onValidAuthN)
      .catch(onAuthNError);

    // On valid login/password combination
    function onValidAuthN (user) {
      events.emit("auth/attempt:success", {
        Id: attemptId,
        Login: login,
        TokenId: tokenId,
      });

      // Attempt to create a token
      createToken(user, 86400)
        .then(onTokenCreated)
        .catch(onTokenError);
    }

    // On token created
    function onTokenCreated (token) {
      returnAuthAttempt(attemptId);
    }

    // On token creation error
    function onTokenError (err) {
      returnServerError(err);
    }

    // On invalid login/password combination
    function onAuthNError (err) {
      events.emit("auth/attempt:error", {
        Id: attemptId,
        Login: login,
        Error: err.message,
      });

      returnRequestError(err);
    }

    // Return HTTP/1.1 400 - Bad Request
    function returnRequestError (err) {
      res.status(400).send({ ErrorMsg: err.message });
    }

    // Return HTTP/1.1 500 - Internal Server Error
    function returnServerError (err) {
      res.status(500).send({ ErrorMsg: err.message });
    }

    // Return HTTP/1.1 200 - Success
    function returnAuthAttempt (attemptId) {
      db.fetchAuthAttemptById(attemptId)
        .then(authAttempt => res.returnNewObject(authAttempt))
        .catch(returnServerError);
    }

    // Create Token
    function createToken (user, expiry) {
      let tsNow = Math.floor(Date.now()/1000);
      let token = Token.forge({
        Id: tokenId,
        UserId: user.get("Id"),
        Key: `${tokenId}/${user.get("Id")}/${tsNow}`,
        Created: tsNow,
        Expiry: expiry || 3600,
      });

      return token.save();
    }
  }

}

module.exports = attemptAuth;
