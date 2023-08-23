const fs = require('fs');
var path = require('path');

function getInfo() {
    var pathProj = path.join(__dirname, '../public/projects/') 
    const directoriesInDIrectory = fs.readdirSync(pathProj, { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => item.name);
    const projectArray = []
    for (var i = 0; i < directoriesInDIrectory.length; i++) {
        var obj = JSON.parse(fs.readFileSync(`${pathProj}${directoriesInDIrectory[i]}/${directoriesInDIrectory[i]}.json`, 'utf-8'));
        projectArray.push(obj);
    }
    const finalArray = []
    Array(finalArray).fill(i);
    for (var i of projectArray){

        finalArray[i.Order] = i;
    }
    return finalArray;
}    

module.exports = {getInfo};
