import { PrismaClient } from "@prisma/client";
import { Interaction, SlashCommandBuilder, Client, REST } from "discord.js";
import { DatabaseConnections } from "..";

class Command {
    private name: string;
    private description: string;
    private usage: string;
    private aliases: string[];
    private category: string;
    private cooldown: number;
    private allowedRoles: string[];
    private commandBuilder: SlashCommandBuilder;

    constructor(name: string, description: string, usage: string, aliases: string[], category: string, cooldown: number, allowedRoles: string[]) {
        this.name = name;
        this.description = description;
        this.usage = usage;
        this.aliases = aliases;
        this.category = category;
        this.cooldown = cooldown;
        this.allowedRoles = allowedRoles;
        this.commandBuilder =
            new SlashCommandBuilder()
                .setName(this.name)
                .setDescription(this.description);
    }

    // Getters
    public getName(): string {
        return this.name;
    }
    public getDescription(): string {
        return this.description;
    }
    public getUsage(): string {
        return this.usage;
    }
    public getAliases(): string[] {
        return this.aliases;
    }
    public getCategory(): string {
        return this.category;
    }
    public getCooldown(): number {
        return this.cooldown;
    }
    public getAllowedRoles(): string[] {
        return this.allowedRoles;
    }
    public getCommandBuilder(): SlashCommandBuilder {
        return this.commandBuilder;
    }

    // Utility
    public canUserUse(roles: string[]): boolean {
        return this.allowedRoles.length === 0 || this.allowedRoles.some(role => roles.includes(role));
    }

    // Misc
    public async run(interaction: Interaction, client: Client, mainDB: PrismaClient, databaseConnections: DatabaseConnections, rest: REST): Promise<void> {
        // make typescript shut up
        interaction && client && mainDB && rest && databaseConnections;
        throw new Error("Method not implemented.");
    }

    public async autocomplete(interaction: Interaction): Promise<void> {
        // make typescript shut up
        interaction;
        throw new Error("Method not implemented.");
    }
}
export default Command;