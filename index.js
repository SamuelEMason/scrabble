// Samuel Mason
// Samuel_Mason@student.uml.edu

var BOARD_LENGTH = 15;
var RACK_SIZE = 7;
var NUM_MULTIPLIERS = 4;


class Scrabble {
	constructor() {
		this.board = new Board();
		this.rack = new Rack();
		this.state = new State();
		this.tileSet = 	"aaaaaaaaabbccddddeeeeeeeeeeeeffggghhiiiiiiiiijkllllmmnnnnnnooooooooppqrrrrrrssssttttttuuuuvvwwxyyz__";
		this.tileID = 0;
		this.firstTilePlaced = false;
		this.initialize();
	};

	initialize() {
		this.fillRack();
		this.updateScore();
		this.updateTileDataTable();
		this.loadButtonEvents();
		
	}

	// Fill the Rack with the proper amount of tiles
	fillRack(none) {

		for (let rackSpace = 0; rackSpace < RACK_SIZE; rackSpace++) {

			// Select space in rack
			let targetSpace = $(`#space${rackSpace}`);

			// Skip if space is occupied
			if (!$(`#space${rackSpace}`).children().length) {

				let newTile = this.generateTile(rackSpace);
				targetSpace.append(newTile);

				// Attach drag and drop event handlers to new tiles
				let target = targetSpace[0].children[0];
				this.draggifyTile(this, target);
			}	
		}
	};

	generateTile(rackSpace) {

		// Select random letter from legal letters set
		let randomCharacter = this.tileSet[Math.floor(Math.random() * this.tileSet.length)];
		this.tileSet = this.tileSet.replace(randomCharacter, '');
		this.state.tileData[randomCharacter].quantity -= 1;

		// Create new tile
		this.rack.tiles[rackSpace].isOccupied = true;
		let url = this.state.tileData[randomCharacter].url;
		return `<img id="${this.tileID++}" class="tile draggable ${randomCharacter}" src="${url}"></img>`;
	}

	// Drag and Drop click events are situated in here
	draggifyTile(scrabble, target) {

		// in the case of a drop over non-droppable elements
		let parent = target.parentElement;
		// let letter = target.classList[2];


		// The outermost event
		target.onmousedown = (e) => {

			// Correct for grabbing in non-center locations (no skip)
			let shiftX = e.clientX - target.getBoundingClientRect().left;
			let shiftY = e.clientY - target.getBoundingClientRect().top;
			target.style.position = 'absolute';
			target.style.zIndex = 1000;

			// Append to body to move about the page
			document.body.append(target);
			
			if (scrabble.board.currentTileLocation[target.id]) {
				let squareNumber = scrabble.board.currentTileLocation[target.id];
				scrabble.removeTileFromBoard(squareNumber);
			}

			// Moves the dragged object to specified location on page
			function moveAt(pageX, pageY) {
				target.style.left = pageX - shiftX + 'px';
				target.style.top = pageY - shiftY + 'px';
			}
			moveAt(e.pageX, e.pageY);

			// Nested event for mouse movement after click has occurred
			function onMouseMove(e) {
				moveAt(e.pageX, e.pageY);

				// Need to hide the target to become aware of the element below
				target.hidden = true;
				let elemBelow = document.elementFromPoint(e.clientX, e.clientY);
				target.hidden = false;

				// The drop event
				target.onmouseup = () => {

					let droppableTarget = false;

					// Determine if the element underneath the dropped target is able to be dropped on
					elemBelow.classList.forEach((className) => {
						if (className == 'droppable') {
							droppableTarget = true;
						}
					});

					// removes offset once dropped
					target.getAttribute('style');
					target.removeAttribute('style');

					let squareNumber = elemBelow.id.replace('square', '');

					// Cases for when the element is droppable
					if (droppableTarget) {

						if (elemBelow.id == 'replace') {
							
							let letter = target.classList[2];
							$(target).remove();
							scrabble.tileSet += letter;
							scrabble.state.tileData[letter].quantity += 1;
							
							
							let rackSpace = parent.id.replace('space', '');
							let newTile = scrabble.generateTile(rackSpace).replace('</img>', '');
							$(parent).append(newTile);
							target = parent.children[0];
							
							scrabble.draggifyTile(scrabble, target);
							scrabble.updateTileDataTable();
						}
						// If the tile is not the first tile to be played
						else if (scrabble.firstTilePlaced) {
							let prevSquare = squareNumber - 1;

							// If the previous square is occupied with a tile
							if ($(`#square${prevSquare}`).children()[0]) {

								// If square being dropped on is already occupied
								if ($(`#square${squareNumber}`).children()[0]) {
									parent.appendChild(target);
								}
								else {
									// Add the new tile to the current square
									scrabble.board.currentTileLocation[target.id] = squareNumber;
									squareNumber = scrabble.board.currentTileLocation[target.id];
									scrabble.addTileToBoard(squareNumber, letter);
									$(elemBelow)[0].appendChild(target);
								}
							}
							else {
								scrabble.checkForEmptyBoard();
								parent.appendChild(target);
							}
						}
						else {
							if (elemBelow.classList[0] == 'place') {
								scrabble.board.currentTileLocation[target.id] = squareNumber;
								squareNumber = scrabble.board.currentTileLocation[target.id];
								scrabble.addTileToBoard(squareNumber, letter);
							}
							$(elemBelow)[0].appendChild(target);
						}
					}
					// The element dropped onto is not capable of receiving dropped tile
					else {
						// If the tile was picked up from the board, remove from board
						if (scrabble.board.currentTileLocation[target.id]) {
							let squareNumber = scrabble.board.currentTileLocation[target.id];
							scrabble.removeTileFromBoard(squareNumber);
							delete scrabble.board.currentTileLocation[target.id];
						}
						// Return tile to its place on the rack
						parent.appendChild(target);
					}
					
					document.removeEventListener('mousemove', onMouseMove);
					target.onmouseup = null;
				}
			}
	
			document.addEventListener('mousemove', onMouseMove);

			target.ondragstart = () => {
				return false;
			}
		}
	}

