import Command from "../index";
import {  ChatInputCommandInteraction } from "discord.js";

class DateParser extends Command {
    constructor() {
        super(
            "parsedate",
            "Parses a date into a readable format",
            "parseDate <date>",
            [],
            "Utility",
            0,
            []
        );

        this.getCommandBuilder()
            .addNumberOption(option => option.setName("date").setDescription("The date number to parse.").setRequired(true));
    }

    override async run(interaction: ChatInputCommandInteraction): Promise<void> {
        interaction.reply({
            content: `<t:${Math.floor(interaction.options.getNumber("date"))}:R>`
        })
    }
}

export default DateParser;