"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/*
 * This file contains logic for transforming / migrating a saved object document.
 *
 * At first, it may seem as if this could be a simple filter + reduce operation,
 * running the document through a linear set of transform functions until it is
 * up to date, but there are some edge cases that make it more complicated.
 *
 * A transform can add a new property, rename an existing property, remove a property, etc.
 * This means that we aren't able to do a reduce over a fixed list of properties, as
 * each transform operation could essentially change what transforms should be applied
 * next.
 *
 * The basic algorithm, then, is this:
 *
 * While there are any unmigrated properties in the doc, find the next unmigrated property,
 * and run the doc through the transforms that target that property.
 *
 * This way, we keep looping until there are no transforms left to apply, and we properly
 * handle property addition / deletion / renaming.
 *
 * A caveat is that this means we must restrict what a migration can do to the doc's
 * migrationVersion itself. We allow only these kinds of changes:
 *
 * - Add a new property to migrationVersion
 * - Move a migrationVersion property forward to a later version
 *
 * Migrations *cannot* move a migrationVersion property backwards (e.g. from 2.0.0 to 1.0.0), and they
 * cannot clear a migrationVersion property, as allowing either of these could produce infinite loops.
 * However, we do wish to allow migrations to modify migrationVersion if they wish, so that
 * they could transform a type from "foo 1.0.0" to  "bar 3.0.0".
 *
 * One last gotcha is that any docs which have no migrationVersion are assumed to be up-to-date.
 * This is because Kibana UI and other clients really can't be expected build the migrationVersion
 * in a reliable way. Instead, callers of our APIs are expected to send us up-to-date documents,
 * and those documents are simply given a stamp of approval by this transformer. This is why it is
 * important for migration authors to *also* write a saved object validation that will prevent this
 * assumption from inserting out-of-date documents into the index.
 *
 * If the client(s) send us documents with migrationVersion specified, we will migrate them as
 * appropriate. This means for data import scenarios, any documetns being imported should be explicitly
 * given an empty migrationVersion property {} if no such property exists.
 */
const boom_1 = tslib_1.__importDefault(require("boom"));
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const semver_1 = tslib_1.__importDefault(require("semver"));
const migration_logger_1 = require("./migration_logger");
/**
 * A concrete implementation of the VersionedTransformer interface.
 */
class DocumentMigrator {
    /**
     * Creates an instance of DocumentMigrator.
     *
     * @param {Opts} opts
     * @prop {string} kibanaVersion - The current version of Kibana
     * @prop {MigrationDefinition} migrations - The migrations that will be used to migrate documents
     * @prop {ValidateDoc} validateDoc - A function which, given a document throws an error if it is
     *   not up to date. This is used to ensure we don't let unmigrated documents slip through.
     * @prop {Logger} log - The migration logger
     * @memberof DocumentMigrator
     */
    constructor(opts) {
        /**
         * Migrates a document to the latest version.
         *
         * @param {SavedObjectDoc} doc
         * @returns {SavedObjectDoc}
         * @memberof DocumentMigrator
         */
        this.migrate = (doc) => {
            return this.transformDoc(doc);
        };
        validateMigrationDefinition(opts.migrations);
        this.migrations = buildActiveMigrations(opts.migrations, new migration_logger_1.MigrationLogger(opts.log));
        this.transformDoc = buildDocumentTransform({
            kibanaVersion: opts.kibanaVersion,
            migrations: this.migrations,
            validateDoc: opts.validateDoc,
        });
    }
    /**
     * Gets the latest version of each migratable property.
     *
     * @readonly
     * @type {MigrationVersion}
     * @memberof DocumentMigrator
     */
    get migrationVersion() {
        return lodash_1.default.mapValues(this.migrations, ({ latestVersion }) => latestVersion);
    }
}
exports.DocumentMigrator = DocumentMigrator;
/**
 * Basic validation that the migraiton definition matches our expectations. We can't
 * rely on TypeScript here, as the caller may be JavaScript / ClojureScript / any compile-to-js
 * language. So, this is just to provide a little developer-friendly error messaging. Joi was
 * giving weird errors, so we're just doing manual validation.
 */
function validateMigrationDefinition(migrations) {
    function assertObject(obj, prefix) {
        if (!obj || typeof obj !== 'object') {
            throw new Error(`${prefix} Got ${obj}.`);
        }
    }
    function assertValidSemver(version, type) {
        if (!semver_1.default.valid(version)) {
            throw new Error(`Invalid migration for type ${type}. Expected all properties to be semvers, but got ${version}.`);
        }
    }
    function assertValidTransform(fn, version, type) {
        if (typeof fn !== 'function') {
            throw new Error(`Invalid migration ${type}.${version}: expected a function, but got ${fn}.`);
        }
    }
    assertObject(migrations, 'Migration definition should be an object.');
    Object.entries(migrations).forEach(([type, versions]) => {
        assertObject(versions, `Migration for type ${type} should be an object like { '2.0.0': (doc) => doc }.`);
        Object.entries(versions).forEach(([version, fn]) => {
            assertValidSemver(version, type);
            assertValidTransform(fn, version, type);
        });
    });
}
/**
 * Converts migrations from a format that is convenient for callers to a format that
 * is convenient for our internal usage:
 * From: { type: { version: fn } }
 * To:   { type: { latestVersion: string, transforms: [{ version: string, transform: fn }] } }
 */
function buildActiveMigrations(migrations, log) {
    return lodash_1.default.mapValues(migrations, (versions, prop) => {
        const transforms = Object.entries(versions)
            .map(([version, transform]) => ({
            version,
            transform: wrapWithTry(version, prop, transform, log),
        }))
            .sort((a, b) => semver_1.default.compare(a.version, b.version));
        return {
            latestVersion: lodash_1.default.last(transforms).version,
            transforms,
        };
    });
}
/**
 * Creates a function which migrates and validates any document that is passed to it.
 */
function buildDocumentTransform({ kibanaVersion, migrations, validateDoc, }) {
    return function transformAndValidate(doc) {
        const result = doc.migrationVersion
            ? applyMigrations(doc, migrations)
            : markAsUpToDate(doc, migrations);
        validateDoc(result);
        // In order to keep tests a bit more stable, we won't
        // tack on an empy migrationVersion to docs that have
        // no migrations defined.
        if (lodash_1.default.isEmpty(result.migrationVersion)) {
            delete result.migrationVersion;
        }
        return result;
    };
}
function applyMigrations(doc, migrations) {
    while (true) {
        const prop = nextUnmigratedProp(doc, migrations);
        if (!prop) {
            return doc;
        }
        doc = migrateProp(doc, prop, migrations);
    }
}
/**
 * Gets the doc's props, handling the special case of "type".
 */
