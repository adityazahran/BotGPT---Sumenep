module.exports = {
    name: "ready",
    description: 'Pengecekan bot bisa dijalankan atau tidak',
    execute(client) {
        console.log(`Bot is Ready, Logged in as ${client.user.tag}`);
    }

}