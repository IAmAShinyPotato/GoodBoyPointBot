const Discord = require('discord.js');
const economy = require('discord-eco');

const client = new Discord.Client();
//Replace 'REPLACE THIS' with the role that can give out GoodBoyPoints
const modRole = 'REPLACE THIS';

//This will show the bot is ready
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// This will run when a message is recieved...
client.on('message', message => {

    // Variables
      //You can replace the ~ with a different prefix if desired
    let prefix = '~';
    let msg = message.content.toUpperCase();
    // Lets also add some new variables
    let cont = message.content.slice(prefix.length).split(" ");
    let args = cont.slice(1);

    // Commands
    if (message.content.toUpperCase() === `${prefix}PING`) {
        message.channel.send(':ping_pong: Pong!');
    }

    //Adding/Subtracting GBP
    if (msg.startsWith(`${prefix}ADDPOINTS`)) {

        //To check if they have the role
        if (!message.member.roles.find("name", modRole)) {
            message.channel.send("**You need the role `' + modRole + '` to use this command.**");
            return;
        }

        // Check if they defined an amount
        if (!args[0]) {
            message.channel.send(`**You need to define an amount. Usage: ${prefix}addmoney <amount> <user>**`);
            return;
        }

        // Check if the amount is an actual number
        if (isNaN(args[0])) {
            message.channel.send(`**The amount has to be a number. Usage: ${prefix}addmoney <amount> <user>**`);
            return; // Remember to return if you are sending an error message! So the rest of the code doesn't run.
        }

        // Check if they defined a user
        let defineduser = '';
        if (!args[1]) { // If they didn't define anyone, set it to their own.
            defineduser = message.author.id;
        } else { // Run this if they did define someone...
            let firstMentioned = message.mentions.users.first();
            defineduser = firstMentioned.id;
        }

        //This is the about section
        if (message.content.toUpperCase() === `${prefix}ABOUT`) {
            message.channel.send(':potato: This is the GoodBoyPoints bot made by IAmAShinyPotato');
        }

        // Finally, run this.. REMEMBER IF you are doing the guild-unique method, make sure you add the guild ID to the end,
        economy.updateBalance(defineduser + message.guild.id, parseInt(args[0])).then((i) => { // AND MAKE SURE YOU ALWAYS PARSE THE NUMBER YOU ARE ADDING AS AN INTEGER
            message.channel.send(`**The specified boi had ${args[0]} points added/subtracted from their account.**`)
        });

    }

    // Balance & Money
    if (msg === `${prefix}BALANCE` || msg === `${prefix}MONEY`) { // This will run if the message is either ~BALANCE or ~MONEY

        // Additional Tip: If you want to make the values guild-unique, simply add + message.guild.id whenever you request.
        economy.fetchBalance(message.author.id + message.guild.id).then((i) => { // economy.fetchBalance grabs the userID, finds it, and puts the data with it into i.
            // Lets use an embed for This
            const embed = new Discord.RichEmbed()
                .setDescription(`**${message.guild.name} Bank**`)
                .setColor(0xD4AF37) // You can set any HEX color if you put 0x before it.
                .addField('The Boi',message.author.username,true) // The TRUE makes the embed inline. Account Holder is the title, and message.author is the value
                .addField('GoodBoyPoints',i.money,true)


            // Now we need to send the message
            message.channel.send({embed})

        })

    }

});

client.login('CHANGE THIS TO YOUR BOT TOKEN')

//COMMANDS:
//they all start with the prefix, ~ by default
//addmoney (amount, can be negative) (person) - if nobody is defined, it gives it to yourself
//balance - shows the moneiz
//money -does the same thing as balance
