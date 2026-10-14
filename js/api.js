const USERS = {
    a: {
        cid: "amina",
        tid: "niclas"
    },
    n: {
        cid: "niclas",
        tid: "amina"
    },
}

// consts
const API_URL = "http://server.iloveyouamina.xyz:522";

// get current user
const params = new URLSearchParams(window.location.search);
const user = params.get("u");

user_config = USERS[user];
if (!user_config)
{
    user_config = USERS["a"];
}


// MOTD
async function updateMOTD()
{
    try
    {
        const response = await fetch(`${API_URL}/message?client_id=`+user_config.cid);

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
        const response = await fetch(`${API_URL}/ping`, {
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


// MOTD dialog
const dialog = document.getElementById("motd_dialog");
const form = document.getElementById("motd_form");
const input = document.getElementById("motd_input");
const status = document.getElementById("motd_status");
const sendButton = document.getElementById("motd_send");


document.getElementById("motd_edit_button").addEventListener("click", () => {
    status.textContent = "";
    dialog.showModal();
    input.focus();
});

document.getElementById("motd_cancel").addEventListener("click", () => {
    dialog.close();
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = input.value.trim();
    if (!message) return;

    sendButton.disabled = true;
    status.textContent = "Sending...";

    try {
        const response = await fetch(
            `${API_URL}/message`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    client_id: user_config.tid,
                    message: message
                })
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        status.textContent = "Message sent successfully! ♡";
        input.value = "";

        // Close the dialog after a successful request.
        dialog.close();

        // Optional: refresh the displayed MOTD here.
    } catch (error) {
        console.error("Failed to send MOTD:", error);
        status.textContent = "Failed to send message. Please try again.";
    } finally {
        sendButton.disabled = false;
    }
});


// function calls
updateMOTD();
setInterval(updateMOTD, 60000);
