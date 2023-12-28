import { Types } from '@logbun/core';
import Logbun from '@logbun/react';

export function init(config: Partial<Types.Config>) {
  Logbun.init(config);
}
