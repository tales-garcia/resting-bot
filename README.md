# RESTing bot
#### A bot for requesting REST Api's

### About

RESTing bot is a discord bot, which can send requests to REST Api's by text messages. It prints the json response from the server in a code block.

### Usage

To invite RESTing bot to a discord server, click [here](https://discord.com/api/oauth2/authorize?client_id=785489602143322134&permissions=2147568640&scope=applications.commands%20bot).

At a server with RESTing bot, get to a text channel and type:
```
[your-prefix]get <your url>
```

You can also send a `POST` request:
```
[your-prefix]post <url> ```<body>```
```

`your-prefix` is specified in the `.env` file.

This should be the written message:

![message](./docs/post-request.png)

If you want, you can create a new line:

![new-line](./docs/new-line-message.png)

But the final result should be:

![final](./docs/final-result-request.png)

### Cloning

Clone this repository:
```shell
git clone https://github.com/tales-garcia/resting-bot.git
```

Install dependencies:
```shell
npm install
```

Rename `.env.example` to `.env` and fill it with your credentials.

Start the bot:
```shell
npm run dev:start
```


# License

This project uses the MIT License.
