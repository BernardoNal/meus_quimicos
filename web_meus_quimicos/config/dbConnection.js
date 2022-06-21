const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
 
// Connection URL
const url = 'mongodb://localhost:27017/';
 
// Use connect method to connect to the server 
 var connMongoDB = function(){
  
  const client = new MongoClient(url);
  
  
  return client;
};

module.exports = function(){
    return connMongoDB;
}
