import { Client } from "discordx";
import { Category } from "@discordx/utilities";
import {
  ApplicationCommandOptionType,
  AutocompleteFocusedOption,
  AutocompleteInteraction,
  CommandInteraction,
  EmbedBuilder,
  EmbedField,
} from "discord.js";

import { Discord, Slash, SlashOption } from "@decorators";
import { Guard } from "@guards";
import { injectable } from "tsyringe";
import { Manufacturer, Member, Ship } from "@entities";
import { Database } from "@services";

@Discord()
@injectable()
@Category("General")
export default class MemberFleetCommand {
  constructor(private db: Database) {}

  @Slash({
    name: "memberfleet",
    description: "Returns a list of your owned ships!",
  })
  @Guard()
  async memberFleet(
    @SlashOption({
      name: "member",
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    })
    member: string,
    interaction: CommandInteraction | AutocompleteInteraction,
    client: Client,
    { localize }: InteractionData
  ) {
    if (interaction instanceof AutocompleteInteraction) {
      const focusedOption: AutocompleteFocusedOption =
        interaction.options.getFocused(true);
      const limitedResults = await this.db
        .get(Member)
        .findAutoComplete(focusedOption.value);
      return interaction.respond(
        limitedResults.map((choice: Member) => ({
          name: choice.name,
          value: choice.name,
        }))
      );
    }
    await interaction.followUp("Searching for ships...");
    const memberShips = await this.findShips(member);
    if (memberShips.length === 0) {
      await interaction.editReply(`Could not find ships for member: ${member}`);
      return;
    }
    const embeddedMessage = new EmbedBuilder()
      .setTitle(member)
      .setColor("Aqua")
      .setAuthor({ name: "WTTC-Bot" })
      .setTimestamp()
      .setFooter({ text: "WTTC-Bot" })
      .setDescription(`The ships owned by ${member} (${memberShips.length})`);

    const manufacturers = await this.db.get(Manufacturer).findAll();
    manufacturers.forEach((manufacturer: Manufacturer) => {
      let ships: string = "";
      memberShips.forEach((ship) => {
        if (ship.manufacturer === manufacturer) {
          ships += "\n" + ship.model;
        }
      });
      let fields: EmbedField = {
        name: manufacturer.name,
        value: ships,
        inline: true,
      };
      embeddedMessage.addFields([fields]);
    });

    await interaction.editReply({ embeds: [embeddedMessage] });
  }

  async findShips(member: string): Promise<Ship[]> {
    return await this.db
      .get(Member)
      .findByName(member)
      .then((member) => member!.ships.loadItems());
  }
}
