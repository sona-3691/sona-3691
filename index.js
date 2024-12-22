// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult,onAuthStateChanged  } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCT-icVxSyU4ZXoL4ZPZFuedy-KBitHrMQ",
    authDomain: "pharmacy-9cb91.firebaseapp.com",
    databaseURL: "https://pharmacy-9cb91-default-rtdb.firebaseio.com",
    projectId: "pharmacy-9cb91",
    storageBucket: "pharmacy-9cb91.appspot.com",
    messagingSenderId: "306900926645",
    appId: "1:306900926645:web:313a8409964ef2119afefc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// UI Elements
const authForm = document.getElementById("authForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const toggleForm = document.getElementById("toggleForm");
const formTitle = document.getElementById("form-title");
const authButton = document.getElementById("authButton");
const googleSignInButton = document.getElementById("googleSignInButton");

let isSignUp = true;

// Toggle between Sign-Up and Login
toggleForm.addEventListener("click", () => {
    isSignUp = !isSignUp;
    formTitle.textContent = isSignUp ? "Sign-Up" : "Login";
    authButton.textContent = isSignUp ? "Sign Up" : "Login";
    toggleForm.textContent = isSignUp
        ? "Already have an account? Login here"
        : "Don't have an account? Sign Up here";
});

// Handle Sign-Up and Login
authForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    try {
        if (isSignUp) {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            alert("Sign-Up Successful! You can now log in.");
            console.log("User Signed Up:", userCredential.user);
        } else {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            alert("Login Successful! Welcome back.");
            console.log("User Logged In:", userCredential.user);
            window.location.href = "Home.html"; // Redirect to homepage or dashboard
        }
    } catch (error) {
        alert(error.message);
        console.error("Authentication Error:", error.message);
    }
});

// Handling Google Sign-In with Popup for Desktop and Redirect for Mobile
googleSignInButton.addEventListener("click", async () => {
    try {
        googleSignInButton.disabled = true; // Disable button during sign-in

        const isMobile = /Mobi|Android/i.test(navigator.userAgent);

        if (isMobile) {
            // Use Redirect for Mobile
            signInWithRedirect(auth, googleProvider);  // No await here
        } else {
            // Use Popup for Desktop
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            console.log("Sign-In Result (Popup):", result);
            console.log("User Details (Popup):", user);

            alert(`Welcome, ${user.displayName || "User"}!`);
            window.location.href = "Home.html"; // Redirect to homepage or dashboard
        }
    } catch (error) {
        alert("An error occurred during sign-in. Please try again.");
        console.error("Google Sign-In Error:", error.message);
    } finally {
        googleSignInButton.disabled = false; // Re-enable button
    }
});

// Handle Redirect Sign-In Result (necessary for signInWithRedirect)
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            // Check for redirect result only when user is logged in
            const result = await getRedirectResult(auth);
            if (result) {
                console.log("Sign-In Result (Redirect):", result);
                alert(`Welcome, ${user.displayName || "User"}!`);
                window.location.href = "Home.html"; // Redirect to homepage or dashboard
            }
        } catch (error) {
            console.error("Redirect Sign-In Error:", error.message);
        }
    }
});
