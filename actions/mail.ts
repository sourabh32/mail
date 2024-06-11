"use server"

import { getServerSession } from "next-auth"

import { google } from "googleapis"


import { authOptions } from "@/lib/auth";





export const getEmails = async (number:string) => {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    console.error("No session found");
    return null;
  }

  const accessToken = session.accessToken;
  const refreshToken = session.refreshToken;

  if (!accessToken || !refreshToken) {
    console.error("Access token or refresh token missing");
    return null
  }

  const oAuth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_KEY || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET_KEY || "",
    redirectUri: process.env.REDIRECT_URI || "http://localhost:3000/api/auth/callback/google",
  });

  oAuth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  try {
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    const response = await gmail.users.messages.list({
      userId: 'me',
      labelIds: ['INBOX'],
      maxResults: parseInt(number),
    });

    const messages = response.data.messages || [];

    if (messages.length === 0) {
      return { emails: [] };
    }

    const emailDetails = await Promise.all(
      messages.map(async (message) => {
        try {
          const msg = await gmail.users.messages.get({
            userId: 'me',
            id: message.id,
          });
          return msg.data;
        } catch (err) {
          console.error(`Error fetching email with ID ${message.id}:`, err);
          return null;
        }
      })
    );

    const validEmailDetails = emailDetails.filter(email => email !== null);

    const finalOutput = validEmailDetails.map((email) => {
      const headers = email.payload.headers.reduce((acc, header) => {
        acc[header.name] = header.value;
        return acc;
      }, {});

      const bodyPart = email?.payload?.parts?.find((part) => part.mimeType === 'text/html') || email?.payload?.body;

      const emailBody = bodyPart?.body?.data ? Buffer.from(bodyPart.body.data, 'base64').toString('utf-8') : '';

      return { from: headers.From, subject: headers.Subject, date: headers.Date, emailBody };
    });

    

    return finalOutput;
  } catch (error) {
    console.error("Error fetching emails:", error);
    return null
  }
};