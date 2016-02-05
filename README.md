# inpost-pl
node.js InPost.pl API wrapper
Version 1.0.0

Details: https://b2b.paczkomaty.pl/pl/e-commerce/jak-sie-zintegrowac
Download API docs: https://b2b.paczkomaty.pl/file/8

## Usage:

```text
$npm install inpost-pl
```

#### then:

```javascript
var InPost = require('inpost-pl');
var inPostClient = new InPost(options);
```

* options.auth = {email: 'your@email.com', password: 'password'} OR:
* options.test = true (putting test credentials)
* options.raw = true (returning XML result not JSON)
 
#### How to use InPost client? 

**inPostClient** has 25 methods listed on **index.js** file. 
Each method has its **action** name which is "do" parameter (check in docs) and takes 0 to 2 arguments: 
**(parameters, callback)**

Parameters for each method are described in docs. Example call with callback:

```javascript
inPostClient.findNearestMachines({postcode: '02-786'}, function(err, result){
  console.log('listMachines', err, result)
});

inPostClient.priceList(function(err, result){
  console.log('priceList', err, result)
});
```

**email** and **password** parameters are not required if you set **options.auth** or **options.test**

##### Content parameter

You can pass **content** parameter as object:

```javascript
var content = {
  paczkomaty:[{pack: {packcode: '638111024631612017700364'}},{pack: {packcode: '638111024631612017700363'}}]
};
```

or XML string:

```javascript
var content = '<paczkomaty>';
content += '<pack><packcode>638111024631612017700364</packcode></pack>';
content += '<pack><packcode>638111024631612017700363</packcode></pack>';
content += '</paczkomaty>';
```


##### Handling files

Each method also returning its request, so you can pipe it. 

```javascript
var stream = inPostClient.pdf.getConfimPrintOut({content: content});
stream
  .on('error', function(err){
    console.error('getConfimPrintOut', err)
  })
  .on('response', function(response){
    var isPdf = response.caseless.dict['content-type'] == 'application/pdf';
    if(isPdf) {
      stream.pipe(fs.createWriteStream('printout_1.pdf'))
    } else {
      InPost.parseBody(response, function(body){
        console.log('getConfimPrintOut response body', body)
      })
    }
  });
```

##### InPost methods:

* InPost.parseBody(response, cb) - parsing raw response body
* InPost.setDefault(options) - setting app scope InPost.client and returning it.

```javascript
var inPostClient = InPost.setDefault(options);
console.log(inPostClient instanceof InPost)
console.log(inPostClient == InPost.client)
//true
//true
```

#### Check index.js to get client's method names

### Check test.js