/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import SettingsPlugin from "@plugins/_core/settings";
import definePlugin from "@utils/types";
import { SettingsRouter } from "@webpack/common";

import { settings } from "./utils/settings";

export default definePlugin({
    name: "ThemeLibrary",
    description: "A library of themes for Vencord.",
    authors: [
        {
            name: "Fafa",
            id: 428188716641812481n,
        },
    ],
    settings,
    toolboxActions: {
        "Open Theme Library": () => {
            SettingsRouter.open("ThemeLibrary");
        },
    },

    start() {
        const { customSections } = SettingsPlugin;

        customSections.push(() => ({
            section: "ThemeLibrary",
            label: "Theme Library",
            searchableTitles: ["Theme Library"],
            element: require("./components/ThemeTab").default,
            id: "ThemeLibrary",
        }));
    },

    stop() {
        const { customSections } = SettingsPlugin;
        const section = customSections.findIndex(section => section({} as any).id === "ThemeLibrary");
        if (section !== -1) customSections.splice(section, 1);
    },
});
