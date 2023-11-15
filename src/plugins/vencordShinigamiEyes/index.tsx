/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import definePlugin from "@utils/types";
import { Message, User } from "discord-types/general";

interface UsernameProps {
    author: { nick: string; };
    message: Message;
    withMentionPrefix?: boolean;
    isRepliedMessage: boolean;
    userOverride?: User;
}



import { Settings } from "Vencord";

import { addTFriendlyContextMenus, removeTFriendlyContextMenus } from "./contextMenus";

export default definePlugin({
    name: "ShinigamiEyes",
    description: "Allows marking people as T-friendly, like the web extension.",
    authors: [
        {
            id: 1122748511797117000n,
            name: "Shiro (PuppyNuff)"
        }
    ],
    patches: [
        {
            find: ".useCanSeeRemixBadge)",
            replacement: {
                match: /(?<=onContextMenu:\i,children:).*?\}/,
                replace: "$self.renderTFriendly(arguments[0])}"
            }
        },
    ],

    renderTFriendly: ({ author, message, isRepliedMessage, withMentionPrefix, userOverride }: UsernameProps) => {
        try {
            const user = userOverride ?? message.author;
            const { username, id } = user;
            const { nick } = author;
            const showMeYourNameSettings = Settings.plugins.ShowMeYourName;
            const tFriendly = " · " + (JSON.parse(Settings.plugins.ShinigamiEyes.marks)[id] ?? "Unsure");

            const prefix = withMentionPrefix ? "@" : "";

            if (showMeYourNameSettings.enabled) {
                if (username === nick || isRepliedMessage && !showMeYourNameSettings.store.inReplies)
                    return prefix + nick + tFriendly;

                if (showMeYourNameSettings.mode === "user-nick")
                    return <>{prefix}{username} <span className="vc-smyn-suffix">{nick} {tFriendly}</span></>;

                if (showMeYourNameSettings.mode === "nick-user")
                    return <>{prefix}{nick} <span className="vc-smyn-suffix">{username} {tFriendly}</span></>;

                return prefix + username + " " + tFriendly;
            }

            return prefix + username + " " + tFriendly;

        } catch {
            return author?.nick;
        }
    },

    start: addTFriendlyContextMenus,
    stop: removeTFriendlyContextMenus,

});
