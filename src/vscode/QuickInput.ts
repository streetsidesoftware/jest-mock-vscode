import type { IconPath } from './extHostTypes';

/**
 * Specifies the location where a {@link QuickInputButton} should be rendered.
 */
export enum QuickInputButtonLocation {
    /**
     * The button is rendered in the title bar.
     */
    Title = 1,

    /**
     * The button is rendered inline to the right of the input box.
     */
    Inline = 2,

    /**
     * The button is rendered at the far end inside the input box.
     */
    Input = 3,
}

/**
 * A button for an action in a {@link QuickPick} or {@link InputBox}.
 */
export interface QuickInputButton {
    /**
     * The icon for the button.
     */
    readonly iconPath: IconPath;

    /**
     * An optional tooltip displayed when hovering over the button.
     */
    readonly tooltip?: string | undefined;

    /**
     * The location where the button should be rendered.
     *
     * Defaults to {@link QuickInputButtonLocation.Title}.
     *
     * **Note:** This property is ignored if the button was added to a {@link QuickPickItem}.
     */
    location?: QuickInputButtonLocation;

    /**
     * When present, indicates that the button is a toggle button that can be checked or unchecked.
     */
    readonly toggle?: {
        /**
         * Indicates whether the toggle button is currently checked.
         * This property will be updated when the button is toggled.
         */
        checked: boolean;
    };
}
