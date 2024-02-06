var Logbun = require('@logbun/node');

Logbun.init({
  apiKey: process.env.LOGBUN_API_KEY,
  endpoint: process.env.LOGBUN_EVENT_ENDPOINT, // optional
});

// Send 2 errors
function unhandledError() {
  let number = 1;
  number.toUpperCase();
}

function handledError() {
  try {
    console.log(THIS_VARIABLE_DOES_NOT_EXIST);
  } catch (e) {
    Logbun.notify(e);
  }
}

handledError();

unhandledError();
