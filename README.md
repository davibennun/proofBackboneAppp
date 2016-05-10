# Simple Backbone App consuming a REST API

This is a front-end app consuming the api directly, without any middleware.
The API endpoint is http://tradeins.getsandbox.com/tradeins
```
GET  /tradeins/ ...... Reads all Tradeins.
POST /tradeins/ ...... Creates a new Tradein.
GET  /tradeins/:id ... Reads a Tradein.
PUT  /tradeins/:id ... Updates a Tradein.
DEL  /tradeins/:id ... Destroys a Tradein.
```

## From REST to SOAP
We can switch the data layer from json to xml by simpling parsing the response from our soap api:
```
url: '{SOAP_ENDPOINT}',
parse: function( response ) { 
    var parsed = Jath.parse( 
        [ '//tradeins', {  
            id: 'Tradein_ID', 
           ...
    } ], response );
    return parsed;
}
```
source: https://newcome.wordpress.com/2011/02/20/consuming-xml-web-services-in-backbone-js-using-jath/

## Instructionsgit 
Just clone & run:
```
php -S localhost:8080
```