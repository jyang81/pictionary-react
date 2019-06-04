This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## React Pictionary

React Pictionary is a realtime multiplayer drawing game. One person draws while other players guess. Once a player guesses the word correctly, they will be awarded a win, and the game will end. Currently, only one game can be in progress at a time, but everyone can join the game in progress.

![Screenshot](/react-pictionary-screenshot.png)

### How to play:

1. Log in with username

2. The first person to click "Create Game" will be the drawer for that game.

3. Other players can click "Join Game" to guess what the drawer is drawing.

4. The drawer will get a random word and draw it until someone guesses correctly.

5. Once, a correct guess has been made, the Host will announce the winner and that user will get a point.

6. Guesses must be spelled correctly, but are not case-sensitive

7. The game will end once a word is guessed correctly, and another user can have the chance to draw by clicking the "Create Game" button.

8. This can continue until players decide to quit.

9. We know there are still some bugs left. If you run into any errors, please have all users log out and refresh their browsers.


### Future updates:

 - Automatically assign the drawer to the next person in the game
 - Add a timer for each round
 - Display current players list
 - Undo button
 - Add more words
 - improve drawing tools (more colors/widths/brush shapes)


### Technologies used:

 - React (front end)
 - Rails (back end)
 - Canvas (drawing)
 - ActionCable (realtime drawing and chat)
 - JWT (authorization)
 - Semantic UI (styling)


### Questions/Comments/Suggestions?

Please get in touch with us:

@jyang81 (Joe)

@ConditionalStatementLifestyle (Jon)
