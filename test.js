const fs = require('fs');
const pdf = require('pdf-parse-new');

// Replace with the path to your actual resume file
const dataBuffer = fs.readFileSync('./path/to/your/resume.pdf');

pdf(dataBuffer).then(function (data) {
    console.log("--- PDF INFO ---");
    console.log("Pages:", data.numpages);
    console.log("Metadata:", data.info);

    console.log("\n--- EXTRACTED TEXT PREVIEW ---");
    // Show first 500 characters to verify text is readable
    console.log(data.text.substring(0, 500));

    if (data.text.trim().length > 10) {
        console.log("\n✅ SUCCESS: Text extracted successfully.");
    } else {
        console.log("\n❌ FAILURE: Extraction returned empty text. Your PDF might be a scanned image.");
    }
}).catch(err => {
    console.error("❌ ERROR:", err.message);
});