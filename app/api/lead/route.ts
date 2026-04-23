import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, markenname } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Ungültige E-Mail-Adresse' }, { status: 400 });
    }

    await resend.emails.send({
      from: 'BrandCheck <brandcheck@spry.works>',
      to: ['jo@spry.works', 'markus@spry.works'],
      replyTo: email,
      subject: `Neuer BrandCheck Lead: ${markenname || 'Unbekannte Marke'}`,
      text: `Neuer Lead über den Spry BrandCheck:

E-Mail: ${email}
Marke: ${markenname || 'nicht angegeben'}

Diese Person hat gerade eine Markenanalyse durchgeführt und ihr Interesse signalisiert.`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lead-Versand fehlgeschlagen:', error);
    return NextResponse.json({ error: 'Versand fehlgeschlagen' }, { status: 500 });
  }
}
