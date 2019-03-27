/********************************************************************************
 * Copyright (C) 2019 Ericsson and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import * as fs from 'fs-extra';
import { join } from 'path';
import { tmpdir } from 'os';
import { injectable, inject } from 'inversify';
import { CppBuildConfigurationServer, CppBuildConfiguration } from '../common/cpp-build-configuration-protocol';
import { FileSystem } from '@theia/filesystem/lib/common';
import { FileUri } from '@theia/core/lib/node';
import { isArray } from 'util';

// FIXME:
// root ERROR Request getMergedCompilationDatabase failed with error: Cannot read property 'directory' of null TypeError: Cannot read property 'directory' of null
//     at CppBuildConfigurationServerImpl.<anonymous> (/theia.vanilla/packages/cpp/lib/node/cpp-build-configuration-server.js:104:130)
//     at step (/theia.vanilla/packages/cpp/lib/node/cpp-build-configuration-server.js:56:23)
//     at Object.next (/theia.vanilla/packages/cpp/lib/node/cpp-build-configuration-server.js:37:53)
//     at /theia.vanilla/packages/cpp/lib/node/cpp-build-configuration-server.js:31:71
//     at new Promise (<anonymous>)
//     at __awaiter (/theia.vanilla/packages/cpp/lib/node/cpp-build-configuration-server.js:27:12)
//     at /theia.vanilla/packages/cpp/lib/node/cpp-build-configuration-server.js:100:111
//     at Array.map (<anonymous>)
//     at CppBuildConfigurationServerImpl.<anonymous> (/theia.vanilla/packages/cpp/lib/node/cpp-build-configuration-server.js:100:80)
//     at step (/theia.vanilla/packages/cpp/lib/node/cpp-build-configuration-server.js:56:23)

@injectable()
export class CppBuildConfigurationServerImpl implements CppBuildConfigurationServer {

    @inject(FileSystem)
    protected readonly fileSystem: FileSystem;

    async getMergedCompilationDatabase(params: { configurations: CppBuildConfiguration[] }): Promise<string> {
        // tslint:disable-next-line:no-any
        const entries: any = [];
        await Promise.all(params.configurations.map(async config => {
            const file = await this.fileSystem.resolveContent(
                FileUri.create(config.directory).resolve('compile_commands.json').toString());
            const parsed = JSON.parse(file.content);
            if (!isArray(parsed)) {
                throw new Error(`content is not a JSON array: ${file.stat.uri}`);
            }
            entries.push(...parsed);
        }));
        const directory = await fs.mkdtemp(join(tmpdir(), 'theia-cpp-'));
        const databasePath = FileUri.create(directory).resolve('compile_commands.json').toString();
        const fstat = await this.fileSystem.touchFile(databasePath);
        await this.fileSystem.setContent(fstat, JSON.stringify(entries));
        return databasePath;
    }

}
