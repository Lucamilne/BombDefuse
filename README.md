# BombDefuse

The Bomb Defusal RGB Game is a unique interpretation of the RGB color game, a static web app rite of passage. It's primary purpose is to show a more advanced understanding of CSS and Javascript than is typically required to make the original base game. The game has been written in standard javascript with use of jQuery for a single function.


Some additional features that I've added that isn't typical of the standard RGB color game:

- Interactivity is limited once the correct wire is picked.

- algorithm that changes color values from decimal code to percentages.

- two fail conditions added, a countdown and a lifeline mechanic. Failure to pick the right wire in time, or too many incorrect guesses will cause the bomb to explode. 

- LED light indicates 3 states of the bomb, idle, armed and defused. 

- Buttons on the bomb are interactive with the display. This is purely cosmetic and has no impact on the game mechanics. 

- Bomb is crafted entirely out of CSS.

- Added a hard difficulty expanding the total wires to 9. Typically the RGB color game only has two difficulties displaying 3 and 6 squares.

- removed most of the Interface replacing it with interactive parts to the bomb and visual feedback to guide players.

- Dynamic backgrounds and rainbow text.

- A Game Over screen.

- Responsive - changes size of bomb based on viewport width and height.

- An animation of pliers is played whenever a wire is cut.

Known issues: 

Instructions not displayed currently on Safari browsers.
