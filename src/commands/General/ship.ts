import {Client} from "discordx";
import {Category} from "@discordx/utilities";
import {
    ApplicationCommandOptionType,
    AutocompleteFocusedOption,
    AutocompleteInteraction,
    CommandInteraction,
    Embed,
    EmbedBuilder,
} from "discord.js";

import {Discord, Slash, SlashOption} from "@decorators";
import {Guard} from "@guards";
import {injectable} from "tsyringe";
import {Database, Google, Logger, VehicleService} from "@services";
import {Vehicle} from "src/utils/types/vehicle";
import {Ship} from "@entities";

@Discord()
@Category("General")
@injectable()
export default class ShipCommand {
    constructor(private vehicleService: VehicleService, private db: Database) {
    }

    @Slash({
        name: "ship",
        description: "Get information about any ship!",
    })
    @Guard()
    async ship(
        @SlashOption({
            name: "manufacturer",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true,
        })
            brand: string,
        @SlashOption({
            name: "model",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true,
        })
            model: string,
        interaction: CommandInteraction | AutocompleteInteraction,
        client: Client,
        {localize}: InteractionData
    ) {
        if (interaction instanceof AutocompleteInteraction) {
            const shipsRepo = this.db.get(Ship);
            const ships = await shipsRepo.findAll();
            const focusedOption: AutocompleteFocusedOption =
                this.getFocusedOption(interaction);
            let uniqueArray;
            let filteredArray;
            let limitedArray: string[] = [];
            if (focusedOption.name === "manufacturer") {
                uniqueArray = this.getUniqueManufacturers(ships);
                filteredArray = this.filterByFocusedOption(uniqueArray, focusedOption);
                limitedArray = this.limitResults(filteredArray, 25);
            } else if (focusedOption.name === "model") {
                uniqueArray = this.getUniqueModels(ships);
                filteredArray = this.filterByFocusedOption(uniqueArray, focusedOption);
                limitedArray = this.limitResults(filteredArray, 25);
            }
            return await this.respondWithManufacturers(interaction, limitedArray);
        } else {
            const vehicleName = `${brand} ${model}`;
            const vehicle = await this.vehicleService.getVehicleData(vehicleName);
            const embed = this.createVehicleEmbed(vehicle);
            await interaction.followUp({embeds: [embed]});
        }
    }

    getFocusedOption(
        interaction: AutocompleteInteraction
    ): AutocompleteFocusedOption {
        return interaction.options.getFocused(true);
    }

    getUniqueManufacturers(ships: any[]): string[] {
        return [...new Set(ships.map((ship) => ship.manufacturer))];
    }

    getUniqueModels(ships: any[]): string[] {
        return [...new Set(ships.map((ship) => ship.model))];
    }

    filterByFocusedOption(
        array: string[],
        focusedOption: AutocompleteFocusedOption
    ): string[] {
        return array.filter((item) =>
            item.toLowerCase().startsWith(focusedOption.value.toLowerCase())
        );
    }

    limitResults(array: string[], limit: number): string[] {
        return array.slice(0, limit);
    }

    async respondWithManufacturers(
        interaction: AutocompleteInteraction,
        manufacturers: string[]
    ) {
        return interaction.respond(
            manufacturers.map((manufacturer) => ({
                name: manufacturer,
                value: manufacturer,
            }))
        );
    }

    createVehicleEmbed(vehicle: Vehicle): EmbedBuilder {
        const embed = new EmbedBuilder()
            .setTitle(vehicle.name)
            .setDescription(vehicle.description)
            .addFields([
                {name: "Manufacturer", value: vehicle.manufacturer, inline: true},
                {name: "Role", value: vehicle.role, inline: true},
                {name: "Crew", value: vehicle.crew, inline: true},
                {name: "Cargo", value: vehicle.cargo.toString(), inline: true},
                {name: "Length", value: vehicle.length.toString(), inline: true},
                {name: "Height", value: vehicle.height.toString(), inline: true},
                {name: "Beam", value: vehicle.beam.toString(), inline: true},
                {name: "Mass", value: vehicle.mass.toString(), inline: true},
                {
                    name: "Combat Speed",
                    value: vehicle.combatSpeed.toString(),
                    inline: true,
                },
                {
                    name: "After Burner",
                    value: vehicle.afterBurner.toString(),
                    inline: true,
                },
                {name: "Max Speed", value: vehicle.maxSpeed.toString(), inline: true},
                {name: "Pitch", value: vehicle.pitch.toString(), inline: true},
                {name: "Yaw", value: vehicle.yaw.toString(), inline: true},
                {name: "Roll", value: vehicle.roll.toString(), inline: true},
                {
                    name: "Acceleration",
                    value: `Main: ${vehicle.acceleration.main}, Retro: ${vehicle.acceleration.retro}, VTOL: ${vehicle.acceleration.vtol}`,
                    inline: true,
                },
                {
                    name: "Ingame Price",
                    value: vehicle.ingamePrice.toString(),
                    inline: true,
                },
                {
                    name: "Pledge Price",
                    value: vehicle.pledgePrice.toString(),
                    inline: true,
                },
                {name: "Status", value: vehicle.status, inline: true},
            ]);
        if (vehicle.imageUrl) embed.setThumbnail(vehicle.imageUrl);
        return embed;
    }

    private async handleAutoComplete(interaction: AutocompleteInteraction) {
    }
}
