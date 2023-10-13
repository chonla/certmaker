import { Application } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import router from "./router.ts";

const app: Application = new Application();

app.use(router.routes());

await app.listen({ port: 80 });