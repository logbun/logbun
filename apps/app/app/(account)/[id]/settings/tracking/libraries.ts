import { SyntaxHighlighterProps } from 'react-syntax-highlighter';

type Options = {
  apiKey?: string;
  cdnUrl?: string;
};

export type LibraryContent = {
  title?: string;
  snippet?: SyntaxHighlighterProps;
};

export type LibraryConfig = {
  title: string;
  message?: string;
  content?: LibraryContent | LibraryContent[];
};

const configLibrary = (platform: string, config: LibraryConfig[] = []) => {
  return [
    {
      title: 'Install Logbun',
      content: [
        {
          title: 'Npm',
          snippet: { children: `npm install --save @logbun/${platform}`, language: 'bash' },
        },
        {
          title: 'Yarn',
          snippet: { children: `yarn add @logbun/${platform}`, language: 'bash' },
        },
        {
          title: 'Pnpm',
          snippet: { children: `pnpm add @logbun/${platform}`, language: 'bash' },
        },
      ],
    },
    ...config,
    {
      title: 'Test the installation',
      message: 'To make sure the integration works as intended, run your application and trigger an error like below',
      content: {
        snippet: { children: `Logbun.notify('Testing Logbun')`, language: 'javascript' },
      },
    },
    {
      title: 'Finished installation',
      message: 'Thats it! Head to the project page to see your errors.',
    },
  ];
};

export const generateLibraries = ({ apiKey, cdnUrl }: Options) => {
  return {
    js: configLibrary('js', [
      {
        title: 'Install Logbun',
        message: 'Please under the head tag',
        content: {
          title: 'CDN',
          snippet: {
            children: `<script src="${cdnUrl}/logbun-cdn/latest/logbun.min.js"></script>`,
            language: 'html',
          },
        },
      },
      {
        title: 'Configure the integration',
        content: {
          snippet: {
            children: `Logbun.init({ apiKey: '${apiKey}' });`,
            language: 'javascript',
          },
        },
      },
    ]).slice(1),
    react: configLibrary('react', [
      {
        title: 'Configure the integration in your root file.',
        content: {
          snippet: {
            children: `import Logbun, { LogbunErrorBoundary } from '@logbun/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

Logbun.init({ apiKey: '${apiKey}' });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <LogbunErrorBoundary logbun={Logbun}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </LogbunErrorBoundary>
);
`,
            language: 'jsx',
          },
        },
      },
    ]),
    node: configLibrary('node', [
      {
        title: 'Configure the integration',
        content: [
          {
            title: 'ECMAScript',
            snippet: {
              children: `import Logbun from "@logbun/node"
const logbun = new Logbun({ apiKey: "${apiKey}" })`,
              language: 'javascript',
            },
          },
          {
            title: 'CommonJS',
            snippet: {
              children: `const Logbun = require("@logbun/node")
const logbun = new Logbun({ apiKey: "${apiKey}" })`,
              language: 'javascript',
            },
          },
        ],
      },
    ]),
    nextjs: configLibrary('nextjs', [
      {
        title: 'Create Initialization Config Files',
        message:
          'Create logbun.client.config.js, logbun.server.config.js and logbun.edge.config.js in the root directory of your project and add your initialization code.',
        content: [
          {
            title: 'logbun.client.config.js',
            snippet: {
              children: `//logbun.client.config.js
import Logbun from "@logbun/nextjs"
Logbun.init({ apiKey: "${apiKey}" })`,
              language: 'javascript',
            },
          },
          {
            title: 'logbun.server.config.js',
            snippet: {
              children: `//logbun.server.config.js
import Logbun from "@logbun/nextjs"
Logbun.init({ apiKey: "${apiKey}" })`,
              language: 'javascript',
            },
          },
          {
            title: 'logbun.edge.config.js',
            snippet: {
              children: `//logbun.edge.config.js
import Logbun from "@logbun/nextjs"
Logbun.init({ apiKey: "${apiKey}" })`,
              language: 'javascript',
            },
          },
        ],
      },
      {
        title: 'Extend your Next.js Configuration',
        message: 'Use withLogbunConfig to extend the default Next.js usage of webpack.',
        content: {
          snippet: {
            children: `/** @type {import('next').NextConfig} */
const moduleExports = {};

const logbunConfig = {
  silent: true,
};

const { withLogbunConfig } = require('@logbun/nextjs');

module.exports = withLogbunConfig(moduleExports, logbunConfig);
`,
            language: 'javascript',
          },
        },
      },
      {
        title: 'Report React Component Render Errors',
        message: 'To capture React render errors you need to add Error components to the root.',
        content: [
          {
            title: 'global-error.tsx',
            snippet: {
              children: `"use client";

import Logbun from "@logbun/nextjs";
import NextError from "next/error";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Logbun.notify(error);
  }, [error]);

  return (
    <html>
      <body>
        {/* This is the default Next.js error component but it doesn't allow omitting the statusCode property yet. */}
        <NextError statusCode={undefined as any} />
      </body>
    </html>
  );
}`,
              language: 'typescript',
            },
          },
          {
            title: 'error.tsx',
            snippet: {
              children: `"use client";

import { useEffect } from "react";
import Logbun from "@logbun/nextjs";

export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    // Log the error to Logbun
    Logbun.notify(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
    </div>
  );
}`,
              language: 'typescript',
            },
          },
        ],
      },
    ]),
  };
};
