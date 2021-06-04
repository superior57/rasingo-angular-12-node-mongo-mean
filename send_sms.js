

// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = "AC098ab6b0efee5a2bdb869eb10cdbd3bd";
const authToken = "29b491d2995ccbd3309844a613b44e82";
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'Prijevoznik čeka na Vaš odgovor!',
     from: '+16179413428',
     to: '+3850981804842'
   })
  .then(message => console.log(message.sid));
