import 'reflect-metadata'
import 'dotenv/config'

import { container } from 'tsyringe'
import { DIService, Client } from 'discordx'
import { importx } from '@discordx/importer'

import { Database, ImagesUpload, ErrorHandler } from '@services'
import { initDataTable } from '@utils/functions'

import { clientConfig } from './client'
import { generalConfig } from '@config'

async function run() {
    // init the sqlite database
    const db = container.resolve(Database)
    await db.initialize()

    // init the client
    DIService.container = container
    const client = new Client(clientConfig)
    container.registerInstance(Client, client)

    // init the error handler
    container.resolve(ErrorHandler);

    // import all the commands and events
    await importx(__dirname + "/{events,commands}/**/*.{ts,js}")
        
    // init the data table if it doesn't exist
    await initDataTable()

    // log in with the bot token
    if (!process.env.BOT_TOKEN) throw Error("Could not find BOT_TOKEN in your environment")
    await client.login(process.env.BOT_TOKEN)

    // upload images to imgur if configured
    if (process.env.IMGUR_CLIENT_ID && generalConfig.automaticUploadImagesToImgur) {
        container.resolve(ImagesUpload).synchroWithDatabase()
    }
}

run()