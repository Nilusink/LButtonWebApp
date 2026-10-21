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
const button = document.getElementById("btn");
button.addEventListener("click", async () => {
    // visual feedback for everyone
    button.classList.add("clicked");
    setTimeout(() => button.classList.remove("clicked"), 700);

    // let the browser render the change
    await new Promise(resolve => requestAnimationFrame(resolve));

    // haptic feedback
    if ("vibrate" in navigator)
    {
        // vibrate I love you
        navigator.vibrate([80, 100, 300, 100, 100]);
    }

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


// status icon
function formatTime(seconds) {
    if (seconds < 60) return `${Math.floor(seconds)}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
}

async function updateStatus()
{
    // show status of other device
    try
    {
        const response = await fetch(`${API_URL}/status?client_id=`+user_config.tid);

        if (!response.ok)
        {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        document.getElementById("last_seen_tooltip").textContent = "last seen: " + formatTime(data.result);
        if (data.result < 10)
        {   // now
            document.getElementById("status_box").style.backgroundColor = "green";
            document.getElementById("last_seen_tooltip").textContent = "last seen: now";
        }
        else if (data.result < 300)
        {   // recently
            document.getElementById("status_box").style.backgroundColor = "#ff7700";
        }
        else
        {   // offline
            document.getElementById("status_box").style.backgroundColor = "red";
        }
    }
    catch (error)
    {
        console.error("Failed to load status:", error);
        document.getElementById("status_box").style.backgroundColor = "gray";
        document.getElementById("last_seen_tooltip").textContent = "api unreachable";
    }  
}

// function calls
updateMOTD();
updateStatus();
setInterval(updateMOTD, 60000);
setInterval(updateStatus, 1000);
