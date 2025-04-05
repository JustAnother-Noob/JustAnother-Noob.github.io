const signupForm = document.getElementById('signupForm');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const confirmError = document.getElementById('confirmError');
const firstNameError = document.getElementById('firstNameError');
const lastNameError = document.getElementById('lastNameError');
const termscheckbox = document.getElementById('t&cCheckbox');
const termsError = document.getElementById('t&cError');
const showPasswordBtn = document.getElementById('show-pwd');
const showConfirmPasswordBtn = document.getElementById('show-confirm-pwd');
const loadingOverlay = document.getElementById('loadingOverlay');
const submitButton = document.querySelector('#signupForm button[type="submit"]');

// ********************** Validate Name Fields **********************
const validateName = (name) => {
    return name.trim().length >= 2;
};

firstName.addEventListener('input', () => {
    if (!validateName(firstName.value)) {
        firstName.style.borderColor = 'red';
        firstNameError.textContent = 'First name must be at least 2 characters.';
    } else {
        firstName.style.borderColor = 'green';
        firstNameError.textContent = '';
    }
});

lastName.addEventListener('input', () => {
    if (!validateName(lastName.value)) {
        lastName.style.borderColor = 'red';
        lastNameError.textContent = 'Last name must be at least 2 characters.';
    } else {
        lastName.style.borderColor = 'green';
        lastNameError.textContent = '';
    }
});

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

// ********************** Validate Password with Regex **********************
const validatePassword = (password) => {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };
    return requirements;
};

password.addEventListener('focus', () => {
    document.getElementById('passwordRules').classList.add('visible');
});

password.addEventListener('blur', () => {
    if (!password.value) {
        document.getElementById('passwordRules').classList.remove('visible');
    }
});

password.addEventListener('input', () => {
    const requirements = validatePassword(password.value);
    const isPasswordValid = Object.values(requirements).every(Boolean);

    // Update requirement indicators with animation
    Object.keys(requirements).forEach((requirement) => {
        const element = document.getElementById(requirement);
        const wasValid = element.classList.contains('valid');
        
        // Clear classes
        element.className = '';
        
        // Add new class
        if (requirements[requirement]) {
            element.classList.add('valid');
            // Play micro-animation only when status changes from invalid to valid
            if (!wasValid) {
                element.style.transition = 'all 0.3s ease';
                element.style.transform = 'translateX(8px)';
                setTimeout(() => {
                    element.style.transform = 'translateX(4px)';
                }, 200);
            }
        } else {
            element.classList.add('invalid');
        }
    });

    // Update validation UI
    if (!isPasswordValid) {
        password.style.borderColor = 'red';
        passwordError.textContent = 'Password does not meet all requirements';
    } else {
        password.style.borderColor = 'green';
        password.classList.add('input-success');
        setTimeout(() => password.classList.remove('input-success'), 800);
        passwordError.textContent = '';
    }
});

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

showPasswordBtn.addEventListener('mousedown', (e) => {
    e.preventDefault(); // Prevent button from stealing focus
});

confirmPassword.addEventListener('input', () => {
    if (password.value !== confirmPassword.value) {
        confirmPassword.style.borderColor = 'red';
        confirmError.textContent = 'Passwords do not match.';
    } else {
        confirmPassword.style.borderColor = 'green';
        confirmError.textContent = '';
    }
});

showConfirmPasswordBtn.addEventListener('click', () => {
    if (confirmPassword.type === 'password') {
        confirmPassword.type = 'text';
        showConfirmPasswordBtn.src = '/assets/icons/hidden_password.svg';
        showConfirmPasswordBtn.style.filter = "brightness(0)";
    } else {
        confirmPassword.type = 'password';
        showConfirmPasswordBtn.src = '/assets/icons/shown_password.svg';
        showConfirmPasswordBtn.style.filter = "brightness(0)";
    }
});

showConfirmPasswordBtn.addEventListener('mousedown', (e) => {
    e.preventDefault(); // Prevent button from stealing focus
});

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
}

