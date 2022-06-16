# Welcome to Team Funds!

## Development

To run your Remix app locally, make sure your project's local dependencies are installed:

```sh
npm install
```

We need to set some environment variables to get the app up and running. You can copy the .env.example file to .env and 
start to fill in the variables:


### Database
* DATABASE_URL -> get your connection string from Planetscale

### Mailing
For development get your credentials from mailtrap with your Google Account. For Production use Mailersend
* SMTP_HOST
* SMTP_PORT
* SMTP_USER
* SMTP_PASS

* MAIL_FROM -> In dev mode you can choose anything you want here

### Authentication
SESSION_SECRET -> Again choose anything you want. We do not have to secure our dev environment

Afterwards, start the Remix development server like so:

```sh
npm run dev
```

Open up [http://localhost:3000](http://localhost:3000) and you should be ready to go!
