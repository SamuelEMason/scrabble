Samuel Mason
Samuel_Mason@student.uml.edu
GitHub Page: https://samuelemason.github.io/scrabble/
GitHub Repo: https://github.com/SamuelEMason/scrabble

I want to start by stating how much I appreciate you giving me this extension. I was having a very difficult time
trying to accept that I would get a bad grade in this class because I got sick and now I've completed the assignment
and feel proud of my accomplishment. Thank you so much!!!

About the implementation:

My program consists of a Scrabble object whose properties are objects as well:
	- Board 
	- Rack 
	- State 
The Scrabble object is where the board and rack are called into initialization. All of the game rules implemented
are within this object, including the drag and drop functionality of the tiles. 

Drag n Drop events: 

	I attempted to use jQuery draggable objects in the beginning, which were very easy to work with initially 
	but I found it difficult to define droppable elements and eventually went with pure JS click event based
	drag and drop. I found an article that I shared on Piazza that was very helpful (cited below).

	In total, tiles are initialized to the rack and can be dragged to the squares on the board. If a piece
	is dropped outside of either of these spaces, it returns to its original position on the rack.

	It's still not perfect and a lot of cases break the program, but making the effort to play perfectly 
	should lead to one playable round of this game. 

The Board contains 15 Space objects related to the divs that are placeholders for the tiles. 

The State is where the information about the tiles is located as well as the score.

All of the assigned features are implemented as well as a replace tile square. With this square, you drag
the tile you want to replace and drop it into the square. The tile is replaced on the rack with a new tile.
The replaced tile is put "back into the bag" by way of incrementing the number of tiles with that letter.

This whole process has given me a lot better understanding in the area of drag and drop events. This 
was a lot to wrap my head around and still is very complicated.

The only issue I still get is if you repeatedly click the reset button, eventually the console goes into 
an infinite loop and eventually the browser can't function anymore. So be careful!

I've enjoyed working on this assignment and this class in general!
Thanks for a great semester!

Here is my work cited:
https://javascript.info/mouse-drag-and-drop