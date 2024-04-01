# FoundIt

Post found or lost items, and receive replies from claimants and finders.

## Group members

Justin Hao: GitHub: haojustin Email: justinhao@ucsb.edu Phone: 408-693-9511 Discord: h_ow

Victor Li: GitHub: eggzdee1 Email: victorli@ucsb.edu Phone: 669-212-1096 Discord: steve3482

Kendrick Lee: GitHub: kendrick-lee Email: kendricklee@ucsb.edu Phone: (415) 664-3230 Discord: captain_cutlass

Zixiao Jin: GitHub: ZixiaoJin Email: zixiao_jin@ucsb.edu Phone: (820) 758-8441 Discord: .brucejin

Baimin Wang: GitHub: Baiming-Wang Email: baiminwang@ucsb.edu Phone: 714-906-2159 Discord: .harry.w.

Kevin Lavelle: GitHub: coder626 Email: kevinlavelle@ucsb.edu Phone: (310) 650-6587 Discord: _daddydestroyer

Alex Castelein: GitHub: 17acastelein Email: acastelein@ucsb.edu Phone: (650) 521-6344 Discord: acastelein

## Tech stack

We have decided on using React Native for iOS-Android cross compatibility.

## Description

Users can upload images and descriptions of items that they lose or items that they found. They will see a feed of lost/found items in their area. If there is a match, two users can chat to discuss returning the lost item. Abuse can be reported.

## User roles and permissions

Finder: Someone who has found an item. They can respond to possible lost postings, or make a new found post. Common user: can use all the app's normal features (post, chat, etc).

Loser: Someone who has lost an item. They can respond to possible found postings, or make a new lost post. Common user: can use all the app's normal features (post, chat, etc).

Mods: Regulate inappropriate content. Has the ability to remove troll posts, and ban users.

## Installation

## Prerequisites

Node.js v20.11.0, npm 10.3.0.
Expo Go app on phones.

## Dependencies

Firebase for signin function and data storage.
react-native-maps for map feature.
expo-camera for camera feature.

## Deployment

1. Clone main.
2. npm install -g expo-cli
3. npm install -g eas-cli
4. npm install
5. npx expo start
6. s
7. Use your phone to scan the Expo Go QR code.

## Functionality

Home page to view all the posts posted by all users and a map button to view the map.
Post page to take pictures of found items.
Profile page to view user information and settings.
Tag bar at the bottom to switch between different pages.

## Known Problems

Video functionality currently has bugs for both taking as well as uploading

After uploading media if you set the location, the media get deleted so for now first set location

Many features are hard coded now and will be implemented in the future.

## Contributing

1. Fork it!
2. Create your feature branch: git checkout -b my-new-feature
3. Commit your changes: git commit -am 'Add some feature'
4. Push to the branch: git push origin my-new-feature
5. Submit a pull request :D

## License
Copyright (c) 2024 Justin Hao, Kevin Lavelle, Victor Li, Zixiao Jin, Baimin Wang, Alexandre Castelein, Kendrick Lee

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
