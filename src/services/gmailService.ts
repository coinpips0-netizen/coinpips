import { GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { auth } from '../firebase/config';

export const GMAIL_SCOPES = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.modify'
];

let cachedGmailToken: string | null = null;

/**
 * Request Google Sign-In with Gmail scopes
 */
export async function connectGoogleWithGmail(): Promise<{ user: User; accessToken: string }> {
  const provider = new GoogleAuthProvider();
  GMAIL_SCOPES.forEach(scope => provider.addScope(scope));
  // Prompt re-consent if needed
  provider.setCustomParameters({
    prompt: 'select_account'
  });

  const result = await signInWithPopup(auth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  if (!credential?.accessToken) {
    throw new Error('Could not acquire Google OAuth token for Gmail');
  }

  cachedGmailToken = credential.accessToken;
  return {
    user: result.user,
    accessToken: credential.accessToken
  };
}

export function getCachedGmailToken(): string | null {
  return cachedGmailToken;
}

export function clearGmailToken(): void {
  cachedGmailToken = null;
}

/**
 * Creates RFC 2822 base64url encoded email string
 */
function createRawEmail(to: string, from: string, subject: string, bodyText: string): string {
  const emailLines = [
    `To: ${to}`,
    `From: ${from}`,
    `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    bodyText
  ];

  const email = emailLines.join('\r\n');
  return btoa(unescape(encodeURIComponent(email)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Sends an email using Gmail API
 */
export async function sendGmailMessage(params: {
  recipientEmail: string;
  senderEmail: string;
  subject: string;
  htmlContent: string;
}): Promise<{ id: string; threadId: string }> {
  const token = cachedGmailToken;
  if (!token) {
    throw new Error('Gmail is not connected. Please connect your Google account with Gmail permissions.');
  }

  const raw = createRawEmail(
    params.recipientEmail,
    params.senderEmail,
    params.subject,
    params.htmlContent
  );

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ raw })
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error?.message || `Gmail API error (${response.status})`);
  }

  return response.json();
}

/**
 * Convenience alias for dispatching trading signals and alerts via Gmail
 */
export async function sendGmailSignalAlert(params: {
  recipientEmail: string;
  senderEmail: string;
  subject: string;
  htmlContent: string;
}): Promise<{ id: string; threadId: string }> {
  return sendGmailMessage(params);
}

/**
 * Formats a Signal as an institutional HTML email alert
 */
export function buildSignalEmailHtml(signal: {
  symbol: string;
  name: string;
  direction: string;
  entryPrice: number;
  entryZone: string;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number;
  takeProfit3: number;
  riskRewardRatio: string;
  timeframe: string;
  explanation: string;
}): string {
  const isBuy = signal.direction.includes('BUY');
  const accentColor = isBuy ? '#10B981' : '#F43F5E';

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0e14; color: #f1f5f9; padding: 28px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #1e293b;">
      <div style="border-bottom: 1px solid #1e293b; padding-bottom: 16px; margin-bottom: 20px;">
        <h1 style="color: #38bdf8; font-size: 20px; margin: 0; letter-spacing: 0.05em;">COINPIPS TRADING TERMINAL</h1>
        <p style="color: #94a3b8; font-size: 13px; margin: 4px 0 0 0;">Official Real-Time Market Signal Dispatch</p>
      </div>

      <div style="background-color: #111827; border-radius: 8px; padding: 20px; border-left: 4px solid ${accentColor}; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h2 style="margin: 0; font-size: 22px; color: #ffffff;">${signal.symbol} · ${signal.name}</h2>
          <span style="background-color: ${accentColor}22; color: ${accentColor}; font-weight: bold; font-size: 13px; padding: 4px 10px; border-radius: 4px;">
            ${signal.direction} (${signal.timeframe})
          </span>
        </div>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.5; margin: 8px 0 0 0;">${signal.explanation}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #94a3b8;">Entry Zone</td>
          <td style="padding: 10px 0; text-align: right; color: #ffffff; font-weight: 600;">${signal.entryZone}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #94a3b8;">Stop Loss</td>
          <td style="padding: 10px 0; text-align: right; color: #f43f5e; font-weight: 600;">${signal.stopLoss}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #94a3b8;">Take Profit 1</td>
          <td style="padding: 10px 0; text-align: right; color: #10b981; font-weight: 600;">${signal.takeProfit1}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #94a3b8;">Take Profit 2</td>
          <td style="padding: 10px 0; text-align: right; color: #10b981; font-weight: 600;">${signal.takeProfit2}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #94a3b8;">Take Profit 3</td>
          <td style="padding: 10px 0; text-align: right; color: #10b981; font-weight: 600;">${signal.takeProfit3}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #94a3b8;">Risk : Reward Ratio</td>
          <td style="padding: 10px 0; text-align: right; color: #38bdf8; font-weight: 600;">${signal.riskRewardRatio}</td>
        </tr>
      </table>

      <div style="font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; padding-top: 14px; text-align: center;">
        Sent via COINPIPS Terminal Integration with Gmail. Not financial advice. Trade at your own risk.
      </div>
    </div>
  `;
}
