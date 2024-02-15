import ClickHouseQueryBuilder from './query';

class EventQueryBuilder extends ClickHouseQueryBuilder {
  constructor() {
    super({
      select: ['*'],
      from: 'logbun.event',
      groupBy: 'fingerprint',
      having: 'sum(sign) > 0',
    });
  }

  public events = [
    'fingerprint',
    'any(id) as id',
    'any(name) as name',
    'any(message) as message',
    'any(level) as level',
    'any(handled) as handled',
    'any(release) as release',
    'any(metadata) as metadata',
    'any(stacktrace) as stacktrace',
    'any(sdk) as sdk',
    'any(os) as os',
    'any(osVersion) as osVersion',
    'any(browser) as browser',
    'any(browserVersion) as browserVersion',
    'any(device) as device',
    'toInt32(sum(count * sign)) as count',
    'toInt64(sum(createdAt * sign)) as createdAt',
    'toInt64(sum(updatedAt * sign)) as updatedAt',
  ];
}

export const query = new EventQueryBuilder();
