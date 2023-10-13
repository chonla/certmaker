import { Router } from 'https://deno.land/x/oak/mod.ts';
import { getCert } from "./handlers/get-cert.ts";

const router: Router = new Router();

router.get('/', getCert);

export default router;