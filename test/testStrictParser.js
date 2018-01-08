const src=function(filePath){return "../src/"+filePath};
const errors=function(filePath){return "../src/errors/"+filePath};
const assert=require('chai').assert;
const StrictParser=require(src('index.js')).StrictParser;
const InvalidKeyError=require(errors('invalidKeyError.js'));

var invalidKeyErrorChecker=function(key,pos) {
  return function(err) {
    if(err instanceof InvalidKeyError && err.invalidKey==key && err.position==pos)
      return true;
    return false;
  }
}

describe("strict parser",function(){
  it("should only parse keys that are specified for a single key",function(){
    let kvParser=new StrictParser(["name"]);
    let absolute=() => {
      var p=kvParser.parse("age=23");
    };
    assert.throws(absolute,invalidKeyErrorChecker("age",5)(absolute))
  });

  it("should only parse keys that are specified for multiple keys",function(){
    let kvParser=new StrictParser(["name","age"]);
    let actual=kvParser.parse("name=john age=23");
    let expected={name:"john",age:"23"};
    assert.include(expected,actual);
    let absolute=() => {
      var p=kvParser.parse("color=blue");
    };
    assert.throws(absolute,invalidKeyErrorChecker("color",9)(absolute))
  });

  it("should throw an error when one of the keys is not valid",function(){
    let absolute=() => {
      let kvParser=new StrictParser(["name","age"]);
      kvParser.parse("name=john color=blue age=23");
    };
    assert.throws(absolute,invalidKeyErrorChecker("color",20)(absolute))
  });

  it("should throw an error on invalid key when there are spaces between keys and assignment operators",function(){
    let absolute=() => {
      let kvParser=new StrictParser(["name","age"]);
      kvParser.parse("color   = blue");
    };
    assert.throws(absolute,invalidKeyErrorChecker("color",13)(absolute))
  });

  it("should throw an error on invalid key when there are quotes on values",function(){
    let absolute=() => {
      let kvParser=new StrictParser(["name","age"]);
      kvParser.parse("color   = \"blue\"");
    };
    assert.throws(absolute,invalidKeyErrorChecker("color",15)(absolute))
  });

  it("should throw an error on invalid key when there are cases of both quotes and no quotes",function(){
    let absolute=() => {
      let kvParser=new StrictParser(["name","age"]);
      kvParser.parse("name = john color   = \"light blue\"");
    };
    assert.throws(absolute,invalidKeyErrorChecker("color",33)(absolute))
  });

  it("should throw an error when no valid keys are specified",function(){
    let absolute=() => {
      let kvParser=new StrictParser([]);
      kvParser.parse("name=john");
    };
    assert.throws(absolute,invalidKeyErrorChecker("name",8)(absolute))
  });

  it("should throw an error when no array is passed",function(){
    let absolute=() => {
      let kvParser=new StrictParser();
      kvParser.parse("name=john");
    };
    assert.throws(absolute,invalidKeyErrorChecker("name",8)(absolute))
  });

});
