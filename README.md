# Simple chat

## Deepstream project commands

### Deepstream project setup
```
npm run deepstream:install
```

### Deepstream serve initialize
```
npm run deepstream:serve
```

## Vue project commands

### Vue project setup
```
npm run vue:install
```

### Compiles and hot-reloads for development
```
npm run vue:serve
```

### Compiles and minifies for production
```
npm run vue:build
```

### Lints and fixes files
```
npm run vue:lint
```

# How to start?

1. First install vue and deepstream dependencies. You can go to each folder and run "npm install" command or, from main folder, run "npm run vue:install" and "npm run deepstrea:install" commands to install both projects dependencies.
 
2. In 2 different terminals run "npm run deepstream:serve" and "npm run vue:serve". After both process have finished, you will be able to go http://localhost:8080/ in your browser (this path could change if another service is running on port 8080).

3. Here in, you could login using any of default users (Jhon and Peter). Just click on any of user's avatars on the top-right corner of the screen. When both users are logged, you can't login with any other user.

4. If you want to login with 2 different users, you can open a new browser tab, go to http://localhost:8080/ and select any available user.

5. You can chat between both users, login and logout any time and data will be saved if the terminal with deepstream serve still running. If you close that terminal, all data will be lost.
