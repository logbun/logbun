import Code from './code';
import { libraries } from './libraries';

export default function Tracking() {
  const library = libraries.js;

  return (
    <div className="py-8 container-sm">
      <h5>Configure {library.title}</h5>
      <p className="pb-5 text-gray-500">Use these instructions to install Logbun on your app.</p>
      <Code steps={library.steps} />
    </div>
  );
}
