import { Application, Router } from "https://deno.land/x/oak@v12.1.0/mod.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import { chatCompletiions, Message } from "./api/openaiService.ts";

interface ChatBody {
  messages: Message[];
}

interface Choice {
  index: number;
  message: Message;
  finish_reason: string;
}

interface ChatResp {
  choices: Choice[];
}

const port: number = parseInt(config()["PORT"]);
const router = new Router();
router.get("/", (ctx) => {
  ctx.response.body = "Hello world!";
});

router.post("/chat", async (ctx) => {
  if (!ctx.request.hasBody) {
    ctx.response.status = 400;
  } else {
    const chatBody: ChatBody = await ctx.request.body().value;
    const requestMessages = chatBody.messages.length > 5
      ? chatBody.messages.slice(Math.max(chatBody.messages.length - 5, 0))
      : chatBody.messages;

    const resp = await chatCompletiions(requestMessages);
    if (resp.status === 200) {
      const { choices }: ChatResp = await resp.json();
      if (choices[0] && choices[0].message) {
        ctx.response.status = 200;
        ctx.response.body = {
          result: true,
          messages: [...chatBody.messages, choices[0].message],
        };
      }
    } else {
      ctx.response.status = resp.status;
    }
  }
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener(
  "listen",
  () => {
    console.log(`server started at ${port}`);
  },
);

await app.listen({ port });
