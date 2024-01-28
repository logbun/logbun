import { createTransport } from 'nodemailer';

type EmailOptions = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export const sendEmail = async (options: EmailOptions) => {
  const transport = createTransport(process.env.EMAIL_SERVER);

  console.log(process.env.EMAIL_SERVER, process.env.EMAIL_FROM);

  const result = await transport.sendMail({
    from: `Logbun <${process.env.EMAIL_FROM}>`,
    ...options,
  });

  const failed = result.rejected.concat(result.pending).filter(Boolean);

  if (failed.length) {
    throw new Error(`Email (${failed.join(', ')}) could not be sent`);
  }
};

export const isDisposableEmail = async (email: string) => {
  const url = `https://disposable.debounce.io/?email=${email}`;

  try {
    const response = await fetch(url, { method: 'GET', headers: { accept: 'application/json' } });

    const data = await response.json();

    return data === 'true';
  } catch {
    return false;
  }
};
