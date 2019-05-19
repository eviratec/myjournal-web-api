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

module.exports = function TokenDb (db) {

  const bookshelf = db._bookshelf;

  let Token = bookshelf.Model.extend({
    tableName: 'tokens',
    constructor: function() {
      bookshelf.Model.apply(this, arguments);
      this.on('saving', function(model, attrs, options) {
        options.query.where('Id', '=', model.get("Id"));
      });
    },
    User: function() {
      return this.hasOne(db.User, "Id", "UserId");
    },
  });

  db.Token = Token;

  function fetchTokenByKey (key) {
    return new Promise((resolve, reject) => {
      Token.where({"Key": key})
        .fetch({withRelated: ["User"]})
        .then(resolve)
        .catch(reject);
    });
  };

  db.fetchTokenByKey = fetchTokenByKey;

  function fetchTokenById (id) {
    return new Promise((resolve, reject) => {
      Token.where({"Id": id})
        .fetch({withRelated: ["User"]})
        .then(resolve)
        .catch(reject);
    });
  };

  db.fetchTokenById = fetchTokenById;

};
