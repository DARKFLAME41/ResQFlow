const dbStore = require('../models/dbStore');

console.log('Seeding ResQFlow Database with realistic hackathon demo data...');
dbStore.seedInitialData();
console.log('✅ Seeding completed successfully!');
console.log(`- Incidents: ${dbStore.data.incidents.length}`);
console.log(`- Responders: ${dbStore.data.responders.length}`);
console.log(`- Resources: ${dbStore.data.resources.length}`);
console.log(`- Users: ${dbStore.data.users.length}`);
