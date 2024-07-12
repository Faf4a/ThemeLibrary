/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ModalProps } from "@utils/modal";
import { User } from "discord-types/general";

export interface Theme {
    id: string;
    name: string;
    content: string;
    type: string | "theme" | "snippet";
    description: string;
    version: string;
    author: {
        github_name?: string;
        discord_name: string;
        discord_snowflake: string;
    };
    likes: number;
    tags: string[];
    thumbnail_url: string;
    release_date: string;
    guild?: {
        name: string;
        snowflake: string;
        invite_link: string;
    };
    source?: string;
}

export interface ThemeInfoModalProps extends ModalProps {
    author: User;
    theme: Theme;
}

export const enum TabItem {
    THEMES,
    SUBMIT_THEMES,
}

export interface LikesComponentProps {
    theme: Theme;
    userId: User["id"];
}

export const enum SearchStatus {
    ALL,
    ENABLED,
    DISABLED,
    THEME,
    SNIPPET,
    DARK,
    LIGHT,
    LIKED,
}

export type ThemeLikeProps = {
    status: number;
    likes: [{
        themeId: number;
        userIds: User["id"][];
    }];
};
