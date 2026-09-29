import nodemailer from 'nodemailer';

export interface WebinarEmailPayload {
  schoolName: string;
  contactName: string;
  email: string;
  phone?: string;
  studentCount?: string;
  webinarTopic?: string;
  preferredDate?: string;
  preferredTime?: string;
  currentSystem?: string;
  message?: string;
}

export function buildWebinarHtml(data: WebinarEmailPayload): string {
  const cleanPhone = (data.phone || '').replace(/[^0-9+]/g, '');
  const waLink = cleanPhone ? `https://wa.me/${cleanPhone.replace('+', '')}` : '';

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuevo Webinar Agendado - My College</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f6f9; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
          
          <!-- Header Navy & Gold -->
          <tr>
            <td style="background-color: #081D3C; padding: 32px 30px; text-align: center; border-bottom: 4px solid #D4AF37;">
              <div style="display: inline-block; padding: 8px 16px; background-color: rgba(212, 175, 55, 0.15); border-radius: 30px; border: 1px solid #D4AF37; margin-bottom: 12px;">
                <span style="color: #F5B82E; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">
                  🎓 Solicitud de Demostración
                </span>
              </div>
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">
                Nuevo Webinar Agendado
              </h1>
              <p style="color: #cbd5e1; margin: 8px 0 0 0; font-size: 14px;">
                Un colegio ha completado el formulario en <strong style="color: #F5B82E;">mycollege.com.mx</strong>
              </p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 30px 30px 20px 30px;">
              <h2 style="font-size: 18px; color: #081D3C; margin: 0 0 20px 0; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">
                🏫 Datos del Colegio y Contacto
              </h2>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size: 14px; line-height: 1.6;">
                <tr>
                  <td width="38%" style="padding: 10px 0; color: #64748b; font-weight: 600;">Institución / Colegio:</td>
                  <td width="62%" style="padding: 10px 0; color: #081D3C; font-weight: 700; font-size: 16px;">${escapeHtml(data.schoolName)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #64748b; font-weight: 600; border-top: 1px solid #f1f5f9;">Nombre del Directivo:</td>
                  <td style="padding: 10px 0; color: #081D3C; font-weight: 600; border-top: 1px solid #f1f5f9;">${escapeHtml(data.contactName)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #64748b; font-weight: 600; border-top: 1px solid #f1f5f9;">Correo Electrónico:</td>
                  <td style="padding: 10px 0; color: #0284c7; font-weight: 600; border-top: 1px solid #f1f5f9;">
                    <a href="mailto:${escapeHtml(data.email)}" style="color: #0284c7; text-decoration: none;">${escapeHtml(data.email)}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #64748b; font-weight: 600; border-top: 1px solid #f1f5f9;">Teléfono / WhatsApp:</td>
                  <td style="padding: 10px 0; color: #081D3C; font-weight: 600; border-top: 1px solid #f1f5f9;">
                    ${data.phone ? `<a href="tel:${cleanPhone}" style="color: #081D3C; text-decoration: none;">${escapeHtml(data.phone)}</a>` : 'No proporcionado'}
                    ${waLink ? ` &nbsp;•&nbsp; <a href="${waLink}" style="color: #16a34a; font-weight: 700; text-decoration: none;">Abrir en WhatsApp</a>` : ''}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #64748b; font-weight: 600; border-top: 1px solid #f1f5f9;">Población Estudiantil:</td>
                  <td style="padding: 10px 0; color: #081D3C; border-top: 1px solid #f1f5f9;">${escapeHtml(data.studentCount || 'No especificado')}</td>
                </tr>
              </table>

              <!-- Webinar Details Box -->
              <div style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; padding: 20px; margin-top: 25px;">
                <h3 style="margin: 0 0 12px 0; font-size: 15px; color: #081D3C; font-weight: 700;">
                  📅 Preferencias para el Webinar
                </h3>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size: 14px;">
                  <tr>
                    <td width="38%" style="padding: 6px 0; color: #64748b;">Tema de Interés:</td>
                    <td width="62%" style="padding: 6px 0; color: #b45309; font-weight: 700;">${escapeHtml(data.webinarTopic || 'Plataforma Integral')}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b;">Fecha Sugerida:</td>
                    <td style="padding: 6px 0; color: #081D3C; font-weight: 600;">${escapeHtml(data.preferredDate || 'Por coordinar')}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b;">Horario Preferido:</td>
                    <td style="padding: 6px 0; color: #081D3C;">${escapeHtml(data.preferredTime || 'Por coordinar')}</td>
                  </tr>
                  ${data.currentSystem ? `
                  <tr>
                    <td style="padding: 6px 0; color: #64748b;">Sistema Actual:</td>
                    <td style="padding: 6px 0; color: #081D3C;">${escapeHtml(data.currentSystem)}</td>
                  </tr>` : ''}
                </table>
              </div>

              ${data.message ? `
              <div style="margin-top: 20px; padding: 16px; background-color: #fffbeb; border-left: 4px solid #D4AF37; border-radius: 4px;">
                <strong style="color: #92400e; font-size: 13px; text-transform: uppercase;">Mensaje del Directivo:</strong>
                <p style="margin: 8px 0 0 0; color: #78350f; font-size: 14px; font-style: italic;">
                  "${escapeHtml(data.message)}"
                </p>
              </div>` : ''}

              <!-- Action CTAs -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 30px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${escapeHtml(data.email)}?subject=Confirmaci%C3%B3n%20de%20Webinar%20-%20My%20College&body=Hola%20${encodeURIComponent(data.contactName)},%0A%0AGracias%20por%20tu%20inter%C3%A9s%20en%20My%20College..." 
                       style="display: inline-block; background-color: #081D3C; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 14px; border: 1px solid #D4AF37;">
                      ✉️ Responder por Correo
                    </a>
                    ${waLink ? `
                    &nbsp;&nbsp;
                    <a href="${waLink}?text=${encodeURIComponent('Hola ' + data.contactName + ', te contacto de My College respecto a tu solicitud de webinar para ' + data.schoolName)}" 
                       style="display: inline-block; background-color: #16a34a; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 14px;">
                      💬 Escribir por WhatsApp
                    </a>` : ''}
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
              <p style="margin: 0;">
                Notificación automática generada por <strong>My College</strong> • Plataforma de Gestión para Colegios
              </p>
              <p style="margin: 6px 0 0 0;">
                Recibido en: <strong>contacto@mycollege.com.mx</strong>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function escapeHtml(text?: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function sendWebinarEmail(payload: WebinarEmailPayload): Promise<{ success: boolean; message: string; simulated?: boolean }> {
  // En Google Workspace / Gmail:
  // auth.user DEBE ser la cuenta principal con la que se generó la contraseña de aplicación:
  // por ejemplo: armando.villanueva@mycollege.com.mx
  const authUser = (
    process.env.GMAIL_AUTH_USER ||
    process.env.GMAIL_USER ||
    'armando.villanueva@mycollege.com.mx'
  ).trim();

  const gmailPass = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');

  // Dirección remitente visible (puede ser el alias institucional como contacto@mycollege.com.mx)
  const fromEmail = (
    process.env.GMAIL_FROM ||
    'contacto@mycollege.com.mx'
  ).trim();

  // Destinatarios: por defecto enviamos a contacto@mycollege.com.mx y a armando.villanueva@mycollege.com.mx
  const recipient = (
    process.env.CONTACT_RECIPIENT_EMAIL ||
    'contacto@mycollege.com.mx, armando.villanueva@mycollege.com.mx'
  ).trim();

  // If credentials are not configured yet, log and inform the caller
  if (!gmailPass) {
    console.warn('[Webinar Email] GMAIL_APP_PASSWORD no está configurado en las variables de entorno. El registro se guardó en Firebase pero el correo no se pudo enviar vía Gmail.');
    return {
      success: true,
      simulated: true,
      message: 'Datos recibidos y guardados en Firestore. Para que el correo llegue a tu bandeja de Gmail, define GMAIL_APP_PASSWORD en las variables de entorno.'
    };
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: authUser,
      pass: gmailPass
    }
  });

  const subject = `🎓 Nuevo Webinar Agendado: ${payload.schoolName} (${payload.contactName})`;
  const htmlContent = buildWebinarHtml(payload);
  const plainText = `
Nuevo Webinar Agendado en My College:
Colegio: ${payload.schoolName}
Contacto: ${payload.contactName}
Correo: ${payload.email}
Teléfono: ${payload.phone || 'No especificado'}
Alumnos: ${payload.studentCount || 'No especificado'}
Tema: ${payload.webinarTopic || 'Plataforma Integral'}
Fecha preferida: ${payload.preferredDate || 'Por coordinar'}
Horario: ${payload.preferredTime || 'Por coordinar'}
Sistema actual: ${payload.currentSystem || 'No especificado'}
Mensaje: ${payload.message || 'Sin mensaje'}
  `.trim();

  try {
    const info = await transporter.sendMail({
      from: `"My College Web" <${fromEmail}>`,
      to: recipient,
      replyTo: payload.email,
      subject: subject,
      text: plainText,
      html: htmlContent
    });

    console.log('[Webinar Email] Correo enviado exitosamente:', info.messageId);
    return {
      success: true,
      message: `Correo de notificación enviado exitosamente a ${recipient} desde ${authUser}`
    };
  } catch (error: any) {
    console.error('[Webinar Email Error]:', error);
    let detail = error?.message || 'Error desconocido';
    if (detail.includes('535') || detail.includes('Username and Password not accepted')) {
      detail += '. Verifica que GMAIL_USER sea tu correo principal de inicio de sesión (armando.villanueva@mycollege.com.mx) y que la contraseña de aplicación sea de 16 caracteres generada para esa cuenta.';
    }
    return {
      success: false,
      message: `Error al enviar correo vía Gmail: ${detail}`
    };
  }
}

// Handler compatible with Vercel Serverless Functions (/api/send-webinar)
export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Utiliza POST.' });
  }

  try {
    const body: WebinarEmailPayload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    
    if (!body || !body.schoolName || !body.contactName || !body.email) {
      return res.status(400).json({ 
        error: 'Faltan campos obligatorios: schoolName, contactName y email son requeridos.' 
      });
    }

    const result = await sendWebinarEmail(body);
    return res.status(result.success ? 200 : 500).json(result);
  } catch (err: any) {
    console.error('[API send-webinar Error]:', err);
    return res.status(500).json({ error: err?.message || 'Error interno del servidor' });
  }
}
