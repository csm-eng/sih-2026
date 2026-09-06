require("dotenv").config({
    path: require("path").resolve(__dirname, "../.env")
});

const mongoose = require("mongoose");
const SkillProfile = require("./src/models/SkillProfile");

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        const result = await SkillProfile.updateMany(
            {
                source: "system",
                verified: false
            },
            {
                $set: {
                    source: "ai_extraction",
                    verified: false
                }
            }
        );

        console.log(`Matched profiles: ${result.matchedCount}`);
        console.log(`Modified profiles: ${result.modifiedCount}`);

        await mongoose.disconnect();

        console.log("Migration completed successfully");
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
};

migrate();