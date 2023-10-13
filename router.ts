import { Router, Context } from 'https://deno.land/x/oak/mod.ts';

const router: Router = new Router();

router
    .get('/', (ctx: Context) => {
        ctx.response.body = 'get root';
    });

export default router;