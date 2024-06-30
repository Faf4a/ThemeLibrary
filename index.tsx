/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { SettingsRouter } from "@webpack/common";

const settings = definePluginSettings({
    hideWarningCard: {
        type: OptionType.BOOLEAN,
        default: false,
        description: "Hide the warning card displayed at the top of the theme library tab",
        restartNeeded: false,
    },
    domain: {
        type: OptionType.BOOLEAN,
        default: false,
        description: "Use Github instead of the default domain for themes",
        restartNeeded: false,
    },
});

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
        const customSettingsSections = (
            Vencord.Plugins.plugins.Settings as any as {
                customSections: ((ID: Record<string, unknown>) => any)[];
            }
        ).customSections;

        const ThemeSection = () => ({
            section: "ThemeLibrary",
            label: "Theme Library",
            element: require("./components/ThemeTab").default,
            id: "ThemeSection",
        });

        customSettingsSections.push(ThemeSection);
    },

    stop() {
        const customSettingsSections = (
            Vencord.Plugins.plugins.Settings as any as {
                customSections: ((ID: Record<string, unknown>) => any)[];
            }
        ).customSections;

        const i = customSettingsSections.findIndex(
            section => section({}).id === "ThemeSection"
        );

        if (i !== -1) customSettingsSections.splice(i, 1);
    },
});
