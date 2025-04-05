const loginForm = document.getElementById('loginForm');
const email = document.getElementById('email');
const password = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const showPasswordBtn = document.getElementById('show-pwd');
const loadingOverlay = document.getElementById('loadingOverlay');
const submitButton = document.querySelector('#loginForm button[type="submit"]');
const rememberCheckbox = document.getElementById('rememberCheckbox');

// ********************** Validate Email with Regex **********************
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

email.addEventListener('input', () => {
    const isEmailValid = validateEmail(email.value);
    if (!isEmailValid) {
        email.style.borderColor = 'red';
        emailError.textContent = 'Invalid email address.';
    } else {
        email.style.borderColor = 'green';
        email.classList.add('input-success');
        setTimeout(() => email.classList.remove('input-success'), 800);
        emailError.textContent = '';
    }
});

// Check if user has a saved email in localStorage
window.addEventListener('DOMContentLoaded', () => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
        email.value = savedEmail;
        rememberCheckbox.checked = true;
        // Trigger validation UI update
        email.dispatchEvent(new Event('input'));
    }
});

// Simplified password visibility toggle
showPasswordBtn.addEventListener('click', () => {
    if (password.type === 'password') {
        password.type = 'text';
        showPasswordBtn.src = '/assets/icons/hidden_password.svg';
        showPasswordBtn.style.filter = "brightness(0)";
    } else {
        password.type = 'password';
        showPasswordBtn.src = '/assets/icons/shown_password.svg';
        showPasswordBtn.style.filter = "brightness(0)";
    }
});

// Keep the mousedown handler simple as well
showPasswordBtn.addEventListener('mousedown', (e) => {
    e.preventDefault();
});

// Clear error messages
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
}

// Add a status message element for form-wide errors
const addStatusMessage = () => {
    if (!document.getElementById('statusMessage')) {
        const statusMessage = document.createElement('div');
        statusMessage.id = 'statusMessage';
        statusMessage.className = 'status-message';
        
        // Insert before the loading overlay
        loginForm.insertBefore(statusMessage, document.getElementById('loadingOverlay'));
    }
    return document.getElementById('statusMessage');
};

// Function to show status messages (errors or success)
const showStatusMessage = (message, type = 'error') => {
    const statusMessage = addStatusMessage();
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.display = 'block';
    
    // Shake the message if it's an error
    if (type === 'error') {
        shakeElement(statusMessage);
    }
};

// Clear status message
const clearStatusMessage = () => {
    const statusMessage = document.getElementById('statusMessage');
    if (statusMessage) {
        statusMessage.style.display = 'none';
        statusMessage.textContent = '';
    }
};

// Handle reCAPTCHA callback
window.recaptchaSuccess = (token) => {
    document.getElementById('recaptchaError').textContent = '';
    // Store the token if needed
    window.recaptchaToken = token;
};

// Add a "shake" effect for validation errors
function shakeElement(element) {
    element.style.animation = 'none';
    setTimeout(() => {
        element.style.animation = 'shake 0.5s ease';
    }, 10);
}

// Improve form accessibility
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');
    });
});

// ********************** Submit Form **********************
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Clear previous errors
    clearErrors();
    clearStatusMessage();

    // ********************** Client Validation **********************
    const emailValid = validateEmail(email.value);
    let hasError = false;

    if (!emailValid) {
        emailError.textContent = 'Invalid email address.';
        email.style.borderColor = 'red';
        shakeElement(email);
        hasError = true;
    }

    if (!password.value) {
        passwordError.textContent = 'Please enter your password.';
        password.style.borderColor = 'red';
        shakeElement(password);
        hasError = true;
    }
    
    const recaptchaToken = grecaptcha.getResponse();
    
    if (!recaptchaToken) {
        document.getElementById('recaptchaError').textContent = 'Please complete the security check.';
        shakeElement(document.getElementById('recaptchaError'));
        hasError = true;
    }

    if (hasError) return;

    // Save email to localStorage if remember me is checked
    if (rememberCheckbox.checked) {
        localStorage.setItem('rememberedEmail', email.value);
    } else {
        localStorage.removeItem('rememberedEmail');
    }

    // Show loading overlay
    loadingOverlay.classList.add('active');
    loginForm.classList.add('form-disabled');
    submitButton.disabled = true;

    try {
        const response = await fetch('http://127.0.0.1:5001/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email.value.toLowerCase(),
                password: password.value,
                recaptchaToken
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Store auth token
            if (data.token) {
                localStorage.setItem('authToken', data.token);
            }
            
            // Redirect to dashboard or homepage
            window.location.href = 'dashboard.html';
        } else {
            // Handle login errors
            if (data.errorType === 'email_verification_required') {
                // Redirect to email verification page
                window.location.href = `otp-verify.html?email=${encodeURIComponent(email.value)}`;
            } else {
                // Handle other errors (invalid credentials, etc.)
                passwordError.textContent = data.message || 'Invalid email or password.';
                password.style.borderColor = 'red';
                shakeElement(password);
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        showStatusMessage('Connection error. Please try again.');
    } finally {
        loadingOverlay.classList.remove('active');
        loginForm.classList.remove('form-disabled');
        submitButton.disabled = false;
    }
});
