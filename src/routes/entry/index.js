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

function addEntryRoutes (myjournal) {
  const api = myjournal.expressApp;

  let routes = [

    // Create Entry
    ["post", "/entries", require("./createEntry")],

    // Delete Entry
    ["delete", "/entry/:entryId", require("./deleteEntryById")],

    // Fetch Entries
    ["get", "/entries/all", require("./fetchAllEntries")],
    ["get", "/entry/:entryId", require("./fetchEntryById")],
    ["get", "/journal/:journalId/entries", require("./fetchEntriesByJournalId")],

    // Entry Properties
    ["get", "/entry/:entryId/details", require("./fetchEntryDetailsById")],

    // Change entry properties
    ["put", "/entry/:entryId/summary", require("./changeEntrySummaryById")],
    ["put", "/entry/:entryId/details", require("./changeEntryDetailsById")],
    ["put", "/entry/:entryId/occurred", require("./changeEntryOccurredById")],

  ];

  routes.forEach(route => {
    let method = route[0];
    let uri = route[1];
    let fn = route[2];

    api[method](uri, api.requireAuth, fn(myjournal));
  });
}

module.exports = addEntryRoutes;
