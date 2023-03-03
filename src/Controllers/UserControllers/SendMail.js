// const nodemailer = require("nodemailer")

const SENDER_EMAIL = "csfun100@gmail.com"
const PASSWORD = 'wrdyfdpuyprmwolk'


const sendEmail = async(receiver_email,text_to_send) => {

	if (!receiver_email)
		return console.log("No RECEIVER Email");

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SENDER_EMAIL,
      pass: PASSWORD,  
    },
    tls:{
      rejectUnauthorized:false
    }
  });


  const mailOptions = {
	    from: SENDER_EMAIL, 
	    to: receiver_email,
	    subject: "Memoriex Password Reset", 
	    text: "",
	    html: text_to_send, // html body
  }


  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions,(error,info) => {
          if(error)
            return console.log("An Error Occured",error)
          else
            return console.log("Email Sent Successfully")
  });

  console.log("Message sent: %s", info);

} 


module.exports = { sendEmail }

