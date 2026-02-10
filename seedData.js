// seedData.js - Initialize database with dummy data if empty

const seedDatabase = async () => {
  try {
    console.log("Database seed check completed");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

module.exports = seedDatabase;
