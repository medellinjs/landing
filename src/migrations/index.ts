import * as migration_20260415_230135 from './20260415_230135'

export const migrations = [
  {
    up: migration_20260415_230135.up,
    down: migration_20260415_230135.down,
    name: '20260415_230135',
  },
]
