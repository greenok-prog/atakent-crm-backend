import { Visitor } from "../entities/visitor.entity";

export  const getHtmlMessage = (visitor:Visitor, qrImg:string) =>{
    const html = `
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: 'Arial', sans-serif;
        background: #f9fafb;
        margin: 0;
        padding: 40px;
      }

      .ticket {
        max-width: 600px;
        margin: 0 auto;
        background: #ffffff;
        border: 1px solid #d1d5db;
        border-radius: 12px;
        padding: 30px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }

      .header {
        text-align: center;
        margin-bottom: 30px;
      }

      .header h1 {
        font-size: 24px;
        color: #111827;
        margin: 0;
      }

      .event {
        font-size: 18px;
        color: #374151;
        margin-top: 10px;
      }

      .details {
        margin-bottom: 30px;
      }

      .details p {
        margin: 6px 0;
        font-size: 14px;
        color: #374151;
      }

      .details strong {
        color: #111827;
      }

      .qr {
        text-align: center;
        margin-bottom: 30px;
      }

      .qr img {
        width: 180px;
        height: 180px;
      }

      .footer {
        font-size: 12px;
        color: #6b7280;
        text-align: center;
        border-top: 1px dashed #d1d5db;
        padding-top: 10px;
      }
    </style>
  </head>
  <body>
    <div class="ticket">
      <div class="header">
        <h1>Ваш билет на выставку</h1>
        <div class="event">${visitor.exhibition.name}</div>
      </div>

      <div class="details">
        <p><strong>Имя:</strong> ${visitor.name}</p>
        <p><strong>Статус:</strong> ${visitor.executor === 'company' ? 'Компания' : 'Физическое лицо'}</p>
        <p><strong>Дата регистрации:</strong> ${visitor.date.toLocaleDateString('ru-RU')}</p>
        <p><strong>ID билета:</strong> ${visitor.id}</p>
      </div>

      <div class="qr">
        <img src="${qrImg}" alt="QR Code" />
      </div>

      <div class="footer">
        Покажите этот билет на входе. Не забудьте документ, удостоверяющий личность.
      </div>
    </div>
  </body>
</html>
`;
return html
}