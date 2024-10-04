import * as React from "react";

export const EmailTemplateWelcome = () => (
  <div>
    <h1>Vitajte!</h1>
    <p>
      Ďakujeme za Váš záujem, čoskoro sa Vám ozveme. <br />V prípade akýchkoľvek
      otázok nás neváhajte kontaktovať.
    </p>
  </div>
);

export const EmailTemplateResponseNeeded = (email: string) => (
  <div>
    <h1>Niekto má záujem!</h1>
    <p>
      Niekto s emailom <strong>{email}</strong> má záujem o spoluprácu.
    </p>
  </div>
);
