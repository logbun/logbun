document.getElementById('handled-error').addEventListener('click', async function () {
  try {
    console.log(THIS_VARIABLE_DOES_NOT_EXIST);
  } catch (e) {
    Logbun.notify(e);
  }
});

document.getElementById('unhandled-error').addEventListener('click', function () {
  let number = 1;
  number.toUpperCase();
});

Logbun.init({
  apiKey: 'YOUR_API_KEY',
  endpoint: 'http://localhost:2000/api/log',
});
