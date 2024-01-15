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
  apiKey: 'u8u6uq41kozwiu8kio62icn5pz2oyzc8',
  endpoint: 'http://localhost:8000/event',
});
