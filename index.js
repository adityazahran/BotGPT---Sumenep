const {
    Client,
    GatewayIntentBits,
    Events,
    EmbedBuilder,
} = require("discord.js");
const fs = require("fs");
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

const eventFiles = fs
    .readdirSync("./events")
    .filter((file) => file.endsWith(".js"));


for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (args) => event.execute(args, client))
    } else {
        client.on(event.name, (args) => event.execute(args, client))
    }


}


client.on(Events.MessageCreate, async (msg) => {
    if (msg.author.bot) return;

    if (msg.content.substring(0, 1) === "=") {
        const command = msg.content.substring(1).split(" ")[0];
        switch (command) {
            case "ping":
                msg.channel.send("apalu");
                break;
            case "ask": {
                const question = await askAI(
                    `Q: ${msg.content.replace("=ask", " ")}\nA:`
                );
                msg.channel.send(`${question}`);
                break;
            }
            case "marv": {
                const question = await askAI(
                    `Marv is a chatbot that reluctantly answers questions with sarcastic responses:\n\n You: How many pounds are in a kilogram?
                    Marv: This again? There are 2.2 pounds in a kilogram. Please make a note of this.
                    You: ${msg.content.replace("=marv", " ")}?\nMarv:`
                );
                msg.channel.send(`${question}`);
                break;
            }
            case "grammar": {
                const question = await askAI(
                    `Correct this to standard English:\n\n${msg.content.replace(
                        "=grammar",
                        " "
                    )}`
                );
                msg.channel.send(`${question}`);
                break;
            }
            case "tldr": {
                const question = await askAI(
                    `${msg.content.replace("=tldr", " ")}\n\nTl;dr: `
                );
                msg.channel.send(`${question}`);
                break;
            }
            case "engkong": {
                const question = await askAI(
                    `${msg.content.replace("=engkong", " ")} `
                );
                msg.channel.send(`${question}`);
                break;
            }
            case "dnd": {
                const dnd = await askAI(
                    `Create a Dungeons and Dragon Interaction from this Dark Fantasy intro :\nYou awaken in a dark and musty room, the only light coming from a single candle in the corner. You can't remember how you got here, or why you are here. You can feel a chill in the air, and you can hear the faint sound of something moving in the shadows. You can feel a sense of dread, as if something is watching you. You can feel a strange presence in the room, and you can't shake the feeling that something is about to happen.\n\nTraveler : ${msg.content.replace("=dnd", " ")}\nDungeon Master : `
                );
                msg.channel.send(`${dnd}`);
                break;
            }
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
                        { name: "=marv", value: ":arrow_forward: Tanya ke marv" },
                        { name: "=engkong", value: ":arrow_forward: bebas, literally, gw kosongin prompt yg ini biar bisa diisi apa aja" },
                        { name: "=dnd", value: ":arrow_forward: dnd prompt (blom bisa)" },
                        {
                            name: "=grammar",
                            value: ":arrow_forward: grammar check bahasa jaksel lu",
                        },
                        { name: "=tldr", value: ":arrow_forward: buat TLDR dari text lu" },
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
        prompt: question,
        temperature: 0,
        max_tokens: 500,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,

    });
    return response.data.choices[0].text;
};
client.login(DISCORD_BOT_TOKEN);
