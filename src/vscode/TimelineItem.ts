import type * as vscode from 'vscode';

import type { IconPath } from './extHostTypes';
import { isUri } from './uri';

export enum TimelineTriggerKind {
    Invoke = 1,
    Automatic = 2,
}

export class TimelineItem {
    label?: string;
    id?: string;
    iconPath?: IconPath;
    description?: string;
    tooltip?: string | vscode.MarkdownString | undefined;
    command?: vscode.Command;
    resourceUri?: vscode.Uri;
    contextValue?: string;
    accessibilityInformation?: vscode.AccessibilityInformation;

    constructor(label: string, timestamp: number);
    constructor(resourceUri: vscode.Uri, timestamp: number);
    constructor(
        labelOrUri: string | vscode.Uri,
        public timestamp: number,
    ) {
        if (isUri(labelOrUri)) {
            this.resourceUri = labelOrUri;
        } else {
            this.label = labelOrUri;
        }
    }
}
