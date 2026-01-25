import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import pdfParse from 'pdf-parse';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, messages, pdfBase64, pdfImages } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Build messages for OpenAI - include extracted PDF text if provided
    const openaiMessages: any[] = [
      {
        role: 'system',
        content:
          'You are a multimodal RAG assistant. You have access to a PDF document provided by the user. Analyze the text and any table-like content to provide accurate, detailed answers. When you see tables, preserve their structure in your response. When PDF page images are provided, use them to interpret diagrams, charts, and visual layout.',
      },
    ];

    // Add conversation history
    messages.forEach((msg: any) => {
      if (msg.role !== 'system') {
        openaiMessages.push({
          role: msg.role,
          content: msg.content,
        });
      }
    });

    // If there's a PDF (as base64), extract text and append it to the latest user message
    if (pdfBase64 && openaiMessages.length > 0) {
      const base64Payload = pdfBase64.includes(',')
        ? pdfBase64.split(',')[1]
        : pdfBase64;
      let extractedText = '';
      try {
        const pdfBuffer = Buffer.from(base64Payload, 'base64');
        const parsed = await pdfParse(pdfBuffer);
        extractedText = (parsed.text || '').trim();
      } catch (parseError) {
        console.warn('PDF parse failed:', parseError);
      }

      if (extractedText) {
        const maxChars = 12000;
        const truncated =
          extractedText.length > maxChars
            ? `${extractedText.slice(0, maxChars)}\n\n[PDF text truncated]`
            : extractedText;
        const docBlock = `PDF content (text extracted):\n${truncated}`;

        const lastMessage = openaiMessages[openaiMessages.length - 1];
        if (lastMessage?.role === 'user') {
          if (Array.isArray(lastMessage.content)) {
            lastMessage.content.push({ type: 'text', text: docBlock });
          } else if (typeof lastMessage.content === 'string') {
            lastMessage.content = `${lastMessage.content}\n\n${docBlock}`;
          } else {
            lastMessage.content = docBlock;
          }
        } else {
          openaiMessages.push({ role: 'user', content: docBlock });
        }
      }
    }

    // Attach rendered PDF page images (data URLs) to the latest user message
    if (Array.isArray(pdfImages) && pdfImages.length > 0) {
      const lastMessage = openaiMessages[openaiMessages.length - 1];
      const imageParts = pdfImages
        .filter((url: string) => typeof url === 'string' && url.startsWith('data:image'))
        .map((url: string) => ({
          type: 'image_url',
          image_url: { url },
        }));

      if (imageParts.length > 0) {
        if (lastMessage?.role === 'user') {
          if (Array.isArray(lastMessage.content)) {
            lastMessage.content.push(...imageParts);
          } else if (typeof lastMessage.content === 'string') {
            lastMessage.content = [
              { type: 'text', text: lastMessage.content },
              ...imageParts,
            ];
          } else {
            lastMessage.content = imageParts;
          }
        } else {
          openaiMessages.push({
            role: 'user',
            content: imageParts,
          });
        }
      }
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: openaiMessages,
      max_tokens: 1500,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;

    return NextResponse.json({
      success: true,
      response: aiResponse,
    });
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to process request',
        details: error.response?.data || null,
      },
      { status: 500 }
    );
  }
}
