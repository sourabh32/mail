"use server"
import { OpenAI } from 'openai';
export const classifyMail = async (emails:string[]) => {
   console.log(process.env.OPENAI_API_KEY)
    const openai = new OpenAI({
      apiKey:process.env.OPENAI_API_KEY
    });
    const prompt = `
    You are given an array of email objects. Each email object contains properties like 'subject' and 'body'. Your task is to classify each email into one of the following categories: Important, Promotional, Social, Marketing, Spam. For each email object, add a new property 'classification' with the appropriate category as its value.
    
    Here are the email objects:
    
    ${JSON.stringify(emails, null, 2)}
    
    Add a 'classification' property to each email object and return the updated array.
    `;
    
    
      const params = {
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
      };
    
      try {
        const chatCompletion = await openai.chat.completions.create(params);
       
        
        return chatCompletion.choices[0].message.content;
      } catch (error) {
        console.error('Error classifying email:', error);
        throw new Error('Failed to classify email');
      }
    };
    