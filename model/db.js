const neo4j = require('neo4j-driver')

const URI = 'neo4j://192.168.1.114'
const USER = 'neo4j'
const PASSWORD = 'darwinneo4j'
let driver
async function GetDb() {
    
    try {
        driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD))
        const serverInfo = await driver.getServerInfo()
        console.log('Connection estabilished')
        console.log(serverInfo)
    } catch (err) {
        console.log(`Connection error\n${err}\nCause: ${err.cause}`)
        await driver.close()
        throw err
    }
    return driver
}
module.exports = GetDb