function props(doc) {
    return Object.keys(doc).concat(doc.type);
}
/**
 * Looks up the prop version in a saved object document or in our latest migrations.
 */
function propVersion(doc, prop) {
    return ((doc[prop] && doc[prop].latestVersion) ||
        (doc.migrationVersion && doc.migrationVersion[prop]));
}
/**
 * Sets the doc's migrationVersion to be the most recent version
 */
function markAsUpToDate(doc, migrations) {
    return {
        ...doc,
        migrationVersion: props(doc).reduce((acc, prop) => {
            const version = propVersion(migrations, prop);
            return version ? lodash_1.default.set(acc, prop, version) : acc;
        }, {}),
    };
}
/**
 * If a specific transform function fails, this tacks on a bit of information
 * about the document and transform that caused the failure.
 */
function wrapWithTry(version, prop, transform, log) {
    return function tryTransformDoc(doc) {
        try {
            const result = transform(doc);
            // A basic sanity check to help migration authors detect basic errors
            // (e.g. forgetting to return the transformed doc)
            if (!result || !result.type) {
                throw new Error(`Invalid saved object returned from migration ${prop}:${version}.`);
            }
            return result;
        }
        catch (error) {
            const failedTransform = `${prop}:${version}`;
            const failedDoc = JSON.stringify(doc);
            log.warning(`Failed to transform document ${doc}. Transform: ${failedTransform}\nDoc: ${failedDoc}`);
            throw error;
        }
    };
}
/**
 * Finds the first unmigrated property in the specified document.
 */
function nextUnmigratedProp(doc, migrations) {
    return props(doc).find(p => {
        const latestVersion = propVersion(migrations, p);
        const docVersion = propVersion(doc, p);
        if (latestVersion === docVersion) {
            return false;
        }
        // We verify that the version is not greater than the version supported by Kibana.
        // If we didn't, this would cause an infinite loop, as we'd be unable to migrate the property
        // but it would continue to show up as unmigrated.
        // If we have a docVersion and the latestVersion is smaller than it or does not exist,
        // we are dealing with a document that belongs to a future Kibana / plugin version.
        if (docVersion && (!latestVersion || semver_1.default.gt(docVersion, latestVersion))) {
            throw boom_1.default.badData(`Document "${doc.id}" has property "${p}" which belongs to a more recent` +
                ` version of Kibana (${docVersion}).`, doc);
        }
        return true;
    });
}
/**
 * Applies any relevent migrations to the document for the specified property.
 */
function migrateProp(doc, prop, migrations) {
    const originalType = doc.type;
    let migrationVersion = lodash_1.default.clone(doc.migrationVersion) || {};
    const typeChanged = () => !doc.hasOwnProperty(prop) || doc.type !== originalType;
    for (const { version, transform } of applicableTransforms(migrations, doc, prop)) {
        doc = transform(doc);
        migrationVersion = updateMigrationVersion(doc, migrationVersion, prop, version);
        doc.migrationVersion = lodash_1.default.clone(migrationVersion);
        if (typeChanged()) {
            break;
        }
    }
    return doc;
}
/**
 * Retrieves any prop transforms that have not been applied to doc.
 */
function applicableTransforms(migrations, doc, prop) {
    const minVersion = propVersion(doc, prop);
    const { transforms } = migrations[prop];
    return minVersion
        ? transforms.filter(({ version }) => semver_1.default.gt(version, minVersion))
        : transforms;
}
/**
 * Updates the document's migrationVersion, ensuring that the calling transform
 * has not mutated migrationVersion in an unsupported way.
 */
function updateMigrationVersion(doc, migrationVersion, prop, version) {
    assertNoDowngrades(doc, migrationVersion, prop, version);
    const docVersion = propVersion(doc, prop) || '0.0.0';
    const maxVersion = semver_1.default.gt(docVersion, version) ? docVersion : version;
    return { ...(doc.migrationVersion || migrationVersion), [prop]: maxVersion };
}
/**
 * Transforms that remove or downgrade migrationVersion properties are not allowed,
 * as this could get us into an infinite loop. So, we explicitly check for that here.
 */
