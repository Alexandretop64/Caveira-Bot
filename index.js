const Discord = require('discord.js')
const bot = new Discord.Client();
const { prefixo } = require('./config.js')
const fs = require('fs')
const conf = require('./config.js')



console.clear()

fs.readdir("./src/eventos/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let eventFunction = require(`./src/eventos/${file}`);
    let eventName = file.split(".")[0];
    bot.on(eventName, (...args) => eventFunction.run(bot, ...args));
  });
});

bot.on("message", message => {

  if (message.channel.type == "dm") return

  let prefix = prefixo

  if (message.author.bot) return

  if (message == `<@${bot.user.id}>` || message == `<@!${bot.user.id}>`) { // Nessa parte o sem "!" é para menção no celular e o com "!" menção no PC
    message.channel.send(`Olá ${message.author}! Meu prefixo é \`${prefix}\`\nPara saber meus comandos use ${prefix}ajuda`)
  }

  if (!message.content.startsWith(conf.prefixo)) return;

  let command = message.content.split(" ")[0];
  command = command.slice(conf.prefixo.length);

  let args = message.content.split(" ").slice(1);

  try {
    let commandFile = require(`./src/comandos/${command}.js`);
    commandFile.run(bot, message, args);
  } catch (err) {
    console.log(`Erro no comando: ${command}`)
    console.error(err)
  }

});

bot.on('guildMemberAdd', member => {
  let entradaembed = new Discord.RichEmbed()

    .setTitle('Um novo membro entrou no servidor')
    .setColor('BLACK')
    .setThumbnail(member.user.avatarURL)
    .setDescription(`${member} entrou no servidor. \n`)
    .setFooter(`Teste - Todos os direitos reservados.`)
    .setTimestamp()
  let CanalEntrada = bot.channels.get('')
    .send(entradaembed)
})

bot.on('guildMemberRemove', member => {
  let saidembed = new Discord.RichEmbed()

    .setTitle('Um membro saiu do servidor')
    .setColor('BLACK')
    .setThumbnail(member.user.avatarURL)
    .setDescription(`${member} saiu do servidor. \n`)
    .setFooter(`Teste - Todos os direitos reservados`)
    .setTimestamp()
  let CanalSair = bot.channels.get('')
    .send(saidembed)
})

bot.login(conf.env.token)