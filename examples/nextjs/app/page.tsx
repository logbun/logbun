'use client';

export default function Home() {
  function unhandledError() {
    let number = 1;
    (number as any).toLowerCase();
  }

  return (
    <>
      <h1>Logbun Nextjs Example</h1>
      <div className="card">
        <button onClick={unhandledError}>throw unhandledError</button>
      </div>
    </>
  );
}
