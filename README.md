# My Extension GoPass

Welcome to **My Extension GoPass**! This is a ReactJS application designed to show the information and the gopass service. Follow the instructions below to get started with the project.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Settings](#settings)
- [Running the Project](#running-the-project)
- [Deployment](#deployment)

## Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://classic.yarnpkg.com/)
- [git](https://git-scm.com/)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/alex-go-nguyen/jerry-demo1-extension
    ```

2. Navigate into the project directory:

    ```bash
    cd jerry-demo-1-fe
    ```

3. Install the project dependencies:

    Using npm:

    ```bash
    npm install
    ```

    Or using Yarn:

    ```bash
    yarn install
    ```

## Settings

At the root of the project, create a .env file and add the following environment variables
```
VITE_CLIENT_URL=
VITE_API_URL=
VITE_API_URL_REFRESH_TOKEN=
VITE_ENCRYPTION_KEY=
VITE_ENCRYPTION_IV=
VITE_SENTRY_URL =

```

## Running the Project

To start the development server and run the project locally, use the following command:

Using npm:

```bash
npm run dev
```

## Add extension to chrome

Using npm:

```bash
npm run build
```

After building, you can load the build folder into Chrome by going to [chrome://extensions/](chrome://extensions), enabling Developer Mode, and then using the Load Unpacked option