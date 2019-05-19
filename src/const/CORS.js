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

const CORS_ALLOW_ORIGIN = "*";
const CORS_MAX_AGE = "-1";
const CORS_ALLOW_CREDENTIALS = "true";
const CORS_ALLOW_METHODS = [
  "GET",
  "PUT",
  "POST",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
].join(", ");
const CORS_EXPOSE_HEADERS = [
  "Location",
].join(", ");
const CORS_ALLOW_HEADERS = [
  "Origin",
  "X-Requested-With",
  "Content-Type",
  "Referer",
  "Accept",
  "Authorization",
  "User-Agent",
].join(", ");

module.exports = (function () {

  return {
    max: {
      age: CORS_MAX_AGE,
    },
    allow: {
      origin: CORS_ALLOW_ORIGIN,
      credentials: CORS_ALLOW_CREDENTIALS,
      methods: CORS_ALLOW_METHODS,
      headers: CORS_ALLOW_HEADERS,
    },
    expose: {
      headers: CORS_EXPOSE_HEADERS,
    },
  };

})();