function assertNoDowngrades(doc, migrationVersion, prop, version) {
    const docVersion = doc.migrationVersion;
    if (!docVersion) {
        return;
    }
    const downgrade = Object.keys(migrationVersion).find(k => !docVersion.hasOwnProperty(k) || semver_1.default.lt(docVersion[k], migrationVersion[k]));
    if (downgrade) {
        throw new Error(`Migration "${prop} v ${version}" attempted to ` +
            `downgrade "migrationVersion.${downgrade}" from ${migrationVersion[downgrade]} ` +
            `to ${docVersion[downgrade]}.`);
    }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL3NlcnZlci9zYXZlZF9vYmplY3RzL21pZ3JhdGlvbnMvY29yZS9kb2N1bWVudF9taWdyYXRvci50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL3NlcnZlci9zYXZlZF9vYmplY3RzL21pZ3JhdGlvbnMvY29yZS9kb2N1bWVudF9taWdyYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHOzs7QUFFSDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F5Q0c7QUFFSCx3REFBd0I7QUFDeEIsNERBQXVCO0FBQ3ZCLDREQUE0QjtBQUU1Qix5REFBb0U7QUFtQ3BFOztHQUVHO0FBQ0gsTUFBYSxnQkFBZ0I7SUFJM0I7Ozs7Ozs7Ozs7T0FVRztJQUNILFlBQVksSUFBVTtRQXNCdEI7Ozs7OztXQU1HO1FBQ0ksWUFBTyxHQUFHLENBQUMsR0FBbUIsRUFBa0IsRUFBRTtZQUN2RCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFDO1FBOUJBLDJCQUEyQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUU3QyxJQUFJLENBQUMsVUFBVSxHQUFHLHFCQUFxQixDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxrQ0FBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3hGLElBQUksQ0FBQyxZQUFZLEdBQUcsc0JBQXNCLENBQUM7WUFDekMsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhO1lBQ2pDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtZQUMzQixXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVc7U0FDOUIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILElBQVcsZ0JB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b25lIG9yIG1vcmUgY29udHJpYnV0b3JcbiAqIGxpY2Vuc2UgYWdyZWVtZW50cy4gU2VlIHRoZSBOT1RJQ0UgZmlsZSBkaXN0cmlidXRlZCB3aXRoXG4gKiB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gcmVnYXJkaW5nIGNvcHlyaWdodFxuICogb3duZXJzaGlwLiBFbGFzdGljc2VhcmNoIEIuVi4gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlclxuICogdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heVxuICogbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKlxuICogVGhpcyBmaWxlIGNvbnRhaW5zIGxvZ2ljIGZvciB0cmFuc2Zvcm1pbmcgLyBtaWdyYXRpbmcgYSBzYXZlZCBvYmplY3QgZG9jdW1lbnQuXG4gKlxuICogQXQgZmlyc3QsIGl0IG1heSBzZWVtIGFzIGlmIHRoaXMgY291bGQgYmUgYSBzaW1wbGUgZmlsdGVyICsgcmVkdWNlIG9wZXJhdGlvbixcbiAqIHJ1bm5pbmcgdGhlIGRvY3VtZW50IHRocm91Z2ggYSBsaW5lYXIgc2V0IG9mIHRyYW5zZm9ybSBmdW5jdGlvbnMgdW50aWwgaXQgaXNcbiAqIHVwIHRvIGRhdGUsIGJ1dCB0aGVyZSBhcmUgc29tZSBlZGdlIGNhc2VzIHRoYXQgbWFrZSBpdCBtb3JlIGNvbXBsaWNhdGVkLlxuICpcbiAqIEEgdHJhbnNmb3JtIGNhbiBhZGQgYSBuZXcgcHJvcGVydHksIHJlbmFtZSBhbiBleGlzdGluZyBwcm9wZXJ0eSwgcmVtb3ZlIGEgcHJvcGVydHksIGV0Yy5cbiAqIFRoaXMgbWVhbnMgdGhhdCB3ZSBhcmVuJ3QgYWJsZSB0byBkbyBhIHJlZHVjZSBvdmVyIGEgZml4ZWQgbGlzdCBvZiBwcm9wZXJ0aWVzLCBhc1xuICogZWFjaCB0cmFuc2Zvcm0gb3BlcmF0aW9uIGNvdWxkIGVzc2VudGlhbGx5IGNoYW5nZSB3aGF0IHRyYW5zZm9ybXMgc2hvdWxkIGJlIGFwcGxpZWRcbiAqIG5leHQuXG4gKlxuICogVGhlIGJhc2ljIGFsZ29yaXRobSwgdGhlbiwgaXMgdGhpczpcbiAqXG4gKiBXaGlsZSB0aGVyZSBhcmUgYW55IHVubWlncmF0ZWQgcHJvcGVydGllcyBpbiB0aGUgZG9jLCBmaW5kIHRoZSBuZXh0IHVubWlncmF0ZWQgcHJvcGVydHksXG4gKiBhbmQgcnVuIHRoZSBkb2MgdGhyb3VnaCB0aGUgdHJhbnNmb3JtcyB0aGF0IHRhcmdldCB0aGF0IHByb3BlcnR5LlxuICpcbiAqIFRoaXMgd2F5LCB3ZSBrZWVwIGxvb3BpbmcgdW50aWwgdGhlcmUgYXJlIG5vIHRyYW5zZm9ybXMgbGVmdCB0byBhcHBseSwgYW5kIHdlIHByb3Blcmx5XG4gKiBoYW5kbGUgcHJvcGVydHkgYWRkaXRpb24gLyBkZWxldGlvbiAvIHJlbmFtaW5nLlxuICpcbiAqIEEgY2F2ZWF0IGlzIHRoYXQgdGhpcyBtZWFucyB3ZSBtdXN0IHJlc3RyaWN0IHdoYXQgYSBtaWdyYXRpb24gY2FuIGRvIHRvIHRoZSBkb2Mnc1xuICogbWlncmF0aW9uVmVyc2lvbiBpdHNlbGYuIFdlIGFsbG93IG9ubHkgdGhlc2Uga2luZHMgb2YgY2hhbmdlczpcbiAqXG4gKiAtIEFkZCBhIG5ldyBwcm9wZXJ0eSB0byBtaWdyYXRpb25WZXJzaW9uXG4gKiAtIE1vdmUgYSBtaWdyYXRpb25WZXJzaW9uIHByb3BlcnR5IGZvcndhcmQgdG8gYSBsYXRlciB2ZXJzaW9uXG4gKlxuICogTWlncmF0aW9ucyAqY2Fubm90KiBtb3ZlIGEgbWlncmF0aW9uVmVyc2lvbiBwcm9wZXJ0eSBiYWNrd2FyZHMgKGUuZy4gZnJvbSAyLjAuMCB0byAxLjAuMCksIGFuZCB0aGV5XG4gKiBjYW5ub3QgY2xlYXIgYSBtaWdyYXRpb25WZXJzaW9uIHByb3BlcnR5LCBhcyBhbGxvd2luZyBlaXRoZXIgb2YgdGhlc2UgY291bGQgcHJvZHVjZSBpbmZpbml0ZSBsb29wcy5cbiAqIEhvd2V2ZXIsIHdlIGRvIHdpc2ggdG8gYWxsb3cgbWlncmF0aW9ucyB0byBtb2RpZnkgbWlncmF0aW9uVmVyc2lvbiBpZiB0aGV5IHdpc2gsIHNvIHRoYXRcbiAqIHRoZXkgY291bGQgdHJhbnNmb3JtIGEgdHlwZSBmcm9tIFwiZm9vIDEuMC4wXCIgdG8gIFwiYmFyIDMuMC4wXCIuXG4gKlxuICogT25lIGxhc3QgZ290Y2hhIGlzIHRoYXQgYW55IGRvY3Mgd2hpY2ggaGF2ZSBubyBtaWdyYXRpb25WZXJzaW9uIGFyZSBhc3N1bWVkIHRvIGJlIHVwLXRvLWRhdGUuXG4gKiBUaGlzIGlzIGJlY2F1c2UgS2liYW5hIFVJIGFuZCBvdGhlciBjbGllbnRzIHJlYWxseSBjYW4ndCBiZSBleHBlY3RlZCBidWlsZCB0aGUgbWlncmF0aW9uVmVyc2lvblxuICogaW4gYSByZWxpYWJsZSB3YXkuIEluc3RlYWQsIGNhbGxlcnMgb2Ygb3VyIEFQSXMgYXJlIGV4cGVjdGVkIHRvIHNlbmQgdXMgdXAtdG8tZGF0ZSBkb2N1bWVudHMsXG4gKiBhbmQgdGhvc2UgZG9jdW1lbnRzIGFyZSBzaW1wbHkgZ2l2ZW4gYSBzdGFtcCBvZiBhcHByb3ZhbCBieSB0aGlzIHRyYW5zZm9ybWVyLiBUaGlzIGlzIHdoeSBpdCBpc1xuICogaW1wb3J0YW50IGZvciBtaWdyYXRpb24gYXV0aG9ycyB0byAqYWxzbyogd3JpdGUgYSBzYXZlZCBvYmplY3QgdmFsaWRhdGlvbiB0aGF0IHdpbGwgcHJldmVudCB0aGlzXG4gKiBhc3N1bXB0aW9uIGZyb20gaW5zZXJ0aW5nIG91dC1vZi1kYXRlIGRvY3VtZW50cyBpbnRvIHRoZSBpbmRleC5cbiAqXG4gKiBJZiB0aGUgY2xpZW50KHMpIHNlbmQgdXMgZG9jdW1lbnRzIHdpdGggbWlncmF0aW9uVmVyc2lvbiBzcGVjaWZpZWQsIHdlIHdpbGwgbWlncmF0ZSB0aGVtIGFzXG4gKiBhcHByb3ByaWF0ZS4gVGhpcyBtZWFucyBmb3IgZGF0YSBpbXBvcnQgc2NlbmFyaW9zLCBhbnkgZG9jdW1ldG5zIGJlaW5nIGltcG9ydGVkIHNob3VsZCBiZSBleHBsaWNpdGx5XG4gKiBnaXZlbiBhbiBlbXB0eSBtaWdyYXRpb25WZXJzaW9uIHByb3BlcnR5IHt9IGlmIG5vIHN1Y2ggcHJvcGVydHkgZXhpc3RzLlxuICovXG5cbmltcG9ydCBCb29tIGZyb20gJ2Jvb20nO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBTZW12ZXIgZnJvbSAnc2VtdmVyJztcbmltcG9ydCB7IE1pZ3JhdGlvblZlcnNpb24sIFNhdmVkT2JqZWN0RG9jIH0gZnJvbSAnLi4vLi4vc2VyaWFsaXphdGlvbic7XG5pbXBvcnQgeyBMb2dGbiwgTG9nZ2VyLCBNaWdyYXRpb25Mb2dnZXIgfSBmcm9tICcuL21pZ3JhdGlvbl9sb2dnZXInO1xuXG5leHBvcnQgdHlwZSBUcmFuc2Zvcm1GbiA9IChkb2M6IFNhdmVkT2JqZWN0RG9jKSA9PiBTYXZlZE9iamVjdERvYztcblxudHlwZSBWYWxpZGF0ZURvYyA9IChkb2M6IFNhdmVkT2JqZWN0RG9jKSA9PiB2b2lkO1xuXG5pbnRlcmZhY2UgTWlncmF0aW9uRGVmaW5pdGlvbiB7XG4gIFt0eXBlOiBzdHJpbmddOiB7IFt2ZXJzaW9uOiBzdHJpbmddOiBUcmFuc2Zvcm1GbiB9O1xufVxuXG5pbnRlcmZhY2UgT3B0cyB7XG4gIGtpYmFuYVZlcnNpb246IHN0cmluZztcbiAgbWlncmF0aW9uczogTWlncmF0aW9uRGVmaW5pdGlvbjtcbiAgdmFsaWRhdGVEb2M6IFZhbGlkYXRlRG9jO1xuICBsb2c6IExvZ0ZuO1xufVxuXG5pbnRlcmZhY2UgQWN0aXZlTWlncmF0aW9ucyB7XG4gIFt0eXBlOiBzdHJpbmddOiB7XG4gICAgbGF0ZXN0VmVyc2lvbjogc3RyaW5nO1xuICAgIHRyYW5zZm9ybXM6IEFycmF5PHtcbiAgICAgIHZlcnNpb246IHN0cmluZztcbiAgICAgIHRyYW5zZm9ybTogVHJhbnNmb3JtRm47XG4gICAgfT47XG4gIH07XG59XG5cbi8qKlxuICogTWFuYWdlcyBtaWdyYXRpb24gb2YgaW5kaXZpZHVhbCBkb2N1bWVudHMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVmVyc2lvbmVkVHJhbnNmb3JtZXIge1xuICBtaWdyYXRpb25WZXJzaW9uOiBNaWdyYXRpb25WZXJzaW9uO1xuICBtaWdyYXRlOiBUcmFuc2Zvcm1Gbjtcbn1cblxuLyoqXG4gKiBBIGNvbmNyZXRlIGltcGxlbWVudGF0aW9uIG9mIHRoZSBWZXJzaW9uZWRUcmFuc2Zvcm1lciBpbnRlcmZhY2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBEb2N1bWVudE1pZ3JhdG9yIGltcGxlbWVudHMgVmVyc2lvbmVkVHJhbnNmb3JtZXIge1xuICBwcml2YXRlIG1pZ3JhdGlvbnM6IEFjdGl2ZU1pZ3JhdGlvbnM7XG4gIHByaXZhdGUgdHJhbnNmb3JtRG9jOiBUcmFuc2Zvcm1GbjtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBEb2N1bWVudE1pZ3JhdG9yLlxuICAgKlxuICAgKiBAcGFyYW0ge09wdHN9IG9wdHNcbiAgICogQHByb3Age3N0cmluZ30ga2liYW5hVmVyc2lvbiAtIFRoZSBjdXJyZW50IHZlcnNpb24gb2YgS2liYW5hXG4gICAqIEBwcm9wIHtNaWdyYXRpb25EZWZpbml0aW9ufSBtaWdyYXRpb25zIC0gVGhlIG1pZ3JhdGlvbnMgdGhhdCB3aWxsIGJlIHVzZWQgdG8gbWlncmF0ZSBkb2N1bWVudHNcbiAgICogQHByb3Age1ZhbGlkYXRlRG9jfSB2YWxpZGF0ZURvYyAtIEEgZnVuY3Rpb24gd2hpY2gsIGdpdmVuIGEgZG9jdW1lbnQgdGhyb3dzIGFuIGVycm9yIGlmIGl0IGlzXG4gICAqICAgbm90IHVwIHRvIGRhdGUuIFRoaXMgaXMgdXNlZCB0byBlbnN1cmUgd2UgZG9uJ3QgbGV0IHVubWlncmF0ZWQgZG9jdW1lbnRzIHNsaXAgdGhyb3VnaC5cbiAgICogQHByb3Age0xvZ2dlcn0gbG9nIC0gVGhlIG1pZ3JhdGlvbiBsb2dnZXJcbiAgICogQG1lbWJlcm9mIERvY3VtZW50TWlncmF0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdHM6IE9wdHMpIHtcbiAgICB2YWxpZGF0ZU1pZ3JhdGlvbkRlZmluaXRpb24ob3B0cy5taWdyYXRpb25zKTtcblxuICAgIHRoaXMubWlncmF0aW9ucyA9IGJ1aWxkQWN0aXZlTWlncmF0aW9ucyhvcHRzLm1pZ3JhdGlvbnMsIG5ldyBNaWdyYXRpb25Mb2dnZXIob3B0cy5sb2cpKTtcbiAgICB0aGlzLnRyYW5zZm9ybURvYyA9IGJ1aWxkRG9jdW1lbnRUcmFuc2Zvcm0oe1xuICAgICAga2liYW5hVmVyc2lvbjogb3B0cy5raWJhbmFWZXJzaW9uLFxuICAgICAgbWlncmF0aW9uczogdGhpcy5taWdyYXRpb25zLFxuICAgICAgdmFsaWRhdGVEb2M6IG9wdHMudmFsaWRhdGVEb2MsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgbGF0ZXN0IHZlcnNpb24gb2YgZWFjaCBtaWdyYXRhYmxlIHByb3BlcnR5LlxuICAgKlxuICAgKiBAcmVhZG9ubHlcbiAgICogQHR5cGUge01pZ3JhdGlvblZlcnNpb259XG4gICAqIEBtZW1iZXJvZiBEb2N1bWVudE1pZ3JhdG9yXG4gICAqL1xuICBwdWJsaWMgZ2V0IG1pZ3JhdGlvblZlcnNpb24oKTogTWlncmF0aW9uVmVyc2lvbiB7XG4gICAgcmV0dXJuIF8ubWFwVmFsdWVzKHRoaXMubWlncmF0aW9ucywgKHsgbGF0ZXN0VmVyc2lvbiB9KSA9PiBsYXRlc3RWZXJzaW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNaWdyYXRlcyBhIGRvY3VtZW50IHRvIHRoZSBsYXRlc3QgdmVyc2lvbi5cbiAgICpcbiAgICogQHBhcmFtIHtTYXZlZE9iamVjdERvY30gZG9jXG4gICAqIEByZXR1cm5zIHtTYXZlZE9iamVjdERvY31cbiAgICogQG1lbWJlcm9mIERvY3VtZW50TWlncmF0b3JcbiAgICovXG4gIHB1YmxpYyBtaWdyYXRlID0gKGRvYzogU2F2ZWRPYmplY3REb2MpOiBTYXZlZE9iamVjdERvYyA9PiB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtRG9jKGRvYyk7XG4gIH07XG59XG5cbi8qKlxuICogQmFzaWMgdmFsaWRhdGlvbiB0aGF0IHRoZSBtaWdyYWl0b24gZGVmaW5pdGlvbiBtYXRjaGVzIG91ciBleHBlY3RhdGlvbnMuIFdlIGNhbid0XG4gKiByZWx5IG9uIFR5cGVTY3JpcHQgaGVyZSwgYXMgdGhlIGNhbGxlciBtYXkgYmUgSmF2YVNjcmlwdCAvIENsb2p1cmVTY3JpcHQgLyBhbnkgY29tcGlsZS10by1qc1xuICogbGFuZ3VhZ2UuIFNvLCB0aGlzIGlzIGp1c3QgdG8gcHJvdmlkZSBhIGxpdHRsZSBkZXZlbG9wZXItZnJpZW5kbHkgZXJyb3IgbWVzc2FnaW5nLiBKb2kgd2FzXG4gKiBnaXZpbmcgd2VpcmQgZXJyb3JzLCBzbyB3ZSdyZSBqdXN0IGRvaW5nIG1hbnVhbCB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiB2YWxpZGF0ZU1pZ3JhdGlvbkRlZmluaXRpb24obWlncmF0aW9uczogTWlncmF0aW9uRGVmaW5pdGlvbikge1xuICBmdW5jdGlvbiBhc3NlcnRPYmplY3Qob2JqOiBhbnksIHByZWZpeDogc3RyaW5nKSB7XG4gICAgaWYgKCFvYmogfHwgdHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHtwcmVmaXh9IEdvdCAke29ian0uYCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYXNzZXJ0VmFsaWRTZW12ZXIodmVyc2lvbjogc3RyaW5nLCB0eXBlOiBzdHJpbmcpIHtcbiAgICBpZiAoIVNlbXZlci52YWxpZCh2ZXJzaW9uKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgSW52YWxpZCBtaWdyYXRpb24gZm9yIHR5cGUgJHt0eXBlfS4gRXhwZWN0ZWQgYWxsIHByb3BlcnRpZXMgdG8gYmUgc2VtdmVycywgYnV0IGdvdCAke3ZlcnNpb259LmBcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYXNzZXJ0VmFsaWRUcmFuc2Zvcm0oZm46IGFueSwgdmVyc2lvbjogc3RyaW5nLCB0eXBlOiBzdHJpbmcpIHtcbiAgICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgbWlncmF0aW9uICR7dHlwZX0uJHt2ZXJzaW9ufTogZXhwZWN0ZWQgYSBmdW5jdGlvbiwgYnV0IGdvdCAke2ZufS5gKTtcbiAgICB9XG4gIH1cblxuICBhc3NlcnRPYmplY3QobWlncmF0aW9ucywgJ01pZ3JhdGlvbiBkZWZpbml0aW9uIHNob3VsZCBiZSBhbiBvYmplY3QuJyk7XG5cbiAgT2JqZWN0LmVudHJpZXMobWlncmF0aW9ucykuZm9yRWFjaCgoW3R5cGUsIHZlcnNpb25zXTogYW55KSA9PiB7XG4gICAgYXNzZXJ0T2JqZWN0KFxuICAgICAgdmVyc2lvbnMsXG4gICAgICBgTWlncmF0aW9uIGZvciB0eXBlICR7dHlwZX0gc2hvdWxkIGJlIGFuIG9iamVjdCBsaWtlIHsgJzIuMC4wJzogKGRvYykgPT4gZG9jIH0uYFxuICAgICk7XG4gICAgT2JqZWN0LmVudHJpZXModmVyc2lvbnMpLmZvckVhY2goKFt2ZXJzaW9uLCBmbl0pID0+IHtcbiAgICAgIGFzc2VydFZhbGlkU2VtdmVyKHZlcnNpb24sIHR5cGUpO1xuICAgICAgYXNzZXJ0VmFsaWRUcmFuc2Zvcm0oZm4sIHZlcnNpb24sIHR5cGUpO1xuICAgIH0pO1xuICB9KTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBtaWdyYXRpb25zIGZyb20gYSBmb3JtYXQgdGhhdCBpcyBjb252ZW5pZW50IGZvciBjYWxsZXJzIHRvIGEgZm9ybWF0IHRoYXRcbiAqIGlzIGNvbnZlbmllbnQgZm9yIG91ciBpbnRlcm5hbCB1c2FnZTpcbiAqIEZyb206IHsgdHlwZTogeyB2ZXJzaW9uOiBmbiB9IH1cbiAqIFRvOiAgIHsgdHlwZTogeyBsYXRlc3RWZXJzaW9uOiBzdHJpbmcsIHRyYW5zZm9ybXM6IFt7IHZlcnNpb246IHN0cmluZywgdHJhbnNmb3JtOiBmbiB9XSB9IH1cbiAqL1xuZnVuY3Rpb24gYnVpbGRBY3RpdmVNaWdyYXRpb25zKG1pZ3JhdGlvbnM6IE1pZ3JhdGlvbkRlZmluaXRpb24sIGxvZzogTG9nZ2VyKTogQWN0aXZlTWlncmF0aW9ucyB7XG4gIHJldHVybiBfLm1hcFZhbHVlcyhtaWdyYXRpb25zLCAodmVyc2lvbnMsIHByb3ApID0+IHtcbiAgICBjb25zdCB0cmFuc2Zvcm1zID0gT2JqZWN0LmVudHJpZXModmVyc2lvbnMpXG4gICAgICAubWFwKChbdmVyc2lvbiwgdHJhbnNmb3JtXSkgPT4gKHtcbiAgICAgICAgdmVyc2lvbixcbiAgICAgICAgdHJhbnNmb3JtOiB3cmFwV2l0aFRyeSh2ZXJzaW9uLCBwcm9wISwgdHJhbnNmb3JtLCBsb2cpLFxuICAgICAgfSkpXG4gICAgICAuc29ydCgoYSwgYikgPT4gU2VtdmVyLmNvbXBhcmUoYS52ZXJzaW9uLCBiLnZlcnNpb24pKTtcbiAgICByZXR1cm4ge1xuICAgICAgbGF0ZXN0VmVyc2lvbjogXy5sYXN0KHRyYW5zZm9ybXMpLnZlcnNpb24sXG4gICAgICB0cmFuc2Zvcm1zLFxuICAgIH07XG4gIH0pO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB3aGljaCBtaWdyYXRlcyBhbmQgdmFsaWRhdGVzIGFueSBkb2N1bWVudCB0aGF0IGlzIHBhc3NlZCB0byBpdC5cbiAqL1xuZnVuY3Rpb24gYnVpbGREb2N1bWVudFRyYW5zZm9ybSh7XG4gIGtpYmFuYVZlcnNpb24sXG4gIG1pZ3JhdGlvbnMsXG4gIHZhbGlkYXRlRG9jLFxufToge1xuICBraWJhbmFWZXJzaW9uOiBzdHJpbmc7XG4gIG1pZ3JhdGlvbnM6IEFjdGl2ZU1pZ3JhdGlvbnM7XG4gIHZhbGlkYXRlRG9jOiBWYWxpZGF0ZURvYztcbn0pOiBUcmFuc2Zvcm1GbiB7XG4gIHJldHVybiBmdW5jdGlvbiB0cmFuc2Zvcm1BbmRWYWxpZGF0ZShkb2M6IFNhdmVkT2JqZWN0RG9jKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gZG9jLm1pZ3JhdGlvblZlcnNpb25cbiAgICAgID8gYXBwbHlNaWdyYXRpb25zKGRvYywgbWlncmF0aW9ucylcbiAgICAgIDogbWFya0FzVXBUb0RhdGUoZG9jLCBtaWdyYXRpb25zKTtcblxuICAgIHZhbGlkYXRlRG9jKHJlc3VsdCk7XG5cbiAgICAvLyBJbiBvcmRlciB0byBrZWVwIHRlc3RzIGEgYml0IG1vcmUgc3RhYmxlLCB3ZSB3b24ndFxuICAgIC8vIHRhY2sgb24gYW4gZW1weSBtaWdyYXRpb25WZXJzaW9uIHRvIGRvY3MgdGhhdCBoYXZlXG4gICAgLy8gbm8gbWlncmF0aW9ucyBkZWZpbmVkLlxuICAgIGlmIChfLmlzRW1wdHkocmVzdWx0Lm1pZ3JhdGlvblZlcnNpb24pKSB7XG4gICAgICBkZWxldGUgcmVzdWx0Lm1pZ3JhdGlvblZlcnNpb247XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXBwbHlNaWdyYXRpb25zKGRvYzogU2F2ZWRPYmplY3REb2MsIG1pZ3JhdGlvbnM6IEFjdGl2ZU1pZ3JhdGlvbnMpIHtcbiAgd2hpbGUgKHRydWUpIHtcbiAgICBjb25zdCBwcm9wID0gbmV4dFVubWlncmF0ZWRQcm9wKGRvYywgbWlncmF0aW9ucyk7XG4gICAgaWYgKCFwcm9wKSB7XG4gICAgICByZXR1cm4gZG9jO1xuICAgIH1cbiAgICBkb2MgPSBtaWdyYXRlUHJvcChkb2MsIHByb3AsIG1pZ3JhdGlvbnMpO1xuICB9XG59XG5cbi8qKlxuICogR2V0cyB0aGUgZG9jJ3MgcHJvcHMsIGhhbmRsaW5nIHRoZSBzcGVjaWFsIGNhc2Ugb2YgXCJ0eXBlXCIuXG4gKi9cbmZ1bmN0aW9uIHByb3BzKGRvYzogU2F2ZWRPYmplY3REb2MpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKGRvYykuY29uY2F0KGRvYy50eXBlKTtcbn1cblxuLyoqXG4gKiBMb29rcyB1cCB0aGUgcHJvcCB2ZXJzaW9uIGluIGEgc2F2ZWQgb2JqZWN0IGRvY3VtZW50IG9yIGluIG91ciBsYXRlc3QgbWlncmF0aW9ucy5cbiAqL1xuZnVuY3Rpb24gcHJvcFZlcnNpb24oZG9jOiBTYXZlZE9iamVjdERvYyB8IEFjdGl2ZU1pZ3JhdGlvbnMsIHByb3A6IHN0cmluZykge1xuICByZXR1cm4gKFxuICAgIChkb2NbcHJvcF0gJiYgZG9jW3Byb3BdLmxhdGVzdFZlcnNpb24pIHx8XG4gICAgKGRvYy5taWdyYXRpb25WZXJzaW9uICYmIChkb2MgYXMgYW55KS5taWdyYXRpb25WZXJzaW9uW3Byb3BdKVxuICApO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIGRvYydzIG1pZ3JhdGlvblZlcnNpb24gdG8gYmUgdGhlIG1vc3QgcmVjZW50IHZlcnNpb25cbiAqL1xuZnVuY3Rpb24gbWFya0FzVXBUb0RhdGUoZG9jOiBTYXZlZE9iamVjdERvYywgbWlncmF0aW9uczogQWN0aXZlTWlncmF0aW9ucykge1xuICByZXR1cm4ge1xuICAgIC4uLmRvYyxcbiAgICBtaWdyYXRpb25WZXJzaW9uOiBwcm9wcyhkb2MpLnJlZHVjZSgoYWNjLCBwcm9wKSA9PiB7XG4gICAgICBjb25zdCB2ZXJzaW9uID0gcHJvcFZlcnNpb24obWlncmF0aW9ucywgcHJvcCk7XG4gICAgICByZXR1cm4gdmVyc2lvbiA/IF8uc2V0KGFjYywgcHJvcCwgdmVyc2lvbikgOiBhY2M7XG4gICAgfSwge30pLFxuICB9O1xufVxuXG4vKipcbiAqIElmIGEgc3BlY2lmaWMgdHJhbnNmb3JtIGZ1bmN0aW9uIGZhaWxzLCB0aGlzIHRhY2tzIG9uIGEgYml0IG9mIGluZm9ybWF0aW9uXG4gKiBhYm91dCB0aGUgZG9jdW1lbnQgYW5kIHRyYW5zZm9ybSB0aGF0IGNhdXNlZCB0aGUgZmFpbHVyZS5cbiAqL1xuZnVuY3Rpb24gd3JhcFdpdGhUcnkodmVyc2lvbjogc3RyaW5nLCBwcm9wOiBzdHJpbmcsIHRyYW5zZm9ybTogVHJhbnNmb3JtRm4sIGxvZzogTG9nZ2VyKSB7XG4gIHJldHVybiBmdW5jdGlvbiB0cnlUcmFuc2Zvcm1Eb2MoZG9jOiBTYXZlZE9iamVjdERvYykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXN1bHQgPSB0cmFuc2Zvcm0oZG9jKTtcblxuICAgICAgLy8gQSBiYXNpYyBzYW5pdHkgY2hlY2sgdG8gaGVscCBtaWdyYXRpb24gYXV0aG9ycyBkZXRlY3QgYmFzaWMgZXJyb3JzXG4gICAgICAvLyAoZS5nLiBmb3JnZXR0aW5nIHRvIHJldHVybiB0aGUgdHJhbnNmb3JtZWQgZG9jKVxuICAgICAgaWYgKCFyZXN1bHQgfHwgIXJlc3VsdC50eXBlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBzYXZlZCBvYmplY3QgcmV0dXJuZWQgZnJvbSBtaWdyYXRpb24gJHtwcm9wfToke3ZlcnNpb259LmApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zdCBmYWlsZWRUcmFuc2Zvcm0gPSBgJHtwcm9wfToke3ZlcnNpb259YDtcbiAgICAgIGNvbnN0IGZhaWxlZERvYyA9IEpTT04uc3RyaW5naWZ5KGRvYyk7XG4gICAgICBsb2cud2FybmluZyhcbiAgICAgICAgYEZhaWxlZCB0byB0cmFuc2Zvcm0gZG9jdW1lbnQgJHtkb2N9LiBUcmFuc2Zvcm06ICR7ZmFpbGVkVHJhbnNmb3JtfVxcbkRvYzogJHtmYWlsZWREb2N9YFxuICAgICAgKTtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfTtcbn1cblxuLyoqXG4gKiBGaW5kcyB0aGUgZmlyc3QgdW5taWdyYXRlZCBwcm9wZXJ0eSBpbiB0aGUgc3BlY2lmaWVkIGRvY3VtZW50LlxuICovXG5mdW5jdGlvbiBuZXh0VW5taWdyYXRlZFByb3AoZG9jOiBTYXZlZE9iamVjdERvYywgbWlncmF0aW9uczogQWN0aXZlTWlncmF0aW9ucykge1xuICByZXR1cm4gcHJvcHMoZG9jKS5maW5kKHAgPT4ge1xuICAgIGNvbnN0IGxhdGVzdFZlcnNpb24gPSBwcm9wVmVyc2lvbihtaWdyYXRpb25zLCBwKTtcbiAgICBjb25zdCBkb2NWZXJzaW9uID0gcHJvcFZlcnNpb24oZG9jLCBwKTtcblxuICAgIGlmIChsYXRlc3RWZXJzaW9uID09PSBkb2NWZXJzaW9uKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gV2UgdmVyaWZ5IHRoYXQgdGhlIHZlcnNpb24gaXMgbm90IGdyZWF0ZXIgdGhhbiB0aGUgdmVyc2lvbiBzdXBwb3J0ZWQgYnkgS2liYW5hLlxuICAgIC8vIElmIHdlIGRpZG4ndCwgdGhpcyB3b3VsZCBjYXVzZSBhbiBpbmZpbml0ZSBsb29wLCBhcyB3ZSdkIGJlIHVuYWJsZSB0byBtaWdyYXRlIHRoZSBwcm9wZXJ0eVxuICAgIC8vIGJ1dCBpdCB3b3VsZCBjb250aW51ZSB0byBzaG93IHVwIGFzIHVubWlncmF0ZWQuXG4gICAgLy8gSWYgd2UgaGF2ZSBhIGRvY1ZlcnNpb24gYW5kIHRoZSBsYXRlc3RWZXJzaW9uIGlzIHNtYWxsZXIgdGhhbiBpdCBvciBkb2VzIG5vdCBleGlzdCxcbiAgICAvLyB3ZSBhcmUgZGVhbGluZyB3aXRoIGEgZG9jdW1lbnQgdGhhdCBiZWxvbmdzIHRvIGEgZnV0dXJlIEtpYmFuYSAvIHBsdWdpbiB2ZXJzaW9uLlxuICAgIGlmIChkb2NWZXJzaW9uICYmICghbGF0ZXN0VmVyc2lvbiB8fCBTZW12ZXIuZ3QoZG9jVmVyc2lvbiwgbGF0ZXN0VmVyc2lvbikpKSB7XG4gICAgICB0aHJvdyBCb29tLmJhZERhdGEoXG4gICAgICAgIGBEb2N1bWVudCBcIiR7ZG9jLmlkfVwiIGhhcyBwcm9wZXJ0eSBcIiR7cH1cIiB3aGljaCBiZWxvbmdzIHRvIGEgbW9yZSByZWNlbnRgICtcbiAgICAgICAgICBgIHZlcnNpb24gb2YgS2liYW5hICgke2RvY1ZlcnNpb259KS5gLFxuICAgICAgICBkb2NcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH0pO1xufVxuXG4vKipcbiAqIEFwcGxpZXMgYW55IHJlbGV2ZW50IG1pZ3JhdGlvbnMgdG8gdGhlIGRvY3VtZW50IGZvciB0aGUgc3BlY2lmaWVkIHByb3BlcnR5LlxuICovXG5mdW5jdGlvbiBtaWdyYXRlUHJvcChcbiAgZG9jOiBTYXZlZE9iamVjdERvYyxcbiAgcHJvcDogc3RyaW5nLFxuICBtaWdyYXRpb25zOiBBY3RpdmVNaWdyYXRpb25zXG4pOiBTYXZlZE9iamVjdERvYyB7XG4gIGNvbnN0IG9yaWdpbmFsVHlwZSA9IGRvYy50eXBlO1xuICBsZXQgbWlncmF0aW9uVmVyc2lvbiA9IF8uY2xvbmUoZG9jLm1pZ3JhdGlvblZlcnNpb24pIHx8IHt9O1xuICBjb25zdCB0eXBlQ2hhbmdlZCA9ICgpID0+ICFkb2MuaGFzT3duUHJvcGVydHkocHJvcCkgfHwgZG9jLnR5cGUgIT09IG9yaWdpbmFsVHlwZTtcblxuICBmb3IgKGNvbnN0IHsgdmVyc2lvbiwgdHJhbnNmb3JtIH0gb2YgYXBwbGljYWJsZVRyYW5zZm9ybXMobWlncmF0aW9ucywgZG9jLCBwcm9wKSkge1xuICAgIGRvYyA9IHRyYW5zZm9ybShkb2MpO1xuICAgIG1pZ3JhdGlvblZlcnNpb24gPSB1cGRhdGVNaWdyYXRpb25WZXJzaW9uKGRvYywgbWlncmF0aW9uVmVyc2lvbiwgcHJvcCwgdmVyc2lvbik7XG4gICAgZG9jLm1pZ3JhdGlvblZlcnNpb24gPSBfLmNsb25lKG1pZ3JhdGlvblZlcnNpb24pO1xuXG4gICAgaWYgKHR5cGVDaGFuZ2VkKCkpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkb2M7XG59XG5cbi8qKlxuICogUmV0cmlldmVzIGFueSBwcm9wIHRyYW5zZm9ybXMgdGhhdCBoYXZlIG5vdCBiZWVuIGFwcGxpZWQgdG8gZG9jLlxuICovXG5mdW5jdGlvbiBhcHBsaWNhYmxlVHJhbnNmb3JtcyhtaWdyYXRpb25zOiBBY3RpdmVNaWdyYXRpb25zLCBkb2M6IFNhdmVkT2JqZWN0RG9jLCBwcm9wOiBzdHJpbmcpIHtcbiAgY29uc3QgbWluVmVyc2lvbiA9IHByb3BWZXJzaW9uKGRvYywgcHJvcCk7XG4gIGNvbnN0IHsgdHJhbnNmb3JtcyB9ID0gbWlncmF0aW9uc1twcm9wXTtcbiAgcmV0dXJuIG1pblZlcnNpb25cbiAgICA/IHRyYW5zZm9ybXMuZmlsdGVyKCh7IHZlcnNpb24gfSkgPT4gU2VtdmVyLmd0KHZlcnNpb24sIG1pblZlcnNpb24pKVxuICAgIDogdHJhbnNmb3Jtcztcbn1cblxuLyoqXG4gKiBVcGRhdGVzIHRoZSBkb2N1bWVudCdzIG1pZ3JhdGlvblZlcnNpb24sIGVuc3VyaW5nIHRoYXQgdGhlIGNhbGxpbmcgdHJhbnNmb3JtXG4gKiBoYXMgbm90IG11dGF0ZWQgbWlncmF0aW9uVmVyc2lvbiBpbiBhbiB1bnN1cHBvcnRlZCB3YXkuXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZU1pZ3JhdGlvblZlcnNpb24oXG4gIGRvYzogU2F2ZWRPYmplY3REb2MsXG4gIG1pZ3JhdGlvblZlcnNpb246IE1pZ3JhdGlvblZlcnNpb24sXG4gIHByb3A6IHN0cmluZyxcbiAgdmVyc2lvbjogc3RyaW5nXG4pIHtcbiAgYXNzZXJ0Tm9Eb3duZ3JhZGVzKGRvYywgbWlncmF0aW9uVmVyc2lvbiwgcHJvcCwgdmVyc2lvbik7XG4gIGNvbnN0IGRvY1ZlcnNpb24gPSBwcm9wVmVyc2lvbihkb2MsIHByb3ApIHx8ICcwLjAuMCc7XG4gIGNvbnN0IG1heFZlcnNpb24gPSBTZW12ZXIuZ3QoZG9jVmVyc2lvbiwgdmVyc2lvbikgPyBkb2NWZXJzaW9uIDogdmVyc2lvbjtcbiAgcmV0dXJuIHsgLi4uKGRvYy5taWdyYXRpb25WZXJzaW9uIHx8IG1pZ3JhdGlvblZlcnNpb24pLCBbcHJvcF06IG1heFZlcnNpb24gfTtcbn1cblxuLyoqXG4gKiBUcmFuc2Zvcm1zIHRoYXQgcmVtb3ZlIG9yIGRvd25ncmFkZSBtaWdyYXRpb25WZXJzaW9uIHByb3BlcnRpZXMgYXJlIG5vdCBhbGxvd2VkLFxuICogYXMgdGhpcyBjb3VsZCBnZXQgdXMgaW50byBhbiBpbmZpbml0ZSBsb29wLiBTbywgd2UgZXhwbGljaXRseSBjaGVjayBmb3IgdGhhdCBoZXJlLlxuICovXG5mdW5jdGlvbiBhc3NlcnROb0Rvd25ncmFkZXMoXG4gIGRvYzogU2F2ZWRPYmplY3REb2MsXG4gIG1pZ3JhdGlvblZlcnNpb246IE1pZ3JhdGlvblZlcnNpb24sXG4gIHByb3A6IHN0cmluZyxcbiAgdmVyc2lvbjogc3RyaW5nXG4pIHtcbiAgY29uc3QgZG9jVmVyc2lvbiA9IGRvYy5taWdyYXRpb25WZXJzaW9uO1xuICBpZiAoIWRvY1ZlcnNpb24pIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBkb3duZ3JhZGUgPSBPYmplY3Qua2V5cyhtaWdyYXRpb25WZXJzaW9uKS5maW5kKFxuICAgIGsgPT4gIWRvY1ZlcnNpb24uaGFzT3duUHJvcGVydHkoaykgfHwgU2VtdmVyLmx0KGRvY1ZlcnNpb25ba10sIG1pZ3JhdGlvblZlcnNpb25ba10pXG4gICk7XG5cbiAgaWYgKGRvd25ncmFkZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBNaWdyYXRpb24gXCIke3Byb3B9IHYgJHt2ZXJzaW9ufVwiIGF0dGVtcHRlZCB0byBgICtcbiAgICAgICAgYGRvd25ncmFkZSBcIm1pZ3JhdGlvblZlcnNpb24uJHtkb3duZ3JhZGV9XCIgZnJvbSAke21pZ3JhdGlvblZlcnNpb25bZG93bmdyYWRlXX0gYCArXG4gICAgICAgIGB0byAke2RvY1ZlcnNpb25bZG93bmdyYWRlXX0uYFxuICAgICk7XG4gIH1cbn1cbiJdfQ==