	// Tile information for added tile is stored in Board object
	addTileToBoard(spaceNumber, letter) {
		let value = this.state.tileData[letter].value;
		this.board.squares[spaceNumber].content = {letter, value};
		this.board.squares[spaceNumber].isOccupied = true;
		this.firstTilePlaced = true;
	}

	// Tile information for removed tile is removed from Board object
	removeTileFromBoard(spaceNumber) {
		this.board.squares[spaceNumber].content = null;
		this.board.squares[spaceNumber].isOccupied = false;
		this.checkForEmptyBoard();
	}

	// Checks each square for tile
	checkForEmptyBoard() {

		let isEmpty = true;
		this.board.squares.forEach((square) => {
			if (square.isOccupied) {
				isEmpty = false;
			}
		});

		if (isEmpty) {
			this.firstTilePlaced = false;
		}
	}

	// 
	updateTileDataTable() {

		let alphabet = 'abcdefghijklmnopqrstuvwxyz_';

		$('#tile-data').empty();
		$('#tile-data').append('<thead id="td-head"></thead>');
		$('#tile-data').append('<tbody id="td-body"></tbody>');

		$('#td-head').append('<tr><th colspan=8>Remaining Tile Count</th></tr>')
		
				
		for (let i = 0, row = 0; i < 24; i += 4) {

			$('#td-body').append(`
				<tr>
					<td>
						${alphabet[i]}
					</td>
					<td>
						${this.state.tileData[alphabet[i]].quantity}
					</td>
					<td>
						${alphabet[i + 1]}
					</td>
					<td>
						${this.state.tileData[alphabet[i + 1]].quantity}
					</td>
					<td>
						${alphabet[i + 2]}
					</td>
					<td>
						${this.state.tileData[alphabet[i + 2]].quantity}
					</td>
					<td>
						${alphabet[i + 3]}
					</td>
					<td>
						${this.state.tileData[alphabet[i + 3]].quantity}
					</td>
			`);
			
		}
		$('#td-body').append(`
			<tr>
				<td>
					${alphabet[24]}
				</td>
				<td>
					${this.state.tileData[alphabet[24]].quantity}
				</td>
				<td>
					${alphabet[25]}
				</td>
				<td>
					${this.state.tileData[alphabet[25]].quantity}
				</td>
				<td>
					${alphabet[26]}
				</td>
				<td>
					${this.state.tileData[alphabet[26]].quantity}
				</td>
				<td></td><td></td>
			</tr>
		`);
	}

