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

const crypt = require("bcryptjs");
const v4uuid = require("uuid/v4");

const UsernameNotAvailableError = require("./error/usernameNotAvailable");

const RESERVED_LOGINS = require("../../etc/reserved.usernames.json");

function registerUser (myjournal) {

  const api = myjournal.expressApp;
  const db = myjournal.db;
  const events = myjournal.events;
  const authz = myjournal.authz;

  const User = db.User;
  const Hash = db.Hash;

  return function (req, res) {
    let username = req.body.Email.toLowerCase();
    let password = pwHash(req.body.NewPassword);

    let tsNow = Math.floor(Date.now()/1000);

    let user;
    let hash;

    let userId = v4uuid();
    let hashId = v4uuid();

    checkUsernameAvailability(username)
      .then(createUser)
      .then(createUserPassword)
      .then(registrationComplete)
      .catch(userRegistrationError);

    function createUser () {
      user = new User({
        Id: userId,
        Login: username,
        Created: tsNow,
      });

      return user.save();
    }

    function createUserPassword () {
      hash = new Hash({
        Id: hashId,
        Value: password,
        OwnerId: userId,
      });

      return hash.save();
    }

    function registrationComplete (d) {
      events.emit("signup:success", [
        hash,
        user,
      ]);
      res.status(202).send("");
    }

    function userRegistrationError (err) {
      res.status(400).send({
        ErrorMsg: err.message,
      });
    }
  }

  /**
   * Check Username Availability
   * @param {string} username The username to check
   * @returns {Promise}
   */
  function checkUsernameAvailability (username) {
    return new Promise((resolve, reject) => {
      if (username.length < 5 || reservedLogin(username)) {
        return reject(new UsernameNotAvailableError(
          "Invalid username"
        ));
      }

      db.fetchUserByLogin(username)
        .then(checkUsername)
        .catch(reject);

      function checkUsername (user) {
        if (!user) {
          return resolve({
            Login: username,
            Available: true,
          });
        }

        reject(new UsernameNotAvailableError(
          `Username (${username}) is already taken`
        ));
      }
    });
  }

  /**
   * Check Reserved Login
   * Checks if a username is a reserved name (cannot be registered)
   * @param {string} username
   * @returns {boolean} True if reserved, otherwise False
   */
  function reservedLogin (username) {
    let login = username.toLowerCase();
    return RESERVED_LOGINS.indexOf(login) > -1;
  }

  /**
   * Hash Password
   * @param {string} password to hash
   * @returns {string}
   */
  function pwHash (password) {
    let salt = crypt.genSaltSync(10);
    return crypt.hashSync(password, salt);
  }
}

module.exports = registerUser;
