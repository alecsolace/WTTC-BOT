
import { Service } from "@/decorators";
import { Logger } from "@/services";
import { Search, Vehicle } from "src/utils/types/vehicle";

@Service()
export class Wiki {
  constructor(private logger: Logger) {
    this.logger.console("Service Wiki invoked!", "info");
  }

  async getManufacturer(manufacturer: string) {
    const toolsResponse = await fetch(
      `https://starcitizen.tools/rest.php/v1/search/page?q=${manufacturer}&limit=10`,
      {
        method: "GET",
      }
    );
    const toolsData = await toolsResponse.json();
    console.log(toolsData);
    return "";
  }

  async getVehicleData(vehicleName: string) {
    const toolsResponse = await fetch(
      `https://starcitizen.tools/rest.php/v1/search/page?q=${vehicleName}&limit=1`,
      {
        method: "GET",
      }
    );
    const toolsData: Search = await toolsResponse.json();
    console.log(toolsData.pages[0].thumbnail);
    const imageUrl = toolsData.pages[0].thumbnail.url;
    const response = await fetch(
      `https://api.star-citizen.wiki/api/vehicles/${vehicleName}`,
      {
        method: "GET",
        headers: {},
      }
    );
    const result = await response.json();
    let vehicle: Vehicle = {
      manufacturer: result.data.manufacturer.name,
      manufacturerId: result.data.manufacturer.code,
      name: result.data.name,
      description: result.data.description.en_EN,
      role: result.data.type.en_EN,
      crew: result.data.crew.min + "-" + result.data.crew.max,
      cargo: result.data.cargo_capacity,
      length: result.data.sizes.length,
      height: result.data.sizes.height,
      beam: result.data.sizes.beam,
      mass: result.data.mass,
      combatSpeed: result.data.speed.scm,
      afterBurner: result.data.speed.afterburner,
      maxSpeed: result.data.speed.max,
      pitch: result.data.agility.pitch,
      yaw: result.data.agility.yaw,
      roll: result.data.agility.roll,
      acceleration: {
        main: result.data.agility.acceleration.main,
        retro: result.data.agility.acceleration.retro,
        vtol: result.data.agility.acceleration.vtol,
      },
      ingamePrice: 0,
      pledgePrice: result.data.msrp || 0,
      status: result.data.production_status.en_EN,
      imageUrl: imageUrl,
    };
    return vehicle;
  }
}
