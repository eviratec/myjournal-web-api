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

module.exports = function ResourceDb (db) {

  const bookshelf = db._bookshelf;

  let Resource = bookshelf.Model.extend({
    tableName: 'resources',
    constructor: function() {
      bookshelf.Model.apply(this, arguments);
      this.on('saving', function(model, attrs, options) {
        options.query.where('Id', '=', model.get("Id"));
      });
    },
    Owner: function() {
      return this.hasOne(db.ResourceOwner, "ResourceId", "Id");
    },
  });

  db.Resource = Resource;

  function fetchResourceById (id) {
    return new Promise((resolve, reject) => {
      Resource.where({"Id": id})
        .fetch({withRelated: ["Owner"]})
        .then(resolve)
        .catch(reject);
    });
  }

  db.fetchResourceById = fetchResourceById;

  function fetchResourceByUri (uri) {
    return new Promise((resolve, reject) => {
      Resource.where({"Uri": uri})
        .fetchAll({withRelated: ["Owner"]})
        .then(resolve)
        .catch(reject);
    });
  }

  db.fetchResourceByUri = fetchResourceByUri;

};
