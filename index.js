require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.post('/webhook', async (req, res) => {
    const userMessage = req.body.queryResult.queryText; // Mensaje del usuario
    
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage }]
        });

        const botReply = response.choices[0].message.content;
        return res.json({ fulfillmentText: botReply });

    } catch (error) {
        console.error("Error:", error);
        return res.json({ fulfillmentText: "Hubo un error al procesar tu solicitud." });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
 
