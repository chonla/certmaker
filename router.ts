import { Router } from 'https://deno.land/x/oak/mod.ts';
import { getCert } from "./handlers/get-cert.ts";
// import { getTemplate } from "./handlers/get-template.ts";

const router: Router = new Router();

router.get('/', getCert);
// router.get('/templates/:templateName', getTemplate);

export default router;