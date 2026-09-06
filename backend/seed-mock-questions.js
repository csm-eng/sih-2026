require("dotenv").config({
    path: require("path").resolve(
        __dirname,
        "../.env"
    ),
});

const mongoose = require("mongoose");

const Skill = require("./src/models/Skill");
const MockQuestion = require("./src/models/MockQuestion");

const questions = {
    java: [
        {
            question:
                "Which keyword is used to inherit a class in Java?",
            options: [
                "implements",
                "extends",
                "inherits",
                "super",
            ],
            correctAnswer: 1,
            difficulty: "basic",
            explanation:
                "The extends keyword is used for class inheritance.",
        },
        {
            question:
                "Which concept allows the same method name with different parameters?",
            options: [
                "Inheritance",
                "Encapsulation",
                "Method Overloading",
                "Abstraction",
            ],
            correctAnswer: 2,
            difficulty: "basic",
            explanation:
                "Method overloading allows methods with the same name but different parameter lists.",
        },
        {
            question:
                "Which collection does not allow duplicate elements?",
            options: [
                "ArrayList",
                "HashSet",
                "LinkedList",
                "Vector",
            ],
            correctAnswer: 1,
            difficulty: "intermediate",
            explanation:
                "HashSet does not allow duplicate elements.",
        },
        {
            question:
                "Which principle hides internal implementation details?",
            options: [
                "Inheritance",
                "Polymorphism",
                "Abstraction",
                "Overloading",
            ],
            correctAnswer: 2,
            difficulty: "intermediate",
            explanation:
                "Abstraction hides implementation details and exposes essential behavior.",
        },
        {
            question:
                "Which data structure is typically used internally for Java method calls?",
            options: [
                "Queue",
                "Stack",
                "Graph",
                "Heap",
            ],
            correctAnswer: 1,
            difficulty: "advanced",
            explanation:
                "The call stack stores method invocation frames.",
        },
    ],
};

async function seed() {
    try {
        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log("MongoDB connected");

        for (const [
            skillName,
            skillQuestions,
        ] of Object.entries(questions)) {
            const skill =
                await Skill.findOne({
                    name: new RegExp(
                        `^${skillName}$`,
                        "i"
                    ),
                });

            if (!skill) {
                console.log(
                    `Skill not found: ${skillName}`
                );
                continue;
            }

            await MockQuestion.deleteMany({
                skillId: skill._id,
            });

            const documents =
                skillQuestions.map(
                    (question) => ({
                        ...question,
                        skillId: skill._id,
                    })
                );

            await MockQuestion.insertMany(
                documents
            );

            console.log(
                `Seeded ${documents.length} questions for ${skill.name}`
            );
        }

        await mongoose.disconnect();

        console.log(
            "Mock questions seeded successfully"
        );
    } catch (error) {
        console.error(
            "Seed failed:",
            error
        );

        process.exit(1);
    }
}

seed();