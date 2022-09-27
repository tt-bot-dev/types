/**
 * Copyright (C) 2021 tt.bot dev team
 * 
 * This file is part of @tt-bot-dev/types.
 * 
 * @tt-bot-dev/types is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * @tt-bot-dev/types is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with @tt-bot-dev/types.  If not, see <http://www.gnu.org/licenses/>.
 */

import type { ServerOptions as HTTPSServerOptions } from "https";
import type { Client } from "sosamba";
import type { Member } from "eris";

/**
 * Typings to support tt.bot's web server
 */
declare namespace ttBot {

    /**
     * Global bot configuration
     */
    export interface Config {
        token: string;
        clientID: string;
        clientSecret: string;

        ownerID: string | string[];
        prefix: string;
        database: {
            provider: (client: TTBotClient) => typeof DBProvider,
            options: unknown
        };
        serverLogChannel: string;
        announcementChannelID: string;
        workerCount: number;
        encryptionIv: string;

        botsGGKey?: string;
        topGGKey?: string;
        gistKey?: string;

        webserver: {
            host?: string;
            serveStatic: boolean;
            display: string | ((path: string) => string);
            httpPort: number;
            httpsPort?: number;
            httpsSettings?: HTTPSServerOptions;
        }

        normalDateFormat: Intl.DateTimeFormatOptions;
        tzDateFormat: Intl.DateTimeFormatOptions;

        homeGuild: string;
        deployCommandsToHomeGuild: boolean;
    }

    /**
     * Abstracts away DB operations
     */
    export abstract class DBProvider {
        sosamba: Client;

        getGuildConfig(guildID: string): Promise<GuildConfig | null>;
        updateGuildConfig(guildID: string, data: Partial<GuildConfig>): Promise<void>;
        createGuildConfig(data: Partial<GuildConfig>): Promise<void>;

        getUserProfile(userID: string): Promise<UserProfile | null>;
        createUserProfile(data: Partial<UserProfile>): Promise<void>;
        updateUserProfile(userID: string, data: Partial<UserProfile>): Promise<void>;
        deleteUserProfile(userID: string): Promise<void>;

        getGuildModlog(guildID: string): Promise<GuildModLog | null>;
        insertNewModlog(guildID: string): Promise<void>;
        updateModlog(guildID: string, data: Partial<GuildModLog>): Promise<void>;

        getTag(name: string): Promise<Tag | null>;
        deleteTag(name: string): Promise<void>;
        updateTag(name: string, data: Partial<Tag>): Promise<void>;
        createTag(name: string, data: Partial<Tag>): Promise<void>;

        getGuildExtensions(guildID: string, trigger?: string): Promise<GuildExtension[]>;
        getGuildExtensionStore(guildID: string, storeID: string): Promise<GuildExtensionStore | null>;
        createGuildExtensionStore(guildID: string, storeID: string, data?: string): Promise<void>;
        createGuildExtension(data: Partial<GuildExtension>): Promise<void>;
        deleteGuildExtension(guildID: string): Promise<void>;
        deleteGuildExtensionStore(guildID: string, storeID: string): Promise<void>;
        updateGuildExtensionStore(guildID: string, storeID: string, data: string): Promise<void>;
        updateGuildExtension(id: string, data: Partial<GuildExtension>): Promise<void>;
        getGuildExtension(id: string): Promise<GuildExtension>;


        getGuildPhoneNumbers(guildID: string): Promise<GuildPhone[]>;
        getPhoneNumber(number: string): Promise<GuildPhone | null>;
        createPhoneNumber(data: Partial<GuildPhone>): Promise<void>;
        getChannelPhoneNumbers(guildID: string, channelID: string): Promise<GuildPhone[]>;

        getSession<S>(sessionID: string): Promise<Session<S>>;
        setSession<S>(sessionID: string, data: Session<S>): Promise<void>;
        removeSession(sessionID: string): Promise<void>;
        purgeSessions(): Promise<void>;

        getBlacklistedGuilds(): Promise<GuildBlacklist[]>;
        getBlacklistedGuildById(guildID: string): Promise<GuildBlacklist | null>;
        addBlacklistedGuild(guildID: string, ownerID: string, reason: string): Promise<void>;
        removeBlacklistedGuild(id: string): Promise<void>;

        databaseSetup(): Promise<void>;
    }

    export class TTBotClient extends Client {
        db: DBProvider;
        dataEncryption: {
            encrypt(data: string): string;
            decrypt(data: string): string;
        }
        isAdmin(member: Member, botOwnerIsAdmin?: boolean): boolean;
    }

    export interface GuildPhone {}
    export interface GuildExtension {
        allowedChannels: string[];
        allowedRoles: string[];
        commandTrigger: string;
        store: string;
        code: string;
        name: string;
        flags: number;
        privilegedFlags: number;
        id: string;
        guildID: string;
    }
    export interface GuildExtensionStore {
        id: [string, string];
        store: string;
    }
    export interface UserProfile {
        id: string;
        timezone: string | null;
        locale: string | null;
        fake?: boolean;
    }
    export interface GuildConfig {
        id: string;
        prefix: string;
        modRole?: string;
        farewellMessage?: string;
        farewellChannelId?: string;
        greetingMessage?: string;
        greetingChannelId?: string;
        agreeChannel?: string;
        memberRole?: string;
        logChannel?: string;
        logEvents?: string;
        modlogChannel?: string;
        locale?: string;
    }
    export interface GuildModLog {}
    export interface GuildBlacklist {}
    export interface Tag {}

    export interface Session<T> {
        expires: number;
        data: T;
    }
}

export = ttBot;