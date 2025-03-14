﻿# Foolhudhigu Handi Analytics

This NodeJS program is designed to quickly send a large number of requests to a list of provided links in order to improve website analytics. 

## Getting Started

1. Clone the repository to your local machine.
2. Run npm i to install all the packages.
3. Copy the `config.example.json` file and rename it to `config.json`.
4. Edit the `config.json` file to specify the number of sessions to use, the amount of time to wait between requests, and the list of links to send requests to. 
5. Run the program with `npm start`.

## Configuration

The `config.json` file includes the following properties:

- `sessions`: The number of sessions to use.
- `delay`: The number of seconds to wait between requests.
- `links`: An array of links to send requests to.

## Disclaimer

This program is provided for educational purposes only. Please use it responsibly and do not use it to harm any websites.