window.recaptchaSuccess = (token) => {
    recaptchaVerified = true;
    document.getElementById('recaptchaError').textContent = '';
    // Store the token if needed
    window.recaptchaToken = token;
};

// Improve form accessibility
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');
    });
});

// Add a "shake" effect for validation errors on submit
function shakeElement(element) {
    element.style.animation = 'none';
    setTimeout(() => {
        element.style.animation = 'shake 0.5s ease';
    }, 10);
}

// Add this CSS for the shake animation to your head section
document.head.insertAdjacentHTML('beforeend', `
<style>
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-5px); }
    40%, 80% { transform: translateX(5px); }
}
</style>
`);

// Add status message functions similar to login page
const addStatusMessage = () => {
    if (!document.getElementById('statusMessage')) {
        const statusMessage = document.createElement('div');
        statusMessage.id = 'statusMessage';
        statusMessage.className = 'status-message';
        
        // Insert before the loading overlay
        signupForm.insertBefore(statusMessage, document.getElementById('loadingOverlay'));
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

// ********************** Submit Form **********************
signupForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Clear previous errors
    clearErrors();
    clearStatusMessage();

    // ********************** Client Validation **********************
    const firstNameValid = validateName(firstName.value);
    const lastNameValid = validateName(lastName.value);
    const emailValid = validateEmail(email.value);
    const passwordRequirements = validatePassword(password.value);
    const passwordsMatch = password.value === confirmPassword.value;
    const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

    let hasError = false;

    if (!firstNameValid) {
        document.getElementById('firstNameError').textContent = 'Please enter a valid first name.';
        firstName.style.borderColor = 'red';
        shakeElement(firstName);
        hasError = true;
    }

    if (!lastNameValid) {
        document.getElementById('lastNameError').textContent = 'Please enter a valid last name.';
        lastName.style.borderColor = 'red';
        shakeElement(lastName);
        hasError = true;
    }

    if (!emailValid) {
        document.getElementById('emailError').textContent = 'Invalid email address.';
        email.style.borderColor = 'red';
        shakeElement(email);
        hasError = true;
    }

    if (!isPasswordValid) {
        document.getElementById('passwordError').textContent = 'Password does not meet requirements';
        password.style.borderColor = 'red';
        shakeElement(password);
        hasError = true;
    }

    if (!passwordsMatch) {
        document.getElementById('confirmError').textContent = 'Passwords do not match';
        confirmPassword.style.borderColor = 'red';
        shakeElement(confirmPassword);
        hasError = true;
    }

    if (!termscheckbox.checked) {
        document.getElementById('t&cError').textContent = 'You must agree to the terms and conditions';
        shakeElement(termscheckbox);
        hasError = true;
    } else {
        document.getElementById('t&cError').textContent = '';
    }
    
    const recaptchaToken = grecaptcha.getResponse();
    
    if (!recaptchaToken) {
        document.getElementById('recaptchaError').textContent = 'Please complete the security check.';
        shakeElement(document.getElementById('recaptchaError'));
        hasError = true;
    }

    if (hasError) return;

    loadingOverlay.classList.add('active');
    signupForm.classList.add('form-disabled');
    submitButton.disabled = true;

    try {
        const response = await fetch('http://127.0.0.1:5001/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: firstName.value.trim(),
                lastName: lastName.value.trim(),
                email: email.value.toLowerCase(),
                password: password.value,
                recaptchaToken
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Show success message before redirecting
            showStatusMessage('Account created successfully! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = `otp-verify.html?email=${encodeURIComponent(email.value)}`;
            }, 1500);
        } else {
            // Show error message from server
            showStatusMessage(data.message || 'Sign-up failed');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showStatusMessage('Connection error. Please try again.');
    } finally {
        loadingOverlay.classList.remove('active');
        signupForm.classList.remove('form-disabled');
        submitButton.disabled = false;
    }
});
