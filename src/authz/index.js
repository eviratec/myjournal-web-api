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

module.exports = function (db) {

  const v4uuid = require("uuid/v4");

  const VERIFICATION_FAILED = "Verification Failed";
  const VERIFICATION_ERROR = "Unable to perform verification";
  const RESOURCE_URI_REGISTERED = "Resource Uri Registered"

  return {

    VERIFICATION_FAILED: VERIFICATION_FAILED,

    VERIFICATION_ERROR: VERIFICATION_ERROR,

    RESOURCE_URI_REGISTERED: RESOURCE_URI_REGISTERED,

    /**
     * authz.registerOwnership()
     *
     * Register a `ResourceUri` as owned by `OwnerId`
     *
     * # Example Usage
     *
     * ```javascript
     * let uri = "/user/123/profile";
     * let ownerId = "USER_123";
     * authz.registerOwnership(uri, ownerId)
     *   .then(function () {
     *     // success
     *   })
     *   .catch(function (error) {
     *     if (authz.RESOURCE_URI_REGISTERED === error.message) {
     *       // Resource URI already registered
     *     }
     *   });
     * ```
     *
     * @param  {String} ResourceUri [description]
     * @param  {String} OwnerId [description]
     * @return {Promise} [description]
     */
    registerOwnership: function registerOwnership (ResourceUri, OwnerId) {
      return new Promise((resolve, reject) => {
        ResourceUri = ResourceUri.toLowerCase();
        ifUnregistered(ResourceUri)
          .then(function () {
            let resourceId;
            createResource(ResourceUri)
              .then(function (resource) {
                resourceId = resource.get("Id");
                return createResourceOwner(resourceId, OwnerId);
              })
              .then(function () {
                resolve(resourceId);
              })
              .catch(reject);
          })
          .catch(function (error) {
            if (RESOURCE_URI_REGISTERED === error) {
              return reject(new Error(RESOURCE_URI_REGISTERED));
            }
            reject(error);
          });
      });
    },

    /**
     * authz.verifyOwnership()
     *
     * Verify a `ResourceUri` is owned by `OwnerId`
     *
     * # Example Usage
     *
     * ```javascript
     * let uri = "/user/123/profile";
     * let ownerId = "USER_123";
     * authz.verifyOwnership(uri, ownerId)
     *   .then(function () {
     *     // success
     *   })
     *   .catch(function (error) {
     *     if (authz.VERIFICATION_FAILED === error.message) {
     *       // Verification failed
     *     }
     *   });
     * ```
     *
     * @param  {String} ResourceUri [description]
     * @param  {String} OwnerId [description]
     * @return {Promise} [description]
     */
    verifyOwnership: function verifyOwnership (ResourceUri, OwnerId) {
      return new Promise((resolve, reject) => {
        ResourceUri = ResourceUri.toLowerCase();
        getResourceByUri(ResourceUri)
          .then(function (resource) {
            resource = resource.at(0);
            if (OwnerId === resource.related("Owner").get("OwnerId")) {
              return resolve(resource.get("Uri"));
            }
            reject(new Error(VERIFICATION_FAILED));
          })
          .catch(function (err) {
            reject(new Error(VERIFICATION_ERROR + ": " + err.message));
          });
      });
    },

  };

  function createResourceOwner (ResourceId, OwnerId) {
    let res = new db.ResourceOwner({
      Id: v4uuid(),
      ResourceId: ResourceId,
      OwnerId: OwnerId,
      Created: Date.now(),
    });
    return res.save();
  }

  function createResource (ResourceUri) {
    let res = new db.Resource({
      Id: v4uuid(),
      Uri: ResourceUri,
      Created: Date.now(),
    });
    return res.save();
  }

  function getResourceByUri (uri) {
    return new Promise((resolve, reject) => {
      db.fetchResourceByUri(uri)
        .then(function (resource) {
          resolve(resource);
        })
        .catch(function (err) {
          console.log(err);
        });
    });
  }

  function ifUnregistered (ResourceUri) {
    return new Promise((resolve, reject) => {
      getResourceByUri(ResourceUri)
        .then(function (resource) {
          if (0 === resource.length) {
            return resolve();
          }
          reject(RESOURCE_URI_REGISTERED);
        })
        .catch(reject);
    });
  }

}
