const createEmailTemplate = (content, clientName = '') => {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>King's Nail's</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f8f9fa;
        }
        
        .email-container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .header {
          background: linear-gradient(135deg, #ff6b9d, #c44569);
          padding: 30px 20px;
          text-align: center;
          color: white;
        }
        

        
        .header h1 {
          font-size: 28px;
          font-weight: 300;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .content {
          padding: 40px 30px;
        }
        
        .greeting {
          font-size: 18px;
          color: #2c3e50;
          margin-bottom: 20px;
          font-weight: 500;
        }
        
        .message {
          font-size: 16px;
          line-height: 1.8;
          color: #555;
          margin-bottom: 25px;
        }
        
        .highlight-box {
          background: linear-gradient(135deg, #ffeef7, #f8f9ff);
          border: 1px solid #ff6b9d;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        
        .highlight-box h3 {
          color: #c44569;
          margin-bottom: 15px;
          font-size: 18px;
        }
        
        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        
        .detail-item:last-child {
          border-bottom: none;
        }
        
        .detail-label {
          font-weight: 600;
          color: #2c3e50;
        }
        
        .detail-value {
          color: #555;
          text-align: right;
        }
        
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #ff6b9d, #c44569);
          color: white;
          padding: 14px 28px;
          text-decoration: none;
          border-radius: 25px;
          font-weight: 600;
          text-align: center;
          margin: 20px 0;
          transition: transform 0.2s;
        }
        
        .button:hover {
          transform: translateY(-2px);
        }
        
        .footer {
          background-color: #2c3e50;
          color: #ecf0f1;
          padding: 30px 20px;
          text-align: center;
        }
        
        .signature {
          font-size: 16px;
          font-style: italic;
          margin-bottom: 15px;
          color: #ff6b9d;
        }
        
        .contact-info {
          font-size: 14px;
          opacity: 0.8;
          margin-top: 15px;
        }
        
        .social-links {
          margin-top: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .social-links a {
          color: #ff6b9d;
          text-decoration: none;
          font-size: 14px;
          display: flex;
          align-items: center;
          padding: 8px 12px;
          border-radius: 20px;
          background-color: rgba(255, 107, 157, 0.1);
          transition: background-color 0.3s;
        }
        
        .social-links a:hover {
          background-color: rgba(255, 107, 157, 0.2);
        }
        
        @media (max-width: 600px) {
          .email-container {
            margin: 10px;
            border-radius: 8px;
          }
          
          .content {
            padding: 20px;
          }
          
          .header {
            padding: 20px;
          }
          
          .detail-item {
            flex-direction: column;
            text-align: left;
          }
          
          .detail-value {
            text-align: left;
            margin-top: 5px;
            font-weight: 600;
          }
          
          .social-links {
            flex-direction: column;
            gap: 10px;
          }
          
          .social-links a {
            justify-content: center;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div style="font-size: 48px; margin-bottom: 10px;">💅</div>
          <h1>King's Nail's</h1>
        </div>
        
        <div class="content">
          ${clientName ? `<div class="greeting">¡Hola ${clientName}!</div>` : ''}
          ${content}
        </div>
        
        <div class="footer">
          <div class="signature">
            Agradeciendo su preferencia,<br>
            <strong>El equipo de King's Nail's</strong>
          </div>
          <div class="contact-info">
            Síguenos en nuestras redes sociales para más novedades y promociones
          </div>
          <div class="social-links">
            <a href="https://wa.me/7717005244" target="_blank" rel="noopener noreferrer">
              📱 WhatsApp
            </a>
            <a href="https://www.facebook.com/profile.php?id=100078210050883" target="_blank" rel="noopener noreferrer">
              📘 Facebook
            </a>
            <a href="mailto:kignsnails@outlook.com" target="_blank" rel="noopener noreferrer">
              📧 Email
            </a>
            <a href="https://maps.app.goo.gl/r8ELbiW2Vi2FfRG98" target="_blank" rel="noopener noreferrer">
              📍 Ubicación
            </a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = { createEmailTemplate };