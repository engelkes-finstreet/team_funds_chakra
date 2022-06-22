import express from "express";
import { confirmMail } from "./confirm";
import { confirmPasswordReset } from "./confirm-password-reset";
import { requestResetPassword } from "./request-reset-password";

const port = 3001;
const app = express();

app.get("/confirm", (req, res) => {
  res.send(
    confirmMail({ confirmLink: "http://localhost:3000/this/is/just/a/test" })
  );
});

app.get("/confirm-password-reset", (req, res) => {
  res.send(
    confirmPasswordReset({
      name: "Patrick",
      loginLink: "http://localhost:3000/this/is/just/a/test",
    })
  );
});

app.get("/request-reset-password", (req, res) => {
  res.send(
    requestResetPassword({
      name: "Patrick",
      requestResetPasswordLink: "http://localhost:3000/this/is/just/a/test",
    })
  );
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
