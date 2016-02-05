'use strict';
var APIRequest = require('./lib/APIRequests');

var InPost = function (options) {
  var requests = new APIRequest(options);
  return {
    listMachines: requests.setGet({action: 'listmachines_xml'}),
    findNearestMachines: requests.setGet({action: 'findnearestmachines'}),
    findMachineByName: requests.setGet({action: 'findmachinebyname'}),
    priceList: requests.setPost({action: 'pricelist'}),
    getPackStatus: requests.setGet({action: 'getpackstatus'}),
    findCustomer: requests.setGet({action: 'findcustomer'}),
    createDeliveryPacks: requests.setPost({action: 'createdeliverypacks'}),
    setCustomerRef: requests.setPost({action: 'setcustomerref'}),
    getPacksBySender: requests.setPost({action: 'getpacksbysender'}),
    cancelPack: requests.setPost({action: 'cancelpack'}),
    changePackSize: requests.setPost({action: 'change_packsize'}),
    getCodReport: requests.setPost({action: 'getcodreport'}),
    payForPack: requests.setPost({action: 'payforpack'}),
    createDispatchPoint: requests.setPost({action: 'createdispatchpoint'}),
    getDispatchPoints: requests.setPost({action: 'getdispatchpoints'}),
    updateDispatchPoint: requests.setPost({action: 'updatedispatchpoint'}),
    deleteDispatchPoint: requests.setPost({action: 'deletedispatchpoint'}),
    createDispatchOrder: requests.setPost({action: 'createdispatchorder'}),
    getDispatchOrders: requests.setPost({action: 'getdispatchorders'}),
    cancelDispatchOrder: requests.setPost({action: 'canceldispatchorder'}),
    createDeliveryLetters: requests.setPost({action: 'createdeliveryletters'}),
    csv: {
      findNearestMachines: requests.setGet({action: 'findnearestmachines_csv'}),
      listMachines: requests.setGet({action: 'listmachines_csv'})
    },
    pdf: {
      getSticker: requests.setPost({action: 'getsticker'}),
      getConfimPrintOut: requests.setPost({action: 'getconfirmprintout'}),
      getDispatchOrderPrintOut: requests.setPost({action: 'getDispatchOrderPrintOut'})
    }
  }
};

InPost.setDefault = function(options){
  return InPost.client = new InPost(options)
};

InPost.parseBody = function (response, cb) {
  var body = '';
  var isBodyXml;
  response.on('data', function (chunk) {
    body += chunk;
  });
  response.on('end', function () {
    isBodyXml = body.indexOf('<') == 0;
    cb(isBodyXml ? APIRequest.xmlParse(body) : body)
  });
};

module.exports = InPost;

