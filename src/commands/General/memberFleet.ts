import { Client, ParameterDecoratorEx } from "discordx";
import { Category } from "@discordx/utilities";
import {
  ApplicationCommandOptionType,
  AutocompleteFocusedOption,
  AutocompleteInteraction,
  CommandInteraction,
  EmbedBuilder,
  EmbedField,
} from "discord.js";

import { Discord, Slash, SlashOption } from "@/decorators";
import { Guard } from "@/guards";
import { injectable } from "tsyringe";
import { Manufacturer, Member, MemberShip, Ship } from "@/entities";
import { Database } from "@/services";
import { Collection, Loaded } from "@mikro-orm/core";

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

      if (focusedOption.value.length <= 1) {
        return interaction.respond([]);
      }
      const limitedResults = await this.db
        .get(Member)
        .findAutoComplete(focusedOption.value);
      return interaction.respond(
        limitedResults.map((choice: Member) => ({
          name: choice.name,
          value: choice.id.toString(),
        }))
      );
    }
    await interaction.followUp("Searching for ships...");
    const memberShips = await this.findShips(Number(member));
    if (memberShips.length === 0) {
      await interaction.editReply(
        `Could not find ships for member with id: ${member}`
      );
      return;
    }
    const embeddedMessage = new EmbedBuilder()
      .setTitle(memberShips[0].memberShips[0].member.name)
      .setColor("Aqua")
      .setAuthor({ name: "WTTC-Bot" })
      .setTimestamp()
      .setFooter({ text: "WTTC-Bot" })
      .setDescription(
        `The ships owned by ${memberShips[0].memberShips[0].member.name} (${memberShips.length})`
      );

    // Group memberShips by manufacturer
    const groupedShips = memberShips.reduce((groups: any, ship: Ship) => {
      const key = ship.manufacturer.name;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(ship);
      return groups;
    }, {});

    // Iterate over each group
    for (const manufacturer in groupedShips) {
      let ships = groupedShips[manufacturer]
        .map((ship: Ship) => "\n" + ship.model)
        .join("");

      let fields: EmbedField = {
        name: manufacturer,
        value: ships,
        inline: true,
      };

      try {
        embeddedMessage.addFields([fields]);
      } catch (e) {
        console.log(e);
      }
    }

    await interaction.editReply({ embeds: [embeddedMessage] });
  }

  async findShips(memberId: number) {
    const res = await this.db.get(Ship).findByMember(memberId);
    console.log(res);
    return res;
  }
}
