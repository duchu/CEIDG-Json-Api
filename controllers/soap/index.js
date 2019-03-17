const soap = require('soap')
const url =
  'https://datastore.ceidg.gov.pl/CEIDG.DataStore/services/NewDataStoreProvider.svc?singleWsdl'

const options = {
  envelopeKey: 'soapenv',
  overrideRootElement: {
    namespace: 'tem'
  },
  namespaceArrayElements: false,
  disableCache: true
}

const initialize = async () => {
  const client = await soap.createClientAsync(url, options)
  prepareEnvelope(client)
  return client
}

const prepareEnvelope = soapClient => {
  soapClient.wsdl.definitions.xmlns.tem = 'http://tempuri.org/'
  soapClient.wsdl.definitions.xmlns.arr =
    'http://schemas.microsoft.com/2003/10/Serialization/Arrays'
  soapClient.wsdl.xmlnsInEnvelope = soapClient.wsdl._xmlnsMap()
}

let _reduceWithPrefix = prefixSchema => Fn => obj => Fn(obj, prefixSchema)

let soapifyArray = _reduceWithPrefix(() => `arr:string`)((arr, prefix) =>
  arr.reduce((acu, cur) => {
    acu.push({ [prefix()]: cur })
    return acu
  }, [])
)

let soapifyObj = _reduceWithPrefix(param => `tem:${param}`)((obj, prefix) =>
  Object.keys(obj).reduce((acu, cur) => {
    let curentObjVal = obj[cur]
    acu[prefix(cur)] =
      typeof curentObjVal === 'string'
        ? curentObjVal
        : Array.isArray(curentObjVal)
        ? soapifyArray(curentObjVal)
        : soapifyObj(curentObjVal)
    return acu
  }, {})
)

module.exports = {
  initialize,
  soapifyObj,
  soapifyArray
}
