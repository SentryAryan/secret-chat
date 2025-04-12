// src/app/api/generate-questions/route.ts
import { generateApiResponse } from "@/helpers/api-response.helper";
import axios from "axios";
import { NextResponse as res } from "next/server";

// Allow longer processing time
export const maxDuration = 30;

// List of random topics to choose from
const topics = [
  "hobbies",
  "travel",
  "food",
  "movies",
  "books",
  "music",
  "technology",
  "nature",
  "dreams",
  "creativity",
  "learning",
  "happiness",
  "friendship",
  "memories",
  "future",
  "adventure",
];

// Fallback questions in case the API fails
const fallbackQuestions = {
  "hobbies": "What hobby would you take up if money and time weren't factors?||What's something you've always wanted to learn but haven't had the chance to yet?||What activity brings you the most joy and why?",
  "travel": "If you could teleport anywhere for a day, where would you go?||What's the most beautiful place you've ever visited?||What destination is at the top of your travel bucket list?",
  "food": "What's your go-to comfort food and why?||If you could only eat one cuisine for the rest of your life, what would it be?||What's the most memorable meal you've ever had?",
  "movies": "What movie could you watch over and over without getting tired of it?||If your life was made into a film, which actor would you want to play you?||What's a movie that changed your perspective on something important?",
  "books": "What book has had the biggest impact on your life?||If you could live in any fictional world from a book, which would you choose?||What's a book you think everyone should read at least once?",
  "music": "What song always puts you in a good mood?||If you could only listen to one artist for the rest of your life, who would it be?||What's a song that brings back strong memories for you?",
  "technology": "What technological advancement are you most excited to see in your lifetime?||How do you think technology has most improved your daily life?||If you could invent any technology, what would it be?",
  "nature": "What's your favorite natural wonder or phenomenon?||If you could spend a month in any natural environment, where would you choose?||What's your favorite way to connect with nature?",
  "creativity": "When do you feel most creative?||What creative outlet do you enjoy most?||How do you overcome creative blocks?",
  "happiness": "What's something small that brings you joy every day?||What does your perfect day look like?||When was the last time you felt truly happy?",
  "friendship": "What quality do you value most in a friend?||What's your favorite memory with a friend?||How do you show appreciation to the important people in your life?",
  "future": "What are you most looking forward to in the next few years?||How do you think daily life will be different in 50 years?||What's one goal you're currently working toward?"
};

export async function GET(req: Request) {
  try {
    // Select a random topic
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];

    try {
      // Try using the Hugging Face API
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
        {
          inputs: `Create a list of three open-ended and engaging questions on ${randomTopic}. These questions should be suitable for a diverse audience and encourage friendly interaction. Separate each question with a new line.`,
          parameters: {
            max_new_tokens: 256,
            temperature: 0.7,
            return_full_text: false
          }
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 15000 // 15 second timeout
        }
      );
      
      console.log("Response success:", response.data);
      
      // Process the API response - Extract the generated text
      let text = '';
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        text = response.data[0]?.generated_text || '';
      } else if (response.data && typeof response.data === 'object') {
        text = response.data?.generated_text || '';
      }
      
      // Format the response - Split by newlines, clean and filter
      if (text) {
        // Split by newlines and filter empty lines
        const lines = text.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 10); // Only keep substantial lines
        
        // If we have valid questions, join them with ||
        if (lines.length >= 2) {
          text = lines.join('||');
          
          return res.json(
            generateApiResponse(200, "Questions generated successfully", {
              questions: text,
              topic: randomTopic,
            }),
            { status: 200 }
          );
        }
      }
      
      // If we didn't get valid formatted questions, use fallback
      throw new Error("API response not properly formatted");
      
    } catch (apiError: any) {
      console.error("API Error:", apiError.message);
      console.log("Using fallback questions");
      
      // Use fallback questions for the selected topic
      return res.json(
        generateApiResponse(200, "Questions generated from fallback", {
          questions: fallbackQuestions[randomTopic as keyof typeof fallbackQuestions],
          topic: randomTopic,
        }),
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error("Critical error:", error.message);
    
    // Return a generic set of questions if everything else fails
    const genericQuestions = "What's something you're looking forward to?||If you could have any superpower, what would it be?||What's your favorite way to relax?";
    
    return res.json(
      generateApiResponse(200, "Using generic questions", {
        questions: genericQuestions,
        topic: "general",
      }),
      { status: 200 }
    );
  }
}
