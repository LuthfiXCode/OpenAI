const { BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType } = require('@adiwajshing/baileys')
const fs = require('fs')
const util = require('util')
const delay = require('delay');
const chalk = require('chalk')
const { Configuration, OpenAIApi } = require("openai")
let setting = require('./key.json')
const axios = require('axios');
const cheerio = require('cheerio');
const sendMessageUrl = 'https://web.whatsapp.com/send';
async function sendMessage(phoneNumber, message) {
  try {
    const response = await axios.post(sendMessageUrl, {
      phone: phoneNumber,  // nomor tujuan
      body: message,  // pesan yang akan dikirim
    });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}
//Script Anti spam Dengan kata Yg sama
//made by Maslent 
// fungsi untuk mengecek pesan spam
async function checkForSpam(phoneNumber) {
  // dapatkan riwayat pesan dari WhatsApp Web
  const response = await axios.get(`https://web.whatsapp.com/pp?t=l&phone=${phoneNumber}`);
  const html = response.data;

  // gunakan cheerio kalo ada cherio apa lah gitu di terminal lu Ketik ae npm install cher bla bla
  const $ = cheerio.load(html);
  const messages = [];
  // dapatkan semua pesan dari riwayat
  $('.message-text').each((i, element) => {
    messages.push($(element).text().trim());
  });
  // hitung jumlah pesan yang sama dalam waktu terakhir
  let spamCount = 0;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i] === messages[messages.length - 1]) {
      spamCount += 1;
    } else {
      break;
    }
  }
  // jika pesan spam terdeteksi, kirim pesan dan beri jeda selama 1 jam
  if (spamCount >= 3) {
    sendMessage(phoneNumber, 'Spam terdeteksi. Kamu akan saya beri jeda selama 1 jam.');
    setTimeout(() => {}, 3600000);  // jeda selama 1 jam
  }
}

module.exports = maslent = async (client, m, chatUpdate, store) => {
    try {
        var body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ''
        var budy = (typeof m.text == 'string' ? m.text : '')
        // var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/"
        var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/"
        const isCmd2 = body.startsWith(prefix)
        const command = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
        const args = body.trim().split(/ +/).slice(1)
        const pushname = m.pushName || "No Name"
        const botNumber = await client.decodeJid(client.user.id)
        const itsMe = m.sender == botNumber ? true : false
        let text = q = args.join(" ")
        const arg = budy.trim().substring(budy.indexOf(' ') + 1 )
        const arg1 = arg.trim().substring(arg.indexOf(' ') + 1 )

        const from = m.chat
        const reply = m.reply
        const sender = m.sender
        const mek = chatUpdate.messages[0]

        const color = (text, color) => {
            return !color ? chalk.green(text) : chalk.keyword(color)(text)
        }
	
        // Group
        const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat).catch(e => {}) : ''
        const groupName = m.isGroup ? groupMetadata.subject : ''

        // Push Message To Console
        let argsLog = (budy.length > 30) ? `${q.substring(0, 30)}...` : budy

        if (setting.autoAI) {
            // Push Message To Console && Auto Read
            if (argsLog && !m.isGroup) {
            // client.sendReadReceipt(m.chat, m.sender, [m.key.id])
            console.log(chalk.red(chalk.bgBlack('< SYSTEM >')), color(argsLog, 'turquoise'), chalk.magenta('From'), chalk.green(pushname), chalk.yellow(`[???? ]`))
            } else if (argsLog && m.isGroup) {
            
            console.log(chalk.red(chalk.bgBlack('< SYSTEM >')), color(argsLog, 'turquoise'), chalk.magenta('From'), chalk.green(pushname), chalk.yellow(`[????]`), chalk.blueBright('IN'), chalk.green(groupName))
            }
        } else if (!setting.autoAI) {
            if (isCmd2 && !m.isGroup) {
                console.log(chalk.red(chalk.bgBlack('< SYSTEM >')), color(argsLog, 'turquoise'), chalk.magenta('From'), chalk.green(pushname), chalk.yellow(`[????]`))
                } else if (isCmd2 && m.isGroup) {
                console.log(chalk.red(chalk.bgBlack('< SYSTEM >')), color(argsLog, 'turquoise'), chalk.magenta('From'), chalk.green(pushname), chalk.yellow(`[????]`), chalk.blueBright('IN'), chalk.green(groupName))
                }
        }

    if (setting.autoAI) {
        if (budy) {
            try {
            const configuration = new Configuration({
              apiKey: setting.lent, 
            });
            const openai = new OpenAIApi(configuration);
            
            const response = await openai.createCompletion({
              model: "text-davinci-002",
              prompt: budy,
              temperature: 0.2,
              max_tokens: 3000,
              top_p: 1.0,
              frequency_penalty: 0.0,
              presence_penalty: 0.0,
            });
            m.reply(`${response.data.choices[0].text}\n\n`)
            } catch(err) {
                console.log(err)
                m.reply('Sc Mu Eror Coba Periksa lagi')
            }
        }
    }

    if (!setting.autoAI) {
        if (isCmd2) {
            switch(command) { 

                default:{
                
                    if (isCmd2 && budy.toLowerCase() != undefined) {
                        if (m.chat.endsWith('broadcast')) return
                        if (m.isBaileys) return
                        if (!(budy.toLowerCase())) return
                        if (argsLog || isCmd2 && !m.isGroup) {
                            // client.sendReadReceipt(m.chat, m.sender, [m.key.id])
                            console.log(chalk.red(chalk.bgRed('[ ERROR ]')), color('command', 'turquoise'), color(argsLog, 'turquoise'), color('tidak tersedia', 'turquoise'))
                            } else if (argsLog || isCmd2 && m.isGroup) {
                            // client.sendReadReceipt(m.chat, m.sender, [m.key.id])
                            console.log(chalk.red(chalk.bgRed('[ ERROR ]')), color('command', 'turquoise'), color(argsLog, 'turquoise'), color('tidak tersedia', 'turquoise'))
                            }
                    }
                }
            }
        }
    }
        
    } catch (err) {
        m.reply(util.format(err))
    }
}


let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})
