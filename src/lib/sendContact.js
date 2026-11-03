// Invio delle richieste di contatto all'email personale.
// Primo tentativo: Web3Forms (se c'è la chiave). Riserva: FormSubmit.
// Ogni tentativo ha un timeout, così il form non resta mai bloccato.

// Chiave pubblica di Web3Forms legata a marzola.fra@gmail.com (si crea su web3forms.com).
export const WEB3FORMS_KEY = '';
const FORMSUBMIT_ID = '2fb7effbd6f6697b94d45d3f793d4a3e';
const TIMEOUT = 10000;

async function post(url, body) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.success === false || json.success === 'false') throw new Error(json.message || `HTTP ${res.status}`);
    return json;
  } finally {
    clearTimeout(timer);
  }
}

// subject: oggetto dell'email; replyTo: email di chi scrive; fields: { etichetta: valore }
export async function sendContact({ subject, replyTo, fields }) {
  const errors = [];
  if (WEB3FORMS_KEY) {
    try {
      return await post('https://api.web3forms.com/submit', {
        access_key: WEB3FORMS_KEY,
        subject,
        from_name: 'francescomarzola.it',
        replyto: replyTo,
        botcheck: false,
        ...fields,
      });
    } catch (e) {
      errors.push(e);
    }
  }
  try {
    return await post(`https://formsubmit.co/ajax/${FORMSUBMIT_ID}`, {
      _subject: subject,
      _template: 'table',
      _captcha: 'false',
      _replyto: replyTo,
      ...fields,
    });
  } catch (e) {
    errors.push(e);
  }
  throw new Error(errors.map((e) => e.message).join(' | ') || 'Invio non riuscito');
}
