//can run with node merge-dependencies.js
const fs = require('fs');

const sourcePackage = JSON.parse(fs.readFileSync('MapFunctions/package.json', 'utf8'));
const targetPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Merge dependencies
['dependencies', 'devDependencies', 'peerDependencies'].forEach(depType => {
    targetPackage[depType] = {
        ...targetPackage[depType],
        ...sourcePackage[depType]
    };
});

fs.writeFileSync('package.json', JSON.stringify(targetPackage, null, 2));

console.log('Dependencies merged successfully!');
