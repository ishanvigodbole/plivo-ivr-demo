require("dotenv").config();
console.log(process.env);
const express= require("express");
const bodyParser= require("body-parser");
const plivo=require("plivo");
const NGROK_URL = "https://resurface-gullible-handwork.ngrok-free.dev";
const app=express();
app.use(bodyParser.urlencoded({extended: false}));
app.get("/", (req, res) => {
    res.send("Server is working");
});

const OTP = process.env.OTP;
const AUTH_ID = process.env.AUTH_ID;
const AUTH_TOKEN = process.env.AUTH_TOKEN;
const PLIVO_NUMBER = process.env.PLIVO_NUMBER;
const MY_NUMBER = process.env.MY_NUMBER;
const CORRECT_OTP = process.env.OTP;
const ASSOCIATE_NUMBER = process.env.ASSOCIATE_NUMBER;
const client=new plivo.Client(AUTH_ID,AUTH_TOKEN);
app.get("/make-call", async(req,res)=>{
    try{
        const response=await client.calls.create(
            PLIVO_NUMBER,
            MY_NUMBER,
            "https://resurface-gullible-handwork.ngrok-free.dev/answer"

        );
        res.send("Call Started");

    }catch(err){
        console.log(err);
        res.send("error while making call")
    }
});

app.post("/answer", (req, res) => {

    const xml = `
<Response>

<GetInput
action="https://resurface-gullible-handwork.ngrok-free.dev/check-otp"
method="POST"
inputType="dtmf"
numDigits="4">

    <Speak>
        Please enter your 4 digit OTP.
    </Speak>

</GetInput>

<Speak>
    No input received. Goodbye.
</Speak>

</Response>
`;

    res.set("Content-Type", "text/xml");
    res.send(xml);
});


app.post("/check-otp", (req, res) => {

    const enteredOtp = req.body.Digits;

    let xml = "";

    if (enteredOtp === OTP) {

        xml = `
<Response>

<GetInput
action="https://resurface-gullible-handwork.ngrok-free.dev/language"
method="POST"
inputType="dtmf"
numDigits="1">

    <Speak>
        Authentication successful.
        Press 1 for English.
        Press 2 for Spanish.
    </Speak>

</GetInput>

</Response>
`;

    }

    else {

        xml = `
<Response>

<GetInput
action="https://resurface-gullible-handwork.ngrok-free.dev/check-otp"
method="POST"
inputType="dtmf"
numDigits="4">

    <Speak>
        Wrong OTP.
        Please try again.
    </Speak>

</GetInput>

</Response>
`;
    }

    res.set("Content-Type", "text/xml");
    res.send(xml);
});


app.post("/language", (req, res) => {

    const digit = req.body.Digits;

    let xml = "";


    if (digit === "1") {

        xml = `
<Response>

<GetInput
action="https://resurface-gullible-handwork.ngrok-free.dev/english-menu"
method="POST"
inputType="dtmf"
numDigits="1">

    <Speak>
        English selected.
        Press 1 to play audio.
        Press 2 to connect to associate.
    </Speak>

</GetInput>

</Response>
`;
    }


    else if (digit === "2") {

        xml = `
<Response>

<GetInput
action="https://resurface-gullible-handwork.ngrok-free.dev/spanish-menu"
method="POST"
inputType="dtmf"
numDigits="1">

    <Speak>
        Spanish selected.
        Press 1 to play audio.
        Press 2 to connect to associate.
    </Speak>

</GetInput>

</Response>
`;
    }



    else {

        xml = `
<Response>

<Speak>
    Invalid input.
</Speak>

<Redirect method="POST">
    /language
</Redirect>

</Response>
`;
    }

    res.set("Content-Type", "text/xml");
    res.send(xml);
});


app.post("/english-menu", (req, res) => {

    const digit = req.body.Digits;

    let xml = "";


    if (digit === "1") {

        xml = `
<Response>

<Speak>
    Playing audio now.
</Speak>

<Play>
https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3
</Play>

</Response>
`;
    }

    else if (digit === "2") {

        xml = `
<Response>

<Speak>
    Connecting to associate.
</Speak>

<Dial>
${ASSOCIATE_NUMBER}
</Dial>

</Response>
`;
    }

    else {

        xml = `
<Response>

<Speak>
    Invalid option.
</Speak>

</Response>
`;
    }

    res.set("Content-Type", "text/xml");
    res.send(xml);
});

app.post("/spanish-menu", (req, res) => {

    const digit = req.body.Digits;

    let xml = "";

    // PLAY AUDIO

    if (digit === "1") {

        xml = `
<Response>

<Speak>
    Reproduciendo audio.
</Speak>

<Play>
https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3
</Play>

</Response>
`;
    }

    // CONNECT CALL

    else if (digit === "2") {

        xml = `
<Response>

<Speak>
    Conectando con asociado.
</Speak>

<Dial>
${ASSOCIATE_NUMBER}
</Dial>

</Response>
`;
    }


    else {

        xml = `
<Response>

<Speak>
    Entrada invalida.
</Speak>

</Response>
`;
    }

    res.set("Content-Type", "text/xml");
    res.send(xml);
});


app.listen(3000, () => {

    console.log("Server running on port 3000");
});