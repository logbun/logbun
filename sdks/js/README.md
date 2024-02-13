<!-- Logbun SDK for JavaScript -->

<p align="center">
  <a href="https://logbun.io/?utm_source=github&utm_medium=logo" target="_blank">
      <img src="../../packages/ui/assets/main/logo.png" width="300px" alt="Logbun" />
  </a>
</p>

## Links

- [Official Documentation](https://logbun.site/docs)

## Usage

To integrate the Logbun SDK into your project, follow these steps:

1. Install the Logbun SDK using npm:

   ```bash
   npm install @logbun/js
   ```

2. Import Logbun in your JavaScript file:

   ```javascript
   import Logbun from '@logbun/js';
   ```

3. Initialize Logbun by calling `Logbun.init(options)` as early as possible after loading the page. This initializes the SDK and hooks into the environment.

   ```javascript
   Logbun.init({
     apiKey: '{{API_KEY}}',
     // ... other options
   });
   ```

### Manual Events

You can manually send events using the `notify` function provided by `@logbun/js`. Note that these functions will not perform any action until you have called `Logbun.init()`:

```javascript
import Logbun from '@logbun/js';

// Capture exceptions, messages, or manual events
Logbun.notify('Rick');
Logbun.notify(new Error('Roll'));
```

Make sure to replace `{{API_KEY}}` with your actual Logbun API key.

For more details on configuration options and additional features, refer to the [official documentation](https://logbun.site/docs).
