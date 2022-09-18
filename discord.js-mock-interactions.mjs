import { CommandInteraction } from 'discord.js';

const optionsBuilder = async ({ client, guildId, options }) => {
  const guild = await client.guilds.fetch(guildId);

  opts = await Promise.all(options.map(async o => {
    switch(o.type){
      case 'USER':
        o.member = await guild.members.fetch(o.value);
        o.user = o.member.user;
        break;
      case 'CHANNEL':
        o.channel = await guild.channels.fetch(o.value);
        break;
      case 'ROLE':
        o.role = await guild.roles.fetch(o.value);
        break;
      case 'MENTIONABLE':
        if(opt.value.indexOf('&')>0){
          opt.role = await guild.roles.fetch(opt.value);
        }else{
          opt.member = await guild.members.fetch(opt.value);
        }
      default:break;
    }
    return o;
  }));
  return {build: async ({ id, name, value }) => {
    let opt = opts.find(e => e.id === id)
    if(name) opt.name = name;
    if(value) {
      opt.value=value;
      switch(opt.type){
        case 'USER':
          opt.member = await guild.members.fetch(opt.value);
          opt.user = opt.member.user;
          break;
        case 'CHANNEL':
          opt.channel = await guild.channels.fetch(opt.value);
          break;
        case 'ROLE':
          opt.role = await guild.roles.fetch(opt.value);
          break;
        case 'MENTIONABLE':
          if(opt.value.indexOf('&')>0){
            opt.role = await guild.roles.fetch(opt.value);
          }else{
            opt.member = await guild.members.fetch(opt.value);
          }
        default:break;
      }
    }
    return opt;
  }}
}

const interactionBuilder = async ({ client, guildId, channelId, userId }) => {
  const guild = await client.guilds.fetch(guildId);
  const member = await guild.members.fetch(userId);
  const channel = await guild.channels.fetch(channelId);
  const user = member.user;

  return ({ type, name, subcommand, reply, options }) => {
    let interaction = new CommandInteraction(client, {data: { }, user});
    interaction.type = type;
    interaction.guildId = guild.id;
    interaction.reply = reply;
    interaction.commandName = name;
    interaction.guild = guild;
    interaction.member = member;
    interaction.user = user;
    interaction.options._subcommand = subcommand;
    interaction.options._hoistedOptions = options;
    return interaction;
  }
}

module.exports = { optionsBuilder, interactionBuilder }