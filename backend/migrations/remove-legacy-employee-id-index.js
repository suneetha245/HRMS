require('dotenv').config();
const mongoose = require('mongoose');

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  const collection = mongoose.connection.collection('employees');
  const indexes = await collection.indexes();
  const legacyIndex = indexes.find((index) => index.unique && index.key?.employeeId === 1);

  if (!legacyIndex) {
    console.log('No legacy unique employeeId index found.');
    return;
  }

  await collection.dropIndex(legacyIndex.name);
  console.log(`Removed legacy unique index: ${legacyIndex.name}`);
}

migrate()
  .catch((error) => {
    console.error('Could not remove the legacy employeeId index:', error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
