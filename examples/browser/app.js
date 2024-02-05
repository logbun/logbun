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
  // This apiKey is for testing purposes. Please use your own apiKey
  apiKey: 'uhukk9tj3x8lxmt3mfsgmvh31x5xhx4n',

  // This endpoint is for testing purposes. Please remove
  endpoint: 'http://localhost:8000/event',
});
