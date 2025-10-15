function changeGreeting() {
    const greetings = [
        "Hello, World!",
        "Hi there!",
        "Welcome!",
        "Greetings!",
        "Hello again!"
    ];
    const el = document.getElementById("greeting");
    const current = el.innerText;
    let next = greetings[(greetings.indexOf(current) + 1) % greetings.length];
    el.innerText = next;
}