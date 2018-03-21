

const getRegion = require('./functions/regions')
getRegion('SingApoRe',function (err,data){
  if (err) {
    console.log("Error: ",err)
  } else {
    console.log ("Data : ",data)
  }
})
