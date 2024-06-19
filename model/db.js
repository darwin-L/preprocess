const neo4j = require('neo4j-driver')
let driver
async function GetDb() {
    
    try {
        driver = neo4j.driver(process.env.db_uri.toString().trim(), neo4j.auth.basic(process.env.db_user.toString().trim(), process.env.db_password.toString().trim()))
        console.log('Connection estabilished')
    } catch (err) {
        console.log(`Connection error\n${err}\nCause: ${err.cause}`)
        await driver.close()
        throw err
    }
    return driver
}
module.exports = GetDb

