
var startEc2 = require('./functions/startEc2Instances');
var stopEc2 = require('./functions/stopEc2Instances');
let instances =['i-0000488283abd1207'];

console.log(startEc2(instances))
