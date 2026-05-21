import { any, includes } from "zod";
import { generateAIResponse } from "../ai/aiService.js";
import { generateGeminiStream } from "../ai/providers/geminiProvider.js";
import prisma from "../lib/prisma.js";
import { generateConversationTitle } from "../ai/generateConversationTitle.js";

import { generateRAGResponse } from "../ai/ragService.js";

// 21-05-26
import { storeConversationMemory } from "../vector/storeConverstaionMemory.js"
import { storeLongTermMemory } from "../ai/storeLongTermMemory.js";

import { generateRAGStream } from "../ai/generateRAGStream.js";


export const sendMessage = async (req, res) => {
  try {
    const { provider, prompt } = req.body;

    if (!provider || !prompt) {
      return res.status(400).json({
        message: "Provider and prompt required",
      });
    }

    const response = await generateAIResponse({ provider, prompt });

    res.status(200).json({
      response,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "AI response generation failed.",
    });
  }
};

export const streamMessage = async (req, res) => {
  try {
    const { prompt, conversationId } = req.body;

    let activeConversationId = conversationId

    if (!prompt) {
      return res.status(400).json({
        message: "Prompt Required",
      });
    }


    if (!activeConversationId) {
      const generatedTitle = await generateConversationTitle(prompt)

      const conversation = await prisma.conversation.create({
        data: {
          title: generatedTitle,
          userId: req.user.id
        }
      })

      activeConversationId = conversation.id
    }

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("x-conversation-id", activeConversationId)


    await prisma.message.create({
      data: {
        role: "user",
        content: prompt,

        conversationId: activeConversationId
      }
    })

    await storeConversationMemory({
      userId: req.user.id,
      conversationId: activeConversationId,
      role: "user",
      content: prompt
    })

    const stream = await generateRAGStream({
      userId: req.user.id,
      prompt
    })

    let fullAIResponse = ""

    for await (const chunk of stream) {
      const chunkText = chunk.text

      fullAIResponse += chunkText

      res.write(chunkText)
    }

    await prisma.message.create({
      data: {
        role: "assistant",
        content: fullAIResponse,
        conversationId: activeConversationId
      }
    })

    const conversationMessages = await prisma.message.findMany({
      where: {
        conversationId: activeConversationId
      },
      orderBy: {
        createdAt: "asc"
      }
    })

    await storeConversationMemory({ // for storing messages length less than 20
      userId: req.user.id,
      conversationId: activeConversationId,
      role: "assistant",
      content: fullAIResponse
    })

    if (conversationMessages.length >= 20) { // if message length is greater than 20 then it is stored as longTerm memory
      await storeLongTermMemory({
        userId: req.user.id,
        messages: conversationMessages
      })
    }

    res.end();
  } catch (error) {
    console.log(error);

    res.status(500).end();
  }
};

export const getConversations = async (req, res) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        userId: req.user.id
      },

      orderBy: {
        updatedAt: "desc"
      },

      select: {
        id: true,
        title: true,
        updatedAt: true
      }
    })

    res.status(200).json({
      conversations
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: "Failed to fetch conversations"
    })
  }
}

export const getConversationMessages = async (req, res) => {
  try {
    const { id } = req.params

    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
        userId: req.user.id //user id must be logged in users id, else other users chat would be shown.
      },

      include: {
        messages: {
          orderBy: {
            createdAt: "asc"
          }
        }
      }
    })

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found"
      })
    }

    res.status(200).json({
      conversation
    })
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch messages"
    })
  }
}

export const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params
    const result = await prisma.conversation.deleteMany({
      where: {
        id,
        userId: req.user.id
      }
    })

    if (result.count === 0) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    res.status(200).json({
      message: "Conversation deleted"
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: "Failed to delete conversation"
    })
  }
}