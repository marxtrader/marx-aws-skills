let AWS = require('aws-sdk');
//let regionId = require('../constants/regions');

const startEc2 = function(instanceIds,region,callback) {
  AWS.config.update({region: region});  
  var ec2 = new AWS.EC2();
  var params = {
      InstanceIds:instanceIds,
      DryRun: false
  }

  ec2.startInstances(params, function (err, data) {
    console.log("data : ",data)
      if (err) {
          console.log("Could not start instance", err);
      } else {
          console.log(`Starting Instances in ${region} `)
      }
      callback(null,data)
  });
};
module.exports = startEc2;