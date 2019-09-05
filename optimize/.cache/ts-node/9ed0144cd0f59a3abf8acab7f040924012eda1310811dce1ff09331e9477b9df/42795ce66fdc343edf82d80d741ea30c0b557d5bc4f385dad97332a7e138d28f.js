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
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const execa_1 = tslib_1.__importDefault(require("execa"));
const listr_1 = tslib_1.__importDefault(require("listr"));
class ProjectFailure {
    constructor(project, error) {
        this.project = project;
        this.error = error;
    }
}
function execInProjects(log, projects, cmd, getArgs) {
    const list = new listr_1.default(projects.map(project => ({
        task: () => execa_1.default(cmd, getArgs(project), {
            cwd: project.directory,
            env: chalk_1.default.enabled ? { FORCE_COLOR: 'true' } : {},
            stdio: ['ignore', 'pipe', 'pipe'],
        }).catch(error => {
            throw new ProjectFailure(project, error);
        }),
        title: project.name,
    })), {
        concurrent: true,
        exitOnError: false,
    });
    list.run().catch((error) => {
        process.exitCode = 1;
        if (!error.errors) {
            log.error('Unhandled exception!');
            log.error(error);
            process.exit();
        }
        for (const e of error.errors) {
            if (e instanceof ProjectFailure) {
                log.write('');
                log.error(`${e.project.name} failed\n${e.error.stdout}`);
            }
            else {
                log.error(e);
            }
        }
    });
}
exports.execInProjects = execInProjects;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEvc3JjL2Rldi90eXBlc2NyaXB0L2V4ZWNfaW5fcHJvamVjdHMudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3NyYy9kZXYvdHlwZXNjcmlwdC9leGVjX2luX3Byb2plY3RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7OztBQUdILDBEQUEwQjtBQUMxQiwwREFBMEI7QUFDMUIsMERBQTBCO0FBSTFCLE1BQU0sY0FBYztJQUNsQixZQUFtQixPQUFnQixFQUFTLEtBQXVCO1FBQWhELFlBQU8sR0FBUCxPQUFPLENBQVM7UUFBUyxVQUFLLEdBQUwsS0FBSyxDQUFrQjtJQUFHLENBQUM7Q0FDeEU7QUFFRCxTQUFnQixjQUFjLENBQzVCLEdBQWUsRUFDZixRQUFtQixFQUNuQixHQUFXLEVBQ1gsT0FBdUM7SUFFdkMsTUFBTSxJQUFJLEdBQUcsSUFBSSxlQUFLLENBQ3BCLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FDVCxlQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUMzQixHQUFHLEVBQUUsT0FBTyxDQUFDLFNBQVM7WUFDdEIsR0FBRyxFQUFFLGVBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2pELEtBQUssRUFBRSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDO1NBQ2xDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDZixNQUFNLElBQUksY0FBYyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUM7UUFDSixLQUFLLEVBQUUsT0FBTyxDQUFDLElBQUk7S0FDcEIsQ0FBQyxDQUFDLEVBQ0g7UUFDRSxVQUFVLEVBQUUsSUFBSTtRQUNoQixXQUFXLEVBQUUsS0FBSztLQUNuQixDQUNGLENBQUM7SUFFRixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBVSxFQUFFLEVBQUU7UUFDOUIsT0FBTyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFFckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDakIsR0FBRyxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1lBQ2xDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDakIsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ2hCO1FBRUQsS0FBSyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQzVCLElBQUksQ0FBQyxZQUFZLGNBQWMsRUFBRTtnQkFDL0IsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDZCxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLFlBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO2FBQzFEO2lCQUFNO2dCQUNMLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDZDtTQUNGO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBMUNELHdDQTBDQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBMaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lIG9yIG1vcmUgY29udHJpYnV0b3JcbiAqIGxpY2Vuc2UgYWdyZWVtZW50cy4gU2VlIHRoZSBOT1RJQ0UgZmlsZSBkaXN0cmlidXRlZCB3aXRoXG4gKiB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gcmVnYXJkaW5nIGNvcHlyaWdodFxuICogb3duZXJzaGlwLiBFbGFzdGljc2VhcmNoIEIuVi4gbGljZW5zZXMgdGhpcyBmaWxlIHRvIHlvdSB1bmRlclxuICogdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heVxuICogbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZyxcbiAqIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuXG4gKiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxuICogS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zXG4gKiB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBUb29saW5nTG9nIH0gZnJvbSAnQGtibi9kZXYtdXRpbHMnO1xuaW1wb3J0IGNoYWxrIGZyb20gJ2NoYWxrJztcbmltcG9ydCBleGVjYSBmcm9tICdleGVjYSc7XG5pbXBvcnQgTGlzdHIgZnJvbSAnbGlzdHInO1xuXG5pbXBvcnQgeyBQcm9qZWN0IH0gZnJvbSAnLi9wcm9qZWN0JztcblxuY2xhc3MgUHJvamVjdEZhaWx1cmUge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcHJvamVjdDogUHJvamVjdCwgcHVibGljIGVycm9yOiBleGVjYS5FeGVjYUVycm9yKSB7fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZXhlY0luUHJvamVjdHMoXG4gIGxvZzogVG9vbGluZ0xvZyxcbiAgcHJvamVjdHM6IFByb2plY3RbXSxcbiAgY21kOiBzdHJpbmcsXG4gIGdldEFyZ3M6IChwcm9qZWN0OiBQcm9qZWN0KSA9PiBzdHJpbmdbXVxuKSB7XG4gIGNvbnN0IGxpc3QgPSBuZXcgTGlzdHIoXG4gICAgcHJvamVjdHMubWFwKHByb2plY3QgPT4gKHtcbiAgICAgIHRhc2s6ICgpID0+XG4gICAgICAgIGV4ZWNhKGNtZCwgZ2V0QXJncyhwcm9qZWN0KSwge1xuICAgICAgICAgIGN3ZDogcHJvamVjdC5kaXJlY3RvcnksXG4gICAgICAgICAgZW52OiBjaGFsay5lbmFibGVkID8geyBGT1JDRV9DT0xPUjogJ3RydWUnIH0gOiB7fSxcbiAgICAgICAgICBzdGRpbzogWydpZ25vcmUnLCAncGlwZScsICdwaXBlJ10sXG4gICAgICAgIH0pLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICB0aHJvdyBuZXcgUHJvamVjdEZhaWx1cmUocHJvamVjdCwgZXJyb3IpO1xuICAgICAgICB9KSxcbiAgICAgIHRpdGxlOiBwcm9qZWN0Lm5hbWUsXG4gICAgfSkpLFxuICAgIHtcbiAgICAgIGNvbmN1cnJlbnQ6IHRydWUsXG4gICAgICBleGl0T25FcnJvcjogZmFsc2UsXG4gICAgfVxuICApO1xuXG4gIGxpc3QucnVuKCkuY2F0Y2goKGVycm9yOiBhbnkpID0+IHtcbiAgICBwcm9jZXNzLmV4aXRDb2RlID0gMTtcblxuICAgIGlmICghZXJyb3IuZXJyb3JzKSB7XG4gICAgICBsb2cuZXJyb3IoJ1VuaGFuZGxlZCBleGNlcHRpb24hJyk7XG4gICAgICBsb2cuZXJyb3IoZXJyb3IpO1xuICAgICAgcHJvY2Vzcy5leGl0KCk7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBlIG9mIGVycm9yLmVycm9ycykge1xuICAgICAgaWYgKGUgaW5zdGFuY2VvZiBQcm9qZWN0RmFpbHVyZSkge1xuICAgICAgICBsb2cud3JpdGUoJycpO1xuICAgICAgICBsb2cuZXJyb3IoYCR7ZS5wcm9qZWN0Lm5hbWV9IGZhaWxlZFxcbiR7ZS5lcnJvci5zdGRvdXR9YCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2cuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cbiJdfQ==