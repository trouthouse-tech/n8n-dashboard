import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { webhookUrl, body } = requestBody;

    if (!webhookUrl) {
      return NextResponse.json(
        { error: 'Missing webhookUrl' },
        { status: 400 }
      );
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body || {}),
    });

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `Webhook returned ${response.status}`, data },
        { status: response.status }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Webhook proxy error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

