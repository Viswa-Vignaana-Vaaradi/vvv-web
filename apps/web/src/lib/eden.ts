import { env } from "@repo/env/web";
import { edenTreaty } from '@elysiajs/eden';
import type { App } from '../../../server/src/index';

export const api = edenTreaty<App>(env.NEXT_PUBLIC_SERVER_URL!);