import { singleton } from "tsyringe";

import { Logger } from "@services";
import { Search, Vehicle } from "src/utils/types/vehicle";

@singleton()
export class VehicleService {
  constructor(private logger: Logger) {
    this.logger.console("Service Vehicle invoked !", "info");
  }

  async fetchToolsData(vehicleName: string): Promise<Search> {
    const response = await fetch(
      `https://starcitizen.tools/rest.php/v1/search/page?q=${vehicleName}&limit=1`,
      {
        method: "GET",
      }
    );
    return await response.json();
  }

  async fetchVehicleData(vehicleName: string): Promise<any> {
    const response = await fetch(
      `https://api.star-citizen.wiki/api/vehicles/${vehicleName}`,
      {
        method: "GET",
        headers: {},
      }
    );
    return await response.json();
  }

  transformToVehicle(toolsData: Search, vehicleData: any): Vehicle {
    return {
      manufacturer: vehicleData.data.manufacturer.name,
      manufacturerId: vehicleData.data.manufacturer.code,
      name: vehicleData.data.name,
      description: vehicleData.data.description.en_EN,
      role: vehicleData.data.type.en_EN,
      crew: vehicleData.data.crew.min + "-" + vehicleData.data.crew.max,
      cargo: vehicleData.data.cargo_capacity,
      length: vehicleData.data.sizes.length,
      height: vehicleData.data.sizes.height,
      beam: vehicleData.data.sizes.beam,
      mass: vehicleData.data.mass,
      combatSpeed: vehicleData.data.speed.scm,
      afterBurner: vehicleData.data.speed.afterburner,
      maxSpeed: vehicleData.data.speed.max,
      pitch: vehicleData.data.agility.pitch,
      yaw: vehicleData.data.agility.yaw,
      roll: vehicleData.data.agility.roll,
      acceleration: {
        main: vehicleData.data.agility.acceleration.main,
        retro: vehicleData.data.agility.acceleration.retro,
        vtol: vehicleData.data.agility.acceleration.vtol,
      },
      ingamePrice: 0,
      pledgePrice: vehicleData.data.msrp || 0,
      status: vehicleData.data.production_status.en_EN,
      imageUrl: toolsData.pages[0].thumbnail.url,
    };
  }

  async getVehicleData(vehicleName: string): Promise<Vehicle> {
    const toolsData = await this.fetchToolsData(vehicleName);
    const vehicleData = await this.fetchVehicleData(vehicleName);
    return this.transformToVehicle(toolsData, vehicleData);
  }

  //TODO: Add database
}
