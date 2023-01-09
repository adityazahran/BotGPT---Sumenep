const {
    Client,
    GatewayIntentBits,
    Events,
    EmbedBuilder,
} = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");
const { DISCORD_BOT_TOKEN, OPENAI_KEY } = require("./config.json");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once(Events.ClientReady, (c) => {
    console.log(`Bot is Ready, Logged in as ${c.user.tag}`);
});

client.on(Events.MessageCreate, async (msg) => {
    if (msg.author.bot) return;

    if (msg.content.substring(0, 1) === "=") {
        const command = msg.content.substring(1).split(" ")[0];
        switch (command) {
            case "ping":
                msg.channel.send("apalu");
                break;
            case "ask":
                const answ = await askAI(
                    `Q: ${msg.content.replace("=ask", " ")}\nA:`
                );
                msg.channel.send(`${answ}`);
                break;
            case "grammar":
                const grammar = await askAI(
                    `Correct this to standard English:\n\n${msg.content.replace(
                        "=grammar",
                        " "
                    )}`
                );
                msg.channel.send(`${grammar}`);
                break;
            case "tldr":
                const Tldr = await askAI(
                    `${msg.content.replace("=tldr", " ")}\n\nTl;dr`
                );
                msg.channel.send(`${Tldr}`);
                break;
            // Help Command
            case "help":
                const embedHelp = new EmbedBuilder()
                    .setColor(0xffffff)
                    .setTitle('Chat GPT - Sumenep Command List')
                    .setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
                    .setDescription(
                        `List Command yang udah dibuat oleh author gw di server \n${msg.guild.name}`
                    )
                    // masih hard code
                    .addFields(
                        { name: "=ask", value: ":arrow_forward: Tanya ke bot" },
                        {
                            name: "=grammar",
                            value: ":arrow_forward: grammar check bahasa jaksel lu",
                        },
                        { name: "=tldr", value: ":arrow_forward: buat TLDR dari text lu" }
                    )
                msg.channel.send({ embeds: [embedHelp] });
                break;
            default:
                break;
        }
    }
});

const askAI = async (question) => {
    const configuration = new Configuration({
        apiKey: OPENAI_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: question || grammar || Tldr,
        temperature: 0,
        max_tokens: 300,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: ["`"],
    });
    return response.data.choices[0].text;
};
client.login(DISCORD_BOT_TOKEN);
