/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Settings } from "@api/Settings";
import { Button, Card, Forms, Parser, React, UserUtils, FluxDispatcher, UserStore } from "@webpack/common";
import { ModalContent, ModalFooter, ModalHeader, ModalRoot, ModalSize, openModal } from "@utils/modal";
import { proxyLazy } from "@utils/lazy";
import { Constructor } from "type-fest";
import { User } from "discord-types/general";
import { Margins } from "@utils/margins";
import { OpenExternalIcon } from "@components/Icons";
import { LikesComponent } from "./LikesComponent";
import { ThemeInfoModal } from "./ThemeInfoModal";
import { generateId } from "@api/Commands";

import type { Theme, ThemeLikeProps } from "../types";
import { apiUrl } from "./ThemeTab";

interface ThemeCardProps {
    theme: Theme;
    themeLinks: string[];
    likedThemes?: ThemeLikeProps;
    setThemeLinks: (links: string[]) => void;
    removePreview?: boolean;
    removeButtons?: boolean;
}

const UserRecord: Constructor<Partial<User>> = proxyLazy(() => UserStore.getCurrentUser().constructor) as any;

function makeDummyUser(user: { username: string; id?: string; avatar?: string; }) {
    const newUser = new UserRecord({
        username: user.username,
        id: user.id ?? generateId(),
        avatar: user.avatar,
        bot: true,
    });
    FluxDispatcher.dispatch({
        type: "USER_UPDATE",
        user: newUser,
    });
    return newUser;
}

export const ThemeCard: React.FC<ThemeCardProps> = ({ theme, themeLinks, likedThemes, setThemeLinks, removeButtons, removePreview }) => {

    const getUser = (id: string, username: string) => UserUtils.getUser(id) ?? makeDummyUser({ username, id });

    const handleAddRemoveTheme = () => {
        const onlineThemeLinks = themeLinks.includes(`${apiUrl}/${theme.name}`)
            ? themeLinks.filter(link => link !== `${apiUrl}/${theme.name}`)
            : [...themeLinks, `${apiUrl}/${theme.name}`];

        setThemeLinks(onlineThemeLinks);
        Vencord.Settings.themeLinks = onlineThemeLinks;
    };

    const handleThemeAttributesCheck = () => {
        const requiresThemeAttributes = theme.requiresThemeAttributes ?? false;

        if (requiresThemeAttributes && !Settings.plugins.ThemeAttributes.enabled) {
            openModal(modalProps => (
                <ModalRoot {...modalProps} size={ModalSize.SMALL}>
                    <ModalHeader>
                        <Forms.FormTitle tag="h4">Hold on!</Forms.FormTitle>
                    </ModalHeader>
                    <ModalContent>
                        <Forms.FormText style={{ padding: "8px" }}>
                            <p>This theme requires the <b>ThemeAttributes</b> plugin to work properly!</p>
                            <p>Do you want to enable it?</p>
                        </Forms.FormText>
                    </ModalContent>
                    <ModalFooter>
                        <Button
                            look={Button.Looks.FILLED}
                            color={Button.Colors.GREEN}
                            onClick={() => {
                                Settings.plugins.ThemeAttributes.enabled = true;
                                modalProps.onClose();
                                handleAddRemoveTheme();
                            }}
                        >
                            Enable Plugin
                        </Button>
                        <Button
                            color={Button.Colors.RED}
                            look={Button.Looks.FILLED}
                            className={Margins.right8}
                            onClick={() => modalProps.onClose()}
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalRoot>
            ));
        } else {
            handleAddRemoveTheme();
        }
    };

    const handleViewSource = () => {
        const content = window.atob(theme.content);
        const metadata = content.match(/\/\*\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g)?.[0] || "";
        const source = metadata.match(/@source\s+(.+)/)?.[1] || "";

        if (source) {
            VencordNative.native.openExternal(source);
        } else {
            VencordNative.native.openExternal(`${apiUrl}/${theme.name}`);
        }
    };

    return (
        <Card style={{ padding: ".5rem", marginBottom: ".5em", marginTop: ".5em", display: "flex", flexDirection: "column", backgroundColor: "var(--background-secondary-alt)" }} key={theme.id}>
            <Forms.FormTitle tag="h2" style={{ overflowWrap: "break-word", marginTop: 8 }} className="vce-theme-text">
                {theme.name}
            </Forms.FormTitle>
            <Forms.FormText className="vce-theme-text">
                {Parser.parse(theme.description)}
            </Forms.FormText>
            {!removePreview && (
                <img role="presentation" src={theme.thumbnail_url} loading="lazy" alt={theme.name} className="vce-theme-info-preview" />
            )}
            <div className="vce-theme-info">
                <div style={{ justifyContent: "flex-start", flexDirection: "column" }}>
                    {theme.tags && (
                        <Forms.FormText>
                            {theme.tags.map(tag => (
                                <span className="vce-theme-info-tag" key={tag}>
                                    {tag}
                                </span>
                            ))}
                        </Forms.FormText>
                    )}
                    {!removeButtons && (
                        < div style={{ marginTop: "8px", display: "flex", flexDirection: "row" }}>
                            <Button
                                onClick={handleThemeAttributesCheck}
                                size={Button.Sizes.MEDIUM}
                                color={themeLinks.includes(`${apiUrl}/${theme.name}`) ? Button.Colors.RED : Button.Colors.GREEN}
                                look={Button.Looks.FILLED}
                                className={Margins.right8}
                                disabled={!theme.content || theme.id === "preview"}
                            >
                                {themeLinks.includes(`${apiUrl}/${theme.name}`) ? "Remove Theme" : "Add Theme"}
                            </Button>
                            <Button
                                onClick={async () => {
                                    const authors = Array.isArray(theme.author)
                                        ? await Promise.all(theme.author.map(author => getUser(author.discord_snowflake, author.discord_name)))
                                        : [await getUser(theme.author.discord_snowflake, theme.author.discord_name)];

                                    openModal(props => <ThemeInfoModal {...props} author={authors} theme={theme} />);
                                }}
                                size={Button.Sizes.MEDIUM}
                                color={Button.Colors.BRAND}
                                look={Button.Looks.FILLED}
                            >
                                Theme Info
                            </Button>
                            <LikesComponent themeId={theme.id} likedThemes={likedThemes} />
                            <Button
                                onClick={handleViewSource}
                                size={Button.Sizes.MEDIUM}
                                color={Button.Colors.LINK}
                                look={Button.Looks.LINK}
                                disabled={!theme.content || theme.id === "preview"}
                                style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                                View Source <OpenExternalIcon height={16} width={16} />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Card >
    );
};
