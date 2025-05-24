import * as React from "react";

export const EmailTemplateWelcome = () => (
  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
    <h1 style={{ color: '#2563eb', marginBottom: '20px' }}>Vitajte v Bageta Express!</h1>
    <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
      Ďakujeme za Váš záujem o spoluprácu s Bageta Express. Vaša správa bola úspešne prijatá a čoskoro sa Vám ozveme.
    </p>
    <div style={{ backgroundColor: '#f3f4f6', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
      <p style={{ margin: '0', fontSize: '16px', lineHeight: '1.5' }}>
        V prípade akýchkoľvek otázok nás môžete kontaktovať na emailovej adrese <a href="mailto:tomas.zifcak197@gmail.com" style={{ color: '#2563eb' }}>tomas.zifcak197@gmail.com</a>.
      </p>
    </div>
    <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '30px' }}>
      S pozdravom,<br />
      Tím Bageta Express
    </p>
  </div>
);

export const EmailTemplateResponseNeeded = (email: string) => (
  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
    <h1 style={{ color: '#dc2626', marginBottom: '20px' }}>Nový záujem o spoluprácu</h1>
    <div style={{ backgroundColor: '#fee2e2', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
      <p style={{ margin: '0', fontSize: '16px', lineHeight: '1.5' }}>
        Potenciálny partner s emailom <strong>{email}</strong> má záujem o spoluprácu s Bageta Express.
      </p>
    </div>
    <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '20px' }}>
      Prosím, kontaktujte záujemcu čo najskôr na uvedenej emailovej adrese.
    </p>
  </div>
);

interface SupportEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const EmailTemplateSupportConfirmation = (data: SupportEmailData) => (
  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
    <h1 style={{ color: '#2563eb', marginBottom: '20px' }}>Potvrdenie správy - Bageta Express</h1>
    <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
      Vážený/á <strong>{data.name}</strong>,
    </p>
    <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
      Ďakujeme za Vašu správu. Potvrdzujeme, že sme ju prijali a budeme ju riešiť čo najskôr.
    </p>
    <div style={{ backgroundColor: '#f3f4f6', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
      <p style={{ margin: '0' }}><strong>Predmet:</strong> {data.subject}</p>
      <p style={{ margin: '10px 0' }}><strong>Správa:</strong></p>
      <p style={{ margin: '0', whiteSpace: 'pre-wrap' }}>{data.message}</p>
    </div>
    <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
      V prípade akýchkoľvek dodatočných otázok nás môžete kontaktovať na emailovej adrese <a href="mailto:kontakt@bageta.express" style={{ color: '#2563eb' }}>kontakt@bageta.express</a>.
    </p>
    <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '30px' }}>
      S pozdravom,<br />
      Tím Bageta Express
    </p>
  </div>
);

export const EmailTemplateSupportNotification = (data: SupportEmailData) => (
  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
    <h1 style={{ color: '#dc2626', marginBottom: '20px' }}>Nová správa od zákazníka</h1>
    <div style={{ backgroundColor: '#fee2e2', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
      <p style={{ margin: '0' }}><strong>Odosielateľ:</strong> {data.name}</p>
      <p style={{ margin: '5px 0' }}><strong>Email:</strong> {data.email}</p>
      <p style={{ margin: '5px 0' }}><strong>Predmet:</strong> {data.subject}</p>
      <p style={{ margin: '10px 0' }}><strong>Správa:</strong></p>
      <p style={{ margin: '0', whiteSpace: 'pre-wrap' }}>{data.message}</p>
    </div>
    <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '20px' }}>
      Táto správa bola odoslaná cez kontaktný formulár na webstránke Bageta Express.
    </p>
  </div>
);
