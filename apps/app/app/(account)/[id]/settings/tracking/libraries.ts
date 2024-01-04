import { SyntaxHighlighterProps } from 'react-syntax-highlighter';

export type LibraryConfig = Record<
  string,
  {
    title: string;
    steps: StepConfig[];
  }
>;

export type StepConfig = {
  title: string;
  content: {
    message?: string;
    snippet?: SyntaxHighlighterProps;
  }[];
};

const js: StepConfig[] = [
  {
    title: '1: Install Logbun',
    content: [
      {
        message: 'With package manager',
        snippet: { children: 'npm install --save @logbun/js', language: 'bash' },
      },
      {
        message: 'Or with CDN:',
        snippet: {
          children: `<script>
(function (l,o,g,b,u,n){l['LogBunObject']=g;l[g] = l[g]||function(){
(l[g].q=l[g].q||[]).push(arguments)};u=o.createElement('script'),
n=o.getElementsByTagName('script')[0];
u.id=g;u.src=b;u.async=1;n.parentNode.insertBefore(u,n);
}(window, document, 'lb', 'https://cdn.logbun.com/latest/logbun.min.js'));
lb('init', { apiKey: 'API_KEY' });
</script>`,
          language: 'html',
        },
      },
    ],
  },
  {
    title: '2: Configure the integration',
    content: [
      {
        message: 'ECMAScript Module:',
        snippet: {
          children: `import Logbun from "@logbun/js"
const logbun = new Logbun({ apiKey: "API_KEY" })`,
          language: 'javascript',
        },
      },
      {
        message: 'Or CommonJS:',
        snippet: {
          children: `const Logbun = require("@logbun/js").default
const logbun = new Logbun({ apiKey: "API_KEY" })`,
          language: 'javascript',
        },
      },
    ],
  },
  {
    title: '3: Using a front-end framework?',
    content: [
      {
        message:
          'If you use a Front-End framework such as React, or Nextjs, follow the steps on our integrations documentation page.',
      },
    ],
  },
  {
    title: '4: Test the installation',
    content: [
      {
        message:
          'To make sure the integration works as intended, run your application and trigger an error in the console:',
        snippet: { children: `logbun.notify('Testing Logbun')`, language: 'bash' },
      },
    ],
  },
  {
    title: '5: Finished installation',
    content: [
      {
        message: 'Thats it! Head to the next page where we will wait until the demo data is processed.',
      },
    ],
  },
];

export const libraries = {
  js: {
    title: 'Browser Javascript SDK',
    steps: js,
  },
};
