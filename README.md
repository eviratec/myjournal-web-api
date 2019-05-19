# MyJournal Web API

Web API for MyJournal by Eviratec

## Install

1. Install dependencies: `$ npm install`
2. Create a new MySQL database
3. Import SQL tables from files in `/src/sql`
4. Define DB connection environment variables: `MYJOURNAL_DB_HOST`, `MYJOURNAL_DB_USER`, `MYJOURNAL_DB_PASS`, and `MYJOURNAL_DB_NAME` (e.g. `$ export MYJOURNAL_DB_HOST=localhost`)
5. Test installation: `$ ./bin/test.sh`
6. Start server `$ ./bin/webapi.sh`

## Test

1. Follow installation instructions above
2. Run tests with `$ ./bin/test.sh`

## License

```
Copyright (c) 2019 Callan Peter Milne

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
```
