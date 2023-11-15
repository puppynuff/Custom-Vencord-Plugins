/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { addContextMenuPatch, findGroupChildrenByChildId, NavContextMenuPatchCallback, removeContextMenuPatch } from "@api/ContextMenu";
import { Menu } from "@webpack/common";
import { Settings } from "Vencord";

function getMarks() {
    return JSON.parse(Settings.plugins.ShinigamiEyes.marks ?? "{}");
}

function tFriendlyMenuItems(userID: string) {
    return (
        <>
            <Menu.MenuSeparator></Menu.MenuSeparator>
            <Menu.MenuItem
                id="mark-tfriendly"
                label="Mark as T-friendly"
                action={() => {
                    const marks = getMarks();
                    marks[userID] = "T-Friendly";
                    Settings.plugins.ShinigamiEyes.marks = JSON.stringify(marks);
                }}></Menu.MenuItem>
            <Menu.MenuItem
                id="mark-unsure"
                label="Mark unsure"
                action={() => {
                    const marks = getMarks();
                    marks[userID] = undefined;
                    Settings.plugins.ShinigamiEyes.marks = JSON.stringify(marks);
                }}></Menu.MenuItem>
            <Menu.MenuItem
                id="mark-anti-t"
                label="Mark Anti-T"
                action={() => {
                    const marks = getMarks();
                    marks[userID] = "Anti-T";
                    Settings.plugins.ShinigamiEyes.marks = JSON.stringify(marks);
                }}></Menu.MenuItem>
            <Menu.MenuSeparator></Menu.MenuSeparator>
        </>

    );
}

const userContext: NavContextMenuPatchCallback = (children, props) => () => {
    const container = findGroupChildrenByChildId("user-profile", children);

    if (container)
        container.push(tFriendlyMenuItems(props.user.id));

};

export function addTFriendlyContextMenus() {
    addContextMenuPatch("user-context", userContext);
}

export function removeTFriendlyContextMenus() {
    removeContextMenuPatch("user-context", userContext);
}
