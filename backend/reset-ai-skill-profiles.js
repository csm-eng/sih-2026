const mongoose = require("mongoose");
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const SkillProfile = require("./src/models/SkillProfile");

const resetAISkillProfiles = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const result = await SkillProfile.updateMany(
      {
        source: "ai_extraction",
        verified: false
      },
      {
        $set: {
          proficiencyStatus: "not_assessed",
          level: null,
          score: null,
          status: "not_assessed",
          lastAssessedAt: null
        }
      }
    );

    console.log(`Matched: ${result.matchedCount}`);
    console.log(`Modified: ${result.modifiedCount}`);
    console.log("AI skill profiles reset successfully");
  } catch (error) {
    console.error("Reset failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

resetAISkillProfiles();