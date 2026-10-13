function createHeart() {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.innerHTML = "&hearts;";

    const rotation = Math.random() * 360;
    const size = 10 + Math.random() * 55;
    const duration = 12 + Math.random() * 16;

    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = size + "px";
    heart.style.opacity = 0.3 + Math.random() * 0.7;
    heart.style.animationDuration = duration + "s";
    heart.style.transform = `rotate(${rotation}deg)`;

    document.body.appendChild(heart);

    heart.addEventListener("animationend", () => heart.remove());
}

setInterval(createHeart, 300);