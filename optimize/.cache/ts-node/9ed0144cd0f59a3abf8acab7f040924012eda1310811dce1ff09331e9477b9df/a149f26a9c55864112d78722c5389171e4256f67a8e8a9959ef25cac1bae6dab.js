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
const dev_utils_1 = require("@kbn/dev-utils");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const dedent_1 = tslib_1.__importDefault(require("dedent"));
const getopts_1 = tslib_1.__importDefault(require("getopts"));
const exec_in_projects_1 = require("./exec_in_projects");
const projects_1 = require("./projects");
function runTypeCheckCli() {
    const extraFlags = [];
    const opts = getopts_1.default(process.argv.slice(2), {
        boolean: ['skip-lib-check', 'help'],
        default: {
            project: undefined,
        },
        unknown(name) {
            extraFlags.push(name);
            return false;
        },
    });
    const log = new dev_utils_1.ToolingLog({
        level: 'info',
        writeTo: process.stdout,
    });
    if (extraFlags.length) {
        for (const flag of extraFlags) {
            log.error(`Unknown flag: ${flag}`);
        }
        process.exitCode = 1;
        opts.help = true;
    }
    if (opts.help) {
        process.stdout.write(dedent_1.default(chalk_1.default `
        {dim usage:} node scripts/type_check [...options]

        Run the TypeScript compiler without emitting files so that it can check
        types during development.

        Examples:

          {dim # check types in all projects}
          {dim $} node scripts/type_check

          {dim # check types in a single project}
          {dim $} node scripts/type_check --project packages/kbn-pm/tsconfig.json

        Options:

          --project [path]    {dim Path to a tsconfig.json file determines the project to check}
          --skip-lib-check    {dim Skip type checking of all declaration files (*.d.ts)}
          --help              {dim Show this message}
      `));
        process.stdout.write('\n');
        process.exit();
    }
    const tscArgs = ['--noEmit', '--pretty', ...(opts['skip-lib-check'] ? ['--skipLibCheck'] : [])];
    const projects = projects_1.filterProjectsByFlag(opts.project);
    if (!projects.length) {
        log.error(`Unable to find project at ${opts.project}`);
        process.exit(1);
    }
    exec_in_projects_1.execInProjects(log, projects, 'tsc', project => ['--project', project.tsConfigPath, ...tscArgs]);
}
exports.runTypeCheckCli = runTypeCheckCli;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2Rldi90eXBlc2NyaXB0L3J1bl90eXBlX2NoZWNrX2NsaS50cyIsInNvdXJjZXMiOlsiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2Rldi90eXBlc2NyaXB0L3J1bl90eXBlX2NoZWNrX2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHOzs7QUFFSCw4Q0FBNEM7QUFDNUMsMERBQTBCO0FBQzFCLDREQUE0QjtBQUM1Qiw4REFBOEI7QUFFOUIseURBQW9EO0FBQ3BELHlDQUFrRDtBQUVsRCxTQUFnQixlQUFlO0lBQzdCLE1BQU0sVUFBVSxHQUFhLEVBQUUsQ0FBQztJQUNoQyxNQUFNLElBQUksR0FBRyxpQkFBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQzFDLE9BQU8sRUFBRSxDQUFDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQztRQUNuQyxPQUFPLEVBQUU7WUFDUCxPQUFPLEVBQUUsU0FBUztTQUNuQjtRQUNELE9BQU8sQ0FBQyxJQUFJO1lBQ1YsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0QixPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7S0FDRixDQUFDLENBQUM7SUFFSCxNQUFNLEdBQUcsR0FBRyxJQUFJLHNCQUFVLENBQUM7UUFDekIsS0FBSyxFQUFFLE1BQU07UUFDYixPQUFPLEVBQUUsT0FBTyxDQUFDLE1BQU07S0FDeEIsQ0FBQyxDQUFDO0lBRUgsSUFBSSxVQUFVLENBQUMsTUFBTSxFQUFFO1FBQ3JCLEtBQUssTUFBTSxJQUFJLElBQUksVUFBVSxFQUFFO1lBQzdCLEdBQUcsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLElBQUksRUFBRSxDQUFDLENBQUM7U0FDcEM7UUFFRCxPQUFPLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztRQUNyQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztLQUNsQjtJQUVELElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtRQUNiLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUNsQixnQkFBTSxDQUFDLGVBQUssQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQW1CWCxDQUFDLENBQ0gsQ0FBQztRQUNGLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNoQjtJQUVELE1BQU0sT0FBTyxHQUFHLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNoRyxNQUFNLFFBQVEsR0FBRywrQkFBb0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFcEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUU7UUFDcEIsR0FBRyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDdkQsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNqQjtJQUVELGlDQUFjLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsWUFBWSxFQUFFLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNuRyxDQUFDO0FBL0RELDBDQStEQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBMaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lIG9yIG1vcmUgY29udHJpYnV0b3JcbiAqIGxpY2Vuc2UgYWdyZWVtZW50cy4gU2VlIHRoZSBOT1RJQ0UgZmlsZSBkaXN0cmlidXRlZCB3aXRoXG4gKiB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gcmVnYXJkaW5nIGNvcHlyaWdodFxuICogb3duZXJzaGlwLiBFbGFzdGljc2VhcmNoIEIuVi4gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlclxuICogdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heVxuICogbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBUb29saW5nTG9nIH0gZnJvbSAnQGtibi9kZXYtdXRpbHMnO1xuaW1wb3J0IGNoYWxrIGZyb20gJ2NoYWxrJztcbmltcG9ydCBkZWRlbnQgZnJvbSAnZGVkZW50JztcbmltcG9ydCBnZXRvcHRzIGZyb20gJ2dldG9wdHMnO1xuXG5pbXBvcnQgeyBleGVjSW5Qcm9qZWN0cyB9IGZyb20gJy4vZXhlY19pbl9wcm9qZWN0cyc7XG5pbXBvcnQgeyBmaWx0ZXJQcm9qZWN0c0J5RmxhZyB9IGZyb20gJy4vcHJvamVjdHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gcnVuVHlwZUNoZWNrQ2xpKCkge1xuICBjb25zdCBleHRyYUZsYWdzOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCBvcHRzID0gZ2V0b3B0cyhwcm9jZXNzLmFyZ3Yuc2xpY2UoMiksIHtcbiAgICBib29sZWFuOiBbJ3NraXAtbGliLWNoZWNrJywgJ2hlbHAnXSxcbiAgICBkZWZhdWx0OiB7XG4gICAgICBwcm9qZWN0OiB1bmRlZmluZWQsXG4gICAgfSxcbiAgICB1bmtub3duKG5hbWUpIHtcbiAgICAgIGV4dHJhRmxhZ3MucHVzaChuYW1lKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICB9KTtcblxuICBjb25zdCBsb2cgPSBuZXcgVG9vbGluZ0xvZyh7XG4gICAgbGV2ZWw6ICdpbmZvJyxcbiAgICB3cml0ZVRvOiBwcm9jZXNzLnN0ZG91dCxcbiAgfSk7XG5cbiAgaWYgKGV4dHJhRmxhZ3MubGVuZ3RoKSB7XG4gICAgZm9yIChjb25zdCBmbGFnIG9mIGV4dHJhRmxhZ3MpIHtcbiAgICAgIGxvZy5lcnJvcihgVW5rbm93biBmbGFnOiAke2ZsYWd9YCk7XG4gICAgfVxuXG4gICAgcHJvY2Vzcy5leGl0Q29kZSA9IDE7XG4gICAgb3B0cy5oZWxwID0gdHJ1ZTtcbiAgfVxuXG4gIGlmIChvcHRzLmhlbHApIHtcbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShcbiAgICAgIGRlZGVudChjaGFsa2BcbiAgICAgICAge2RpbSB1c2FnZTp9IG5vZGUgc2NyaXB0cy90eXBlX2NoZWNrIFsuLi5vcHRpb25zXVxuXG4gICAgICAgIFJ1biB0aGUgVHlwZVNjcmlwdCBjb21waWxlciB3aXRob3V0IGVtaXR0aW5nIGZpbGVzIHNvIHRoYXQgaXQgY2FuIGNoZWNrXG4gICAgICAgIHR5cGVzIGR1cmluZyBkZXZlbG9wbWVudC5cblxuICAgICAgICBFeGFtcGxlczpcblxuICAgICAgICAgIHtkaW0gIyBjaGVjayB0eXBlcyBpbiBhbGwgcHJvamVjdHN9XG4gICAgICAgICAge2RpbSAkfSBub2RlIHNjcmlwdHMvdHlwZV9jaGVja1xuXG4gICAgICAgICAge2RpbSAjIGNoZWNrIHR5cGVzIGluIGEgc2luZ2xlIHByb2plY3R9XG4gICAgICAgICAge2RpbSAkfSBub2RlIHNjcmlwdHMvdHlwZV9jaGVjayAtLXByb2plY3QgcGFja2FnZXMva2JuLXBtL3RzY29uZmlnLmpzb25cblxuICAgICAgICBPcHRpb25zOlxuXG4gICAgICAgICAgLS1wcm9qZWN0IFtwYXRoXSAgICB7ZGltIFBhdGggdG8gYSB0c2NvbmZpZy5qc29uIGZpbGUgZGV0ZXJtaW5lcyB0aGUgcHJvamVjdCB0byBjaGVja31cbiAgICAgICAgICAtLXNraXAtbGliLWNoZWNrICAgIHtkaW0gU2tpcCB0eXBlIGNoZWNraW5nIG9mIGFsbCBkZWNsYXJhdGlvbiBmaWxlcyAoKi5kLnRzKX1cbiAgICAgICAgICAtLWhlbHAgICAgICAgICAgICAgIHtkaW0gU2hvdyB0aGlzIG1lc3NhZ2V9XG4gICAgICBgKVxuICAgICk7XG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoJ1xcbicpO1xuICAgIHByb2Nlc3MuZXhpdCgpO1xuICB9XG5cbiAgY29uc3QgdHNjQXJncyA9IFsnLS1ub0VtaXQnLCAnLS1wcmV0dHknLCAuLi4ob3B0c1snc2tpcC1saWItY2hlY2snXSA/IFsnLS1za2lwTGliQ2hlY2snXSA6IFtdKV07XG4gIGNvbnN0IHByb2plY3RzID0gZmlsdGVyUHJvamVjdHNCeUZsYWcob3B0cy5wcm9qZWN0KTtcblxuICBpZiAoIXByb2plY3RzLmxlbmd0aCkge1xuICAgIGxvZy5lcnJvcihgVW5hYmxlIHRvIGZpbmQgcHJvamVjdCBhdCAke29wdHMucHJvamVjdH1gKTtcbiAgICBwcm9jZXNzLmV4aXQoMSk7XG4gIH1cblxuICBleGVjSW5Qcm9qZWN0cyhsb2csIHByb2plY3RzLCAndHNjJywgcHJvamVjdCA9PiBbJy0tcHJvamVjdCcsIHByb2plY3QudHNDb25maWdQYXRoLCAuLi50c2NBcmdzXSk7XG59XG4iXX0=