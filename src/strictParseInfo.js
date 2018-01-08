const Parsed=require("./parsed.js");
const ParseInfo=require("./parseInfo.js");
const InvalidKeyError=require("./errors/invalidKeyError.js");

const contains=function(list,key) {
  return list.find(function(validKey){
    return key==validKey;
  });
}

const checkEveryCase=function(list,key) {
 return contains(list,key)||contains(list,key.toUpperCase())||contains(list,key.toLowerCase());
}
const caseContains=function(list,key,caseSensitive){
    let status;
  if(!caseSensitive){
    if(checkEveryCase(list,key)){
      return true;
    }
    return false;
  }
  contains(list,key)? status=true: status=false;
  return status;
}

var StrictParseInfo=function(initialParsingFunction,validKeys,caseSensitive) {
  ParseInfo.call(this,initialParsingFunction);
  this.validKeys=validKeys;
  this.caseSensitive=caseSensitive;
}

StrictParseInfo.prototype=Object.create(ParseInfo.prototype);

StrictParseInfo.prototype.pushKeyValuePair=function() {
  if(!caseContains(this.validKeys,this.currentKey,this.caseSensitive))
    throw new InvalidKeyError("invalid key",this.currentKey,this.currentPos);
  this.parsedKeys[this.currentKey]=this.currentValue;
  this.resetKeysAndValues();
}

module.exports=StrictParseInfo;
