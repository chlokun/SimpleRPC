# SimpleRPC

A feature-rich Discord Rich Presence client with a Terminal User Interface (TUI).

![SimpleRPC Demo](https://via.placeholder.com/800x400?text=SimpleRPC+Demo)

## Features

- 🖥️ **Modern Terminal UI** - Intuitive, keyboard-navigable interface
- ⚡ **Live Updates** - Real-time display of your Discord presence
- 🔄 **Easy Configuration** - Visual editor for all settings
- 🧙‍♂️ **Setup Wizard** - Guided setup for first-time users
- 📊 **Status Dashboard** - Monitor connection status and activity
- 📝 **Live Logs** - View application events in real-time

## Installation

### Global Installation (Recommended)

```bash
# Install globally
npm install -g simplerpc

# Run the application
rpc
```

### Local Installation

```bash
# Clone the repository
git clone https://github.com/chlokun/SimpleRPC.git
cd SimpleRPC

# Install dependencies
npm install

# Run the application
npm start
```

## Usage

```bash
# Start SimpleRPC
rpc

# Run setup wizard
rpc --setup

# Reset configuration
rpc --reset

# Show help
rpc --help
```

## Configuration

SimpleRPC uses environment variables stored in a `.env` file for configuration. You can edit this file directly or use the built-in configuration editor.

### Required Configuration

- `CLIENT_ID` - Your Discord application client ID

### Optional Configuration

- `DETAILS` - First line of your presence
- `STATE` - Second line of your presence
- `ACTIVITY_TYPE` - Type of activity (0=Playing, 1=Streaming, 2=Listening, 3=Watching, 5=Competing)
- `LARGE_IMAGE_KEY` - Key for the large image
- `LARGE_IMAGE_TEXT` - Text shown when hovering over the large image
- `SMALL_IMAGE_KEY` - Key for the small image
- `SMALL_IMAGE_TEXT` - Text shown when hovering over the small image
- `BUTTON_LABEL` - Label for the first button
- `BUTTON_URL` - URL for the first button
- `BUTTON2_LABEL` - Label for the second button
- `BUTTON2_URL` - URL for the second button

## Creating a Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Rich Presence" tab
4. Upload images in the "Rich Presence Assets" section
5. Copy the "Client ID" from the General Information tab

## Keyboard Controls

- `1` or `D` - Go to Dashboard
- `2` or `C` - Go to Configuration
- `3` or `L` - Go to Logs
- `Ctrl+Q` - Quit the application

## License

[ISC License](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.