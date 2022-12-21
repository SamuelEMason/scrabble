Samuel Mason
Samuel_Mason@student.uml.edu
GitHub Page: https://samuelemason.github.io/scrabble/
GitHub Repo: https://github.com/SamuelEMason/scrabble

So for the past 4 days I've been sick with a fever and a sore throat. All I could do until today
was lay there in bed trying to rest. I don't want to be a person who makes excuses in life,
but I feel like it's necessary to state this. Because I had other finals I had to stop working
on this assignment until I had finished the exams as I would have 4 days after them to finish it.
I must've gotten sick because I'm run down from the semester but the timing made it so that I didn't
have enough time to finish this by the deadline.

I emailed the professor to see if I could get an extension because of my circumstances and received no 
response. If there's anything at all I can do to continue with this assignment with an extension please
let me know, I would really appreciate the help. Thank you.

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

On the page, you can see the score changing, the click after a piece is used. Most of the buttons underneath
don't work properly yet, I've been stuck on certain drag and drop bugs that have been difficult for me to rectify.
The reset button works the first time but afterwards, the pieces cannot be dropped into the spaces on the board.

Overall, a lot has gone into planning and structuring this program, but I have run out of time because I was sick.


Here is my work cited:
https://javascript.info/mouse-drag-and-drop