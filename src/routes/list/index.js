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

function addListRoutes (myjournal) {
  const api = myjournal.expressApp;

  let routes = [

    // Create List
    ["post", "/lists", require("./createList")],

    // Delete List
    ["delete", "/list/:listId", require("./deleteListById")],

    // Fetch Lists
    ["get", "/lists/all", require("./fetchAllLists")],
    ["get", "/list/:listId", require("./fetchListById")],
    ["get", "/list/:parentId/lists", require("./fetchListsByParentId")],
    ["get", "/category/:categoryId/lists", require("./fetchListsByCatId")],

    // List Properties
    ["get", "/list/:listId/details", require("./fetchListDetailsById")],

    // Change list properties
    ["put", "/list/:listId/title", require("./changeListTitleById")],
    ["put", "/list/:listId/details", require("./changeListDetailsById")],
    ["put", "/list/:listId/completed", require("./changeListCompletedById")],

  ];

  routes.forEach(route => {
    let method = route[0];
    let uri = route[1];
    let fn = route[2];

    api[method](uri, api.requireAuth, fn(myjournal));
  });
}

module.exports = addListRoutes;
