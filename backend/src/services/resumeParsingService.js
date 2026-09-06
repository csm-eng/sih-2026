const fs = require("fs");
const path = require("path");

/**
 * Resume parsing - MVP scope.
 *
 * Full PDF/DOCX text extraction is handled on the Python AI service side
 * (pdfplumber is already a dependency there - see /ai-service). This
 * module's job on the Node side is just to get raw text ready to hand to
 * skillExtractionService:
 *   - if the upload is already plain text (.txt), read it directly
 *   - if it's a PDF/DOCX, this MVP expects the text to have already been
 *     extracted upstream (e.g. by the AI service's own /extract-skills
 *     call, which can be extended to accept a file instead of text)
 *
 * uploadMiddleware.js (multer or similar) is still a stub - once that's
 * wired up, req.file.path gets passed in here as filePath.
 */

const SUPPORTED_TEXT_EXTENSIONS = [".txt"];

const parseResumeFile = (filePath) => {
    if (!fs.existsSync(filePath)) {
        const error = new Error(`Resume file not found: ${filePath}`);
        error.statusCode = 404;
        throw error;
    }

    const ext = path.extname(filePath).toLowerCase();

    if (SUPPORTED_TEXT_EXTENSIONS.includes(ext)) {
        return fs.readFileSync(filePath, "utf-8");
    }

    // PDF/DOCX: not parsed on the Node side for MVP.
    const error = new Error(
        `Resume format ${ext} not supported for direct parsing yet. ` +
        `Extract text via the AI service or upload a .txt file for now.`
    );
    error.statusCode = 415;
    throw error;
};

module.exports = {
    parseResumeFile
};