	// For each square on the board, a weighted sum of 
	// bonuses and tile values is computed and updated on the page
	updateScore() {

		let squares = this.board.squares;
		let sum = 0, letterMultiplier = 1, wordMultiplier = 1;

		for(let num = 0; num < BOARD_LENGTH; num++) {

			letterMultiplier = 1;
			
			// Only where a tile is located
			if (squares[num].isOccupied) {

				// Check squares multiplier attribute against the following symbols
				switch (squares[num].multiplier) {

					// No multiplier
					case 'blank':
						break;
	
					// Double Letter Score
					case 'dls':
						letterMultiplier = 2;
						break;
					
					// Double Word Score
					case 'dws':
						wordMultiplier *= 2;
						break;
					
					// Invalid multiplier symbol
					default:
						console.log('INVALID SQUARE MULTIPLIER VALUE');
						exit(-1);
				}
				sum += squares[num].content['value'] * letterMultiplier;
				letterMultiplier = 1;
			}
		}
		this.state.score += sum * wordMultiplier;
		$('#score').text(this.state.score);
	};

	resetScore(none) {
		// Add the score to the page
		this.state.score = 0;
		$('#score').remove();
		$('#score-wrapper').append('<span id="score"></span>');
		$('#score').text(this.state.score);
	}

	// Resets the whole game to initialized state
	reset() {
		
		// Set rack spaces to unoccupied
		for (let num = 0; num < RACK_SIZE; num++) {
			this.rack.tiles[num].isOccupied = false;
		}

		// Remove current set of visible tiles
		$('img').remove();

		// Initialize Scrabble tile data
		this.tileSet = 	"aaaaaaaaabbccddddeeeeeeeeeeeeffggghhiiiiiiiiijkllllmmnnnnnnooooooooppqrrrrrrssssttttttuuuuvvwwxyyz__";
		this.tileID = 0;
		this.firstTilePlaced = false;
		this.state.tileData = this.state.initializeTileData();

		// Reinitialize the Scrabble game
		this.initialize();

		// Reset score
		this.resetScore();

		// Reset Tile Count table
		$('#tile-data').empty();
		this.updateTileDataTable();
	}

	submit() {
		this.updateScore();
		for (let num = 0; num < BOARD_LENGTH; num++) {
			if ($(`#square${num}`).children()) {
				$(`#square${num}`).children().remove();
				this.board.squares[num].isOccupied = false;
			}
		}
		this.fillRack();
		this.firstTilePlaced = false;
		this.updateTileDataTable();
		
	}

	loadButtonEvents() {
		$('#reset').click((e) => {
			this.reset();
		});
	
		$('#submit').click((e) => {
			this.submit();
		});
	}
}

// Contains all board logic
class Board {
	constructor(none) {
		// 15 total squares on board strip
		this.squares = new Array();
		this.currentTileLocation = new Object();
		this.multipliers = {
			2: 'dws',
			6: 'dls',
			8: 'dls',
			12: 'dws'
		};
		this.initialize();
	};

	initialize(none) {
		// Select board
		let board = $('#board');

		// create space for current multiplier
		let multiplier = 'blank';
	
		// Occupy the board with placeholders for 15 squares
		for (let num = 0; num < BOARD_LENGTH; num++) {

			// Check if square contains multiplier
			if (num == 2 || num == 6 || num == 8 || num == 12) {

				// Set multiplier object
				multiplier = this.multipliers[num];
			}

			// Create square as an HTML element
			board.append(`<div class="place droppable" id="square${num}"></div>`);

			// Push square object to the squares array
			let newSquare = new Square(`square${num}`, multiplier);

			// Unoccupied square has value of none
			this.squares.push(newSquare);

			// Reset multiplier to blank
			multiplier = 'blank';
		}
	};

	addTile(squareNum) {
		let index = squareNum - 1;
		this.squares[index].isOccupied = true;
	}

	removeTile(squareNum) {
		let index = squareNum - 1;
		this.squares[index].isOccupied = false;
	}
}

// Square logic stored here
class Square {
	constructor(id, mult) {
		this.id = id;
		this.isOccupied = false;
		this.multiplier = mult;
		this.content = {};	
	}
}

class Tile {
	constructor(letter, value) {
		this.letter = letter;
		this.value = value;
	}
}

// Rack logic stored here
class Rack {
	constructor(none) {
		this.tiles = new Array();
		this.tileCount = 0;
		this.initialize();
	};

	initialize() {

		// Grab div to fill with rack spaces
		let space = $('#space');

		// Create 7 rack space instances that are droppable and initialize them
		for (let num = 0; num < RACK_SIZE; num++) {
			space.append(`<div id="space${num}" class="tile-space droppable"></div>`);
			let spaceID = `space${num}`;
			let spaceInfo = {isOccupied: false};
			let newSpace = {spaceID: spaceInfo};

			this.tiles.push(newSpace);
		}
	}
}

// Information about the game is stored here
class State {
	constructor(none) {

		// Tracks game score
		this.score = 0;

		// tileData object contains letter keys
		// with 3 element sets containing tile value, quantity, and url
		this.tileData = this.initializeTileData();
	};

	initializeTileData() {
		return {
			'a': {'value': 1, 'quantity': 9, 'url': `images/Scrabble_Tiles/Scrabble_Tile_A.jpg`},
			'b': {'value': 3, 'quantity': 2, 'url': `images/Scrabble_Tiles/Scrabble_Tile_B.jpg`},
			'c': {'value': 3, 'quantity': 2, 'url': `images/Scrabble_Tiles/Scrabble_Tile_C.jpg`},
			'd': {'value': 2, 'quantity': 4, 'url': `images/Scrabble_Tiles/Scrabble_Tile_D.jpg`},
			'e': {'value': 1, 'quantity': 12, 'url': `images/Scrabble_Tiles/Scrabble_Tile_E.jpg`},
			'f': {'value': 4, 'quantity': 2, 'url': `images/Scrabble_Tiles/Scrabble_Tile_F.jpg`},
			'g': {'value': 2, 'quantity': 3, 'url': `images/Scrabble_Tiles/Scrabble_Tile_G.jpg`},
			'h': {'value': 4, 'quantity': 2, 'url': `images/Scrabble_Tiles/Scrabble_Tile_H.jpg`},
			'i': {'value': 1, 'quantity': 9, 'url': `images/Scrabble_Tiles/Scrabble_Tile_I.jpg`},
			'j': {'value': 8, 'quantity': 1, 'url': `images/Scrabble_Tiles/Scrabble_Tile_J.jpg`},
			'k': {'value': 5, 'quantity': 1, 'url': `images/Scrabble_Tiles/Scrabble_Tile_K.jpg`},
			'l': {'value': 1, 'quantity': 4, 'url': `images/Scrabble_Tiles/Scrabble_Tile_L.jpg`},
			'm': {'value': 3, 'quantity': 2, 'url': `images/Scrabble_Tiles/Scrabble_Tile_M.jpg`},
			'n': {'value': 1, 'quantity': 6, 'url': `images/Scrabble_Tiles/Scrabble_Tile_N.jpg`},
			'o': {'value': 1, 'quantity': 8, 'url': `images/Scrabble_Tiles/Scrabble_Tile_O.jpg`},
			'p': {'value': 3, 'quantity': 2, 'url': `images/Scrabble_Tiles/Scrabble_Tile_P.jpg`},
			'q': {'value': 10,'quantity': 1,'url':  `images/Scrabble_Tiles/Scrabble_Tile_Q.jpg`},
			'r': {'value': 1, 'quantity': 6, 'url': `images/Scrabble_Tiles/Scrabble_Tile_R.jpg`},
			's': {'value': 1, 'quantity': 4, 'url': `images/Scrabble_Tiles/Scrabble_Tile_S.jpg`},
			't': {'value': 1, 'quantity': 6, 'url': `images/Scrabble_Tiles/Scrabble_Tile_T.jpg`},
			'u': {'value': 1, 'quantity': 4, 'url': `images/Scrabble_Tiles/Scrabble_Tile_U.jpg`},
			'v': {'value': 4, 'quantity': 2, 'url': `images/Scrabble_Tiles/Scrabble_Tile_V.jpg`},
			'w': {'value': 4, 'quantity': 2, 'url': `images/Scrabble_Tiles/Scrabble_Tile_W.jpg`},
			'x': {'value': 8, 'quantity': 1, 'url': `images/Scrabble_Tiles/Scrabble_Tile_X.jpg`},
			'y': {'value': 4, 'quantity': 2, 'url': `images/Scrabble_Tiles/Scrabble_Tile_Y.jpg`},
			'z': {'value': 10,'quantity': 1,'url':  `images/Scrabble_Tiles/Scrabble_Tile_Z.jpg`},
			'_': {'value': 0, 'quantity': 2, 'url': `images/Scrabble_Tiles/Scrabble_Tile_Blank.jpg`}
		}
	};
}


function main() {
	// Create new Scrabble object
	let game = new Scrabble();

	
}

main();

