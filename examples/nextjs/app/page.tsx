'use client';
import { Logbun } from '@logbun/nextjs';

export default function Home() {
  function handledError() {
    try {
      // @ts-ignore
      console.log(THIS_VARIABLE_DOES_NOT_EXIST);
    } catch (e) {
      Logbun.notify(e);
    }
  }

  function unhandledError() {
    const number = 1;
    // @ts-ignore
    number.toUpperCase();
  }

  return (
    <>
      <h1>Logbun React Example</h1>
      <div className="card">
        <button onClick={handledError}>Logbun.notify(error)</button>
        <button onClick={unhandledError}>throw new Error(error)</button>
        <p>Handled by ErrorBoundary in main.jsx</p>
      </div>
    </>
  );
}
