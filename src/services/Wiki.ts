import { singleton } from 'tsyringe'

import { Logger } from '@services'

@singleton()
export class Wiki {

    constructor(
        private logger: Logger
    ) {
        this.logger.console('Service Wiki invoked !', 'info')
    }
    
    async getManufacturer(manufacturer: string){
        const toolsResponse = await fetch(
            `https://starcitizen.tools/rest.php/v1/search/page?q=${manufacturer}&limit=10`,
            {
                method: "GET",
            }
            );
        const toolsData = await toolsResponse.json();
    }
}