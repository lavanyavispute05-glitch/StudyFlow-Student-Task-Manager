// ==========================
// SIGNUP
// ==========================

const signupForm = document.querySelector("#signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const name = document.querySelector("#name").value.trim();
        const email = document.querySelector("#email").value.trim();
        const password = document.querySelector("#password").value;

        try {

            const response = await fetch(
                "http://localhost:5050/api/signup",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            alert(data.message);

            if (response.ok) {
                window.location.href = "login.html";
            }

        } catch (error) {

            console.error("Signup error:", error);

            alert("Could not connect to the server.");

        }

    });

}


// ==========================
// LOGIN
// ==========================

const loginForm = document.querySelector("#loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email = document.querySelector("#email").value.trim();
        const password = document.querySelector("#password").value;

        try {

            const response = await fetch(
                "http://localhost:5050/api/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            alert(data.message);

            if (response.ok) {

                // Save logged-in user
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                // Go to dashboard
                window.location.href = "index.html";
            }

        } catch (error) {

            console.error("Login error:", error);

            alert("Could not connect to the server.");

        }

    });

}