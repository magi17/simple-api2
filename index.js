const express = require("express");
const { gpt, llama } = require("gpti");

const app = express();
//const PORT = 4000;
const PORT = process.env.PORT || 4000; 

app.use(express.json()); // Middleware to parse JSON requests

// ✅ GET Route for GPT (Single Message via Query)
app.get("/gpt", async (req, res) => {
    try {
        const message = req.query.message;
        if (!message) {
            return res.status(400).json({ error: "Message is required as a query parameter. Example: /gpt?message=hi" });
        }

        let messages = [{ role: "user", content: message }];

        let data = await gpt.v3({
            messages,
            markdown: false,
            stream: false
        });

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ GET Route for Llama (Single Message via Query)
app.get("/llama", async (req, res) => {
    try {
        const message = req.query.message;
        if (!message) {
            return res.status(400).json({ error: "Message is required as a query parameter. Example: /llama?message=hi" });
        }

        let messages = [{ role: "user", content: message }];

        let data = await llama({
            messages,
            markdown: false,
            stream: false
        });

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post("/gpt", async (req, res) => {
    try {
        const { messages, stream } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: "Invalid messages format. It should be an array of chat history." });
        }

        if (stream) {
            // Streaming response
            gpt.v3({
                messages,
                stream: true,
                markdown: false,
                results: (err, data) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    res.json(data);
                }
            });
        } else {
            // Normal response
            let data = await gpt.v3({
                messages,
                markdown: false,
                stream: false
            });
            res.json(data);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
