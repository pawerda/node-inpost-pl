/**
 * check https://b2b.paczkomaty.pl/pl/e-commerce/jak-sie-zintegrowac
 * to get to know each method required data
 */

var InPost = require('./');
var testInPost = new InPost({test: true});

testInPost.priceList(function (err, result) {
  console.log('priceList', err, result)
});

testInPost.findNearestMachines({postcode: '02-786'}, function (err, result) {
  console.log('listMachines', err, result)
});

/**
 * Testing methods with file streaming
 */

var fs = require('fs');
var content = {
  paczkomaty: [{pack: {packcode: '638111024631612017700364'}}, {pack: {packcode: '638111024631612017700363'}}]
};
var stream = testInPost.pdf.getConfimPrintOut({content: content});

stream
  .on('error', function (err) {
    console.error('getConfimPrintOut', err)
  })
  .on('response', function (response) {
    var isPdf = response.caseless.dict['content-type'] == 'application/pdf';
    if (isPdf) {
      console.log('getConfimPrintOut pdf file is ready to stream');
      // uncomment to save file
      // stream.pipe(fs.createWriteStream('printout_1.pdf'))
    } else {
      InPost.parseBody(response, function (body) {
        console.log('getConfimPrintOut response body', body)
      })
    }
  });

