/********************************************************************************
 * Copyright (C) 2019 Red Hat, Inc. and others.
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

import { injectable, inject } from 'inversify';
import { TaskService } from './task-service';
import { QuickOpenBaseAction, QuickOpenActionProvider, QuickOpenAction } from '@theia/core/lib/browser/quick-open/quick-open-action';

@injectable()
export class ConfigureTaskAction extends QuickOpenBaseAction {

    @inject(TaskService)
    protected readonly taskService: TaskService;

    constructor() {
        super('configure:task', '', 'fa fa-cog');
    }

    // tslint:disable-next-line:no-any
    async run(event?: any): Promise<void> {
        if (event && event.item && event.item.getTask) {
            this.taskService.configure(event.item.getTask());
        }
    }
}

@injectable()
export class TaskActionProvider implements QuickOpenActionProvider {

    @inject(ConfigureTaskAction)
    protected configureTaskAction: ConfigureTaskAction;

    hasActions(): boolean {
        return true;
    }

    async getActions(): Promise<QuickOpenAction[]> {
        return [this.configureTaskAction];
    }
}
