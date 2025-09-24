import "dotenv/config";
import express from "express";
import fetch from "node-fetch";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index", {
    originalText: "",
    corrected: "",
  });
});

// Main logic route
app.post("/correct", async (req, res) => {
  const text = req.body.text.trim();
  if (!text) {
    return res.render("index", {
      corrected: "Please enter text to correct.",
      originalText: text,
    });
  }
  try {


    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a grammar checker.",
          },
          {
            role: "user",
            content: `Correct this text: ${text}`,
          },
        ],
        max_tokens: 100,
        temperature: 1,
        n: 1,
        stop: null,
      }),
    });
    if (!response.ok) {
      const errText = await response.text(); // the full error message
      console.error("OpenAI API error:", errText);
      return res.render("index", {
        corrected: `Unable to correct text right now. Please try again later.`,
        originalText: text,
      });
    }
    console.log("OpenAI response status:", response.status);
    const data = await response.json();
    console.log("OpenAI response data:", JSON.stringify(data, null, 2));
    const correctedText = data.choices[0].message.content;
    res.render("index", {
      corrected: correctedText,
      originalText: text,
    });
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    res.render("index", {
      corrected: `Unable to correct text right now. Please try again later.`,
      originalText: text,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
