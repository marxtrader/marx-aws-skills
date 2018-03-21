let AWS = require('aws-sdk');
//let regionId = require('../constants/regions');

const stopEc2 = function(instanceIds,region='us-west-2',callback) {
  AWS.config.update({region: region});  
  var ec2 = new AWS.EC2()
  var params = {
      InstanceIds:instanceIds,
      DryRun: false
  };

  ec2.stopInstances(params, function (err, data) {
    console.log("data : ",data)
      if (err) {
          console.log("Could not stop instance", err);
      } else {
          console.log(`Stopping the instance in ${region}`)
      }
      callback(null, data)
  });
}
module.exports = stopEc2;