# RESTing bot
#### A bot for requesting REST Api's

### About

RESTing bot is a discord bot, which can send requests to REST Api's by text messages. It prints the json response from the server in a code block.

### Usage

To invite RESTing bot to a discord server, click [here](https://discord.com/oauth2/authorize?client_id=785489602143322134&scope=bot).

At a server with RESTing bot, get to a text channel and type:
```
[your-prefix]get <your url>
```

You can also send a `POST` request:
```
[your-prefix]post <url> ```<body>```
```

`your-prefix` is specified in the `auth.ts` file.

This should be the written message:

![message](./docs/post-request.png)

If you want, you can create a new line:

![new-line](./docs/new-line-message.png)

But the final result should be:

![final](./docs/final-result-request.png)

**Remember:** The body param **must be surrounded by ```**!

**Warn!** In `auth.ts` file You shoudn't set the prefix value to anything that any URL can have, e.g.: **/**, **:** and **.**, otherwise the bot will throw an error.

### Cloning

Clone this repository:
```shell
git clone https://github.com/tales-garcia/resting-bot.git
```

Install dependencies:
```shell
npm install
```

Rename `config/auth.sample.ts` to `auth.ts` and fill it with your credentials.

Start the bot:
```shell
npm start
```