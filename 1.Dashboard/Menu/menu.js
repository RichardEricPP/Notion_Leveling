export function startCountdown(initialTime = 60) {
    const countdownElement = document.getElementById('countdown');
    const warningMessageElement = document.getElementById('warning-message');

    let timeLeft = initialTime;

    function updateCountdown() {
        if (countdownElement) {
            countdownElement.textContent = `Tiempo restante: ${timeLeft} segundos`;
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if (warningMessageElement) {
                warningMessageElement.textContent = '¡Tiempo agotado! ¡Advertencia!';
                warningMessageElement.style.display = 'block';
            }
        } else {
            timeLeft--;
        }
    }

    // Initial call to display countdown immediately
    updateCountdown();

    // Update countdown every second
    const timerInterval = setInterval(updateCountdown, 1000);

    // Hide warning message initially
    if (warningMessageElement) {
        warningMessageElement.style.display = 'none';
    }
}