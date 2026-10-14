const users = {
    a: {
        cid: "amina",
        tid: "niclas"
    },
    n: {
        cid: "niclas",
        tid: "amina"
    },
}

const params = new URLSearchParams(window.location.search);
const user = params.get("u");
user_config = users[user];
if (!user_config)
{
    user_config = users["a"];
}


// MOTD
async function updateMOTD()
{
    try
    {
        const response = await fetch("http://server.iloveyouamina.xyz:522/message?client_id="+user_config.cid);

        if (!response.ok)
        {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log("motd: ", data);
        document.getElementById("motd").textContent = data.result;
    }
    catch (error)
    {
        console.error("Failed to load MOTD:", error);
        document.getElementById("motd").textContent = "Failed to load message.";
    }
}


// button click
document.getElementById("btn").addEventListener("click", async () => {
    try
    {
        const response = await fetch("http://server.iloveyouamina.xyz:522/ping", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                client_id: user_config.tid,
            })
        });

        const data = await response.json();
        console.log("Response:", data);
    }
    catch (error)
    {
        console.error("POST failed:", error);
    }
});


updateMOTD();
setInterval(updateMOTD, 60000);
