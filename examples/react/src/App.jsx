import { Logbun } from '@logbun/react';
import './App.css';
import reactLogo from './assets/react.svg';

function App() {
  function handledError() {
    try {
      // eslint-disable-next-line no-undef
      console.log(THIS_VARIABLE_DOES_NOT_EXIST);
    } catch (e) {
      Logbun.notify(e);
    }
  }

  function unhandledError() {
    let number = 1;
    number.toUpperCase();
  }

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Logbun React Example</h1>
      <div className="card">
        <button onClick={handledError}>Logbun.notify(error)</button>
        <button onClick={unhandledError}>throw new Error(error)</button>
        <p>Handled by ErrorBoundry in main.jsx</p>
      </div>
    </>
  );
}

export default App;
