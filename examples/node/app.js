var Logbun = require('@logbun/node');

Logbun.init({
  apiKey: 'YOUR_API_KEY',
  endpoint: 'http://localhost:2000/api/log',
});

// Send 2 errors
function unhandledError() {
  const message = 'throw new Error(error)';

  console.log(message);

  throw new Error(message);
}

function handledError() {
  const message = 'Logbun.notify(error)';

  console.log(message);

  Logbun.notify(new Error(message));
}

handledError();

unhandledError();
