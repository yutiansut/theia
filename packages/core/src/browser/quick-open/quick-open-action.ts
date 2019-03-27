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

import { Disposable } from '../../common/disposable';
import { injectable, unmanaged } from 'inversify';

export interface QuickOpenAction extends Disposable {
    id: string;
    label: string;
    tooltip: string;
    class: string | undefined;
    enabled: boolean;
    checked: boolean;
    radio: boolean;
    // tslint:disable-next-line:no-any
    run(event?: any): PromiseLike<any>;
}

export interface QuickOpenActionProvider {
    // tslint:disable-next-line:no-any
    hasActions(item: any): boolean;
    // tslint:disable-next-line:no-any
    getActions(item: any): Promise<QuickOpenAction[]>;
}

@injectable()
export abstract class QuickOpenBaseAction implements QuickOpenAction {
    protected actionId: string;
    protected actionLabel: string;
    protected actionTooltip: string;
    protected actionCssClass: string | undefined;
    protected actionEnabled: boolean;
    protected actionChecked: boolean;
    protected actionRadio: boolean;

    constructor(
        @unmanaged() id: string,
        @unmanaged() label: string = '',
        @unmanaged() cssClass: string = '',
        @unmanaged() enabled: boolean = true) {
        this.actionId = id;
        this.actionLabel = label;
        this.actionCssClass = cssClass;
        this.actionEnabled = enabled;
    }

    get id(): string {
        return this.actionId;
    }

    get label(): string {
        return this.actionLabel;
    }

    set label(value: string) {
        this.actionLabel = value;
    }

    get tooltip(): string {
        return this.actionTooltip;
    }

    set tooltip(value: string) {
        this.tooltip = value;
    }

    get class(): string | undefined {
        return this.actionCssClass;
    }

    set class(value: string | undefined) {
        this.actionCssClass = value;
    }

    get enabled(): boolean {
        return this.actionEnabled;
    }

    set enabled(value: boolean) {
        this.actionEnabled = value;
    }

    get checked(): boolean {
        return this.actionChecked;
    }

    set checked(value: boolean) {
        this.actionChecked = value;
    }

    get radio(): boolean {
        return this.actionRadio;
    }

    set radio(value: boolean) {
        this.actionRadio = value;
    }

    // tslint:disable-next-line:no-any
    abstract run(event?: any): PromiseLike<any>;

    dispose(): void { }
}
