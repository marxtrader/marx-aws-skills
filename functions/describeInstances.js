
// queries the region for instances and their statuses. Use world for all regions. 
// Writes the data to a s3 bucket. s3://marx.instances/region
// Query by tags : Name, Department, Developer

let AWS = require('aws-sdk');

GetInstances: function (region='us-east-1', cb) {
  let ec2 = new AWS.EC2({region: region});
  let instanceIds = [];
  // collect details about the instances.
  let instObjects = {};
  // Define the tags to match against
  const params = {
      DryRun: false,
      // Filters: [
      //     { Name: 'tag:Name',  Values: [ 'WebServer', 'Deploy', 'Build' ], },
      //     { Name: 'instance-state-name', Values: [ "running", "stopped" ] }
      // ],
  };

  // Return the querry list of instances.
  ec2.describeInstances(params, (err, data) => {
      if (err) {
          console.log(err, err.stack);
          throw err;
      } else {
          data.Reservations.forEach(reservation => {
              reservation.Instances.forEach(instance => {
                  const nameTag = instance.Tags.find(tag => tag.Key === 'Name');
                  instObjects.id=instance.InstanceId
                  instObjects.state=instance.State.Name
                  instObjects.region = region

                  if (nameTag.Value != "") {
                      instObjects.name = nameTag.Value
                  } else {
                      let params = {
                          Resources: [
                              instance.InstanceId
                          ],
                          Tags: [
                              { Key: "Name", Value: "UnTagged" }
                          ]
                      };

                       ec2.createTags(params, function(err, data) {
                         if (err) console.log(err, err.stack); // an error occurred
                         instObjects.name = instance.Tags.Name.Value           // successful response
                       });
                  }
                  instanceIds.push(instObjects);  instObjects = {};
              }) // end instance loop
          }) // end reservation loop
      }; // end if/else
      cb(null, instanceIds)
  });
}