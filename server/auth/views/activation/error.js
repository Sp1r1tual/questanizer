const activationErrorHTML = (loginUrl) => `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>Activation Error</title>
        <style>
            body {
                font-family: "Georgia", serif;
                background-color: #f7f1ee;
                margin: 0;
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .contentForm {
                background-color: #f7f1ee;
                padding: 1.5rem;
                border-radius: 0.75rem;
                box-shadow: 0 0 15px rgba(80, 50, 40, 0.2);
                width: 320px;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .formTitle {
                font-size: 1.5rem;
                color: #4d2c20;
                margin-bottom: 1rem;
                text-align: center;
            }
            .error {
                color: darkred;
                font-size: 0.875rem;
                font-weight: bold;
                margin-bottom: 1rem;
                text-align: center;
            }
            .btn {
                padding: 0.5rem 1rem;
                background-color: #7d5032;
                color: white;
                border: none;
                border-radius: 0.4rem;
                font-weight: bold;
                font-size: 0.875rem;
                cursor: pointer;
                text-decoration: none;
                transition: background-color 0.2s ease;
            }
            .btn:hover {
                background-color: #5e3e28;
            }
        </style>
    </head>
    <body>
        <div class="contentForm">
            <h1 class="formTitle">Activation error</h1>
            <p class="error">${errorMessage}</p>
            <a href="${loginUrl}" class="btn">Return to login</a>
        </div>
        <script>
            setTimeout(() => {
                window.location.href = "${loginUrl}";
            }, 3000);
        </script>
    </body>
</html>
`;

export default activationErrorHTML;
