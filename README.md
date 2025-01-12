# SimpleRPC
Simple, cross platform Discord RPC server that can be run using npm

## Prerequisites
In order to run this app **you will need to install Node.js and npm.** Node.js can be downloaded from [here](https://nodejs.org/en/download/). Npm is included with Node.js, so you don't need to download it separately.
You will also need a Discord application with a client ID and secret,
and a code editor like Notepad++ or VS Code.

## Setup
To setup and run the RPC server, you need to clone the repo and run the following commands:
- npm install discord-rpc
- npm install dotenv
- npm install discord.js

Before running the server, you need to make a .env file in the discord-rpc-server folder and add the contents of the .env.example file to it. I made sure to add comments to the .env.example file to help you understand what each variable does.

**To get the variables, you will need to create a Discord application and get the client ID and secret.**

This can be done be going to  the [Discord Developer Portal](https://discord.com/developers/applications) and creating a new application. To add media, you need to go to the Rich Presence tab and at the bottom of the page, click on "Add an Image" and upload the images you want to use. Discord has some restrictions that apply to uploading images and those are:

- The image must be a PNG, JPG or JPEG
- The image must be at least 512x512 pixels with the recomended resolution being 1024x1024.


Everything else is documented in the .env.example file :))

## Running the server

To run the server, run the following command: `node index.js` and it should start the server. To see if it works, just check Discord and see if the RPC is showing up. Or in the terminal, it should say RPC connected.

In case of it erroring out, please open an issue featuring the error message and I will try to fix it as soon as possible.

## Contributing

Contributions are welcome and encouraged! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request. Please make sure to follow the existing code style and include tests for any new features or changes.

## Support

If you want to support my work, just star the repo and follow me on GitHub. Im not the type of person who asks for money.