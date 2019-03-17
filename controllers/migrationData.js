const { parseString } = require('xml2js')
const soap = require('./soap')
const { soapifyObj } = soap
const { DataStoreParams } = require('../utils/constants')

const getByQuery = async query => {
  const soapClient = await soap.initialize()
  const soapArgs = Object.assign(
    { ['tem:AuthToken']: process.env.CEIDG_KEY },
    prepareSoapArgs(query)
  )

  try {
    let result
    let [
      soapResult
    ] = await soapClient.GetMigrationDataExtendedAddressInfoAsync(soapArgs)

    parseString(
      soapResult['GetMigrationDataExtendedAddressInfoResult'],
      (err, parseResult) => {
        result = parseResult
      }
    )
    return result
  } catch (err) {
    // to do
  }
}

let prepareSoapArgs = args => soapifyObj(captureDataStoreArgs(args))

let captureDataStoreArgs = queryAgs =>
  Object.keys(queryAgs)
    .filter(key => DataStoreParams[key])
    .reduce((accu, curr) => {
      accu[curr] = queryAgs[curr]
      return accu
    }, {})

module.exports = {
  getByQuery
}
