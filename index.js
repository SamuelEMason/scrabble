var BOARD_LENGTH = 15;
var RACK_SIZE = 7;
var NUM_MULTIPLIERS = 4;


class Scrabble {
	constructor() {
		this.board = new Board();
		this.rack = new Rack();
		this.state = new State();
		this.firstTilePlaced = false;
		this.initialize();
	};

	// FIX WHERE THERE IS A TILE IN A SQUARE AND 
	// ANOTHER TILE IS PLACED IN THE OCCUPIED SQUARE
	initialize() {

		this.fillRack();
		this.updateScore();

		$('#reset').click((e) => {
			this.reset();
			this.fillRack();
		});

		// $('#submit').click((e) => {
		// 	this.updateScore();
		// 	this.reset();
		// });
	}

	///////////////////UNFINISHED WORK ON IT
	fillRack(none) {
		const alphabet = "abcdefghijklmnopqrstuvwxyz_";
		let randomCharacter;

		for (let num = 0; num < RACK_SIZE; num++) {

			let targetSpace = $(`#space${num}`);
			if (!this.rack.tiles[num].isOccupied) {

				// Select random letter
				do {
					randomCharacter = alphabet[Math.floor(Math.random() * alphabet.length)];
				} while (this.state.tileData[randomCharacter].quantity <= 0);
				
				// Create new tile
				this.rack.tiles[num].isOccupied = true;
				let url = this.state.tileData[randomCharacter].url;
				targetSpace.append(`<img class="tile draggable ${randomCharacter}" src="${url}"></img>`);
			}	
			let target = targetSpace[0].children[0];
			this.draggifyTile(this, target);	
		}
	};

	reset() {
		for (let num = 0; num < RACK_SIZE; num++) {
			this.rack.tiles[num].isOccupied = false;
		}
		$('img').remove();
		this.firstTilePlaced = false;
		this.fillRack();
		this.initialize();
	}

	draggifyTile(scrabble, target) {

		// in the case of a drop over non-droppable elements
		let parent = target.parentElement;
		let letter = target.classList[2];

		target.onmousedown = (e) => {

			let shiftX = e.clientX - target.getBoundingClientRect().left;
			let shiftY = e.clientY - target.getBoundingClientRect().top;
			target.style.position = 'absolute';
			target.style.zIndex = 1000;

			document.body.append(target);
			
			function moveAt(pageX, pageY) {
				target.style.left = pageX - shiftX + 'px';
				target.style.top = pageY - shiftY + 'px';
			}
			moveAt(e.pageX, e.pageY);

			function onMouseMove(e) {
				moveAt(e.pageX, e.pageY);

				target.hidden = true;
				let elemBelow = document.elementFromPoint(e.clientX, e.clientY);
				target.hidden = false;

				target.onmouseup = () => {
					let droppableTarget = false;
					elemBelow.classList.forEach((className) => {
						if (className == 'droppable') {
							droppableTarget = true;
						}
					});

					target.getAttribute('style');
					target.removeAttribute('style');

					let squareNumber;
					// Check if square id is less than 10
					if (elemBelow.id.length == 7) {
						squareNumber = +elemBelow.id[6];
					}
					else {
						squareNumber = 10 + +elemBelow.id[7];
					}

					if (droppableTarget) {

						if (Scrabble.firstTilePlaced) {

							let prevSquare = squareNumber - 1;

							// If the previous square is occupied with a tile
							if ($(`#square${prevSquare}`).children()[0]) {

								// Add the new tile to the current square
								$(elemBelow)[0].appendChild(target);
								scrabble.addTileToBoard(squareNumber, letter);
							}
							else {
								parent.appendChild(target);
							}
						}

						else {
							$(elemBelow)[0].appendChild(target);
							scrabble.addTileToBoard(squareNumber, letter);
							Scrabble.firstTilePlaced = true;
						}
					}
					else {
						let rackSpace = parent;
						parent = target.parentElement;
						console.log(parent);
					
						rackSpace.appendChild(target);
						scrabble.removeTileFromBoard(parent);
					}
					scrabble.checkForEmptyBoard();

					document.removeEventListener('mousemove', onMouseMove);
					target.onmouseup = null;
				}
			}
			scrabble.updateScore();

			document.addEventListener('mousemove', onMouseMove);

			target.ondragstart = () => {
				return false;
			}
		}
	}

	addTileToBoard(spaceNumber, letter) {
		let value = this.state.tileData[letter].value;
		this.board.squares[spaceNumber].content = {letter, value};
		this.board.squares[spaceNumber].isOccupied = true;
	}

	removeTileFromBoard(parent) {
		this.board.squares[parent].content = null;
		this.board.squares[parent].isOccupied = false;
	}

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

	///////////////////UNFINISHED UNTESTED WOORK ONNIT
	updateScore() {

		let squares = this.board.squares;
		let sum = 0, letterMultiplier = 1, wordMultiplier = 1;
		console.log(squares)
		for(let num = 0; num < BOARD_LENGTH; num++) {
			if (squares[num].isOccupied) {
				switch (squares[num].multiplier) {

					case 'blank':
						break;
	
					case 'dls':
						letterMultiplier = 2;
						break;
					
					case 'dws':
						wordMultiplier *= 2;
						break;
					
					default:
						console.log('INVALID SQUARE MULTIPLIER VALUE');
						exit(-1);
				}
				sum += squares[num].content['value'] * letterMultiplier;
				
			}
		}
		
		this.score = sum * wordMultiplier;
		$('#score').text(this.score);
	};
}

class Board {
	constructor(none) {
		// 15 total squares on board strip
		this.squares = new Array();
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
		this.tiles[index].isOccupied = true;
	}

	removeTile(squareNum) {
		let index = squareNum - 1;
		this.tiles[index].isOccupied = false;
	}
}

class Square {
	constructor(id, mult) {
		this.id = id;
		this.isOccupied = false;
		this.multiplier = mult;
		this.content = {};	// IMPLEMENT HOLDER FOR TILE
	}
}

class Tile {
	constructor(letter, value) {
		this.letter = letter;
		this.value = value;
	}
}

class Rack {
	constructor(none) {
		this.tiles = new Array();
		this.tileCount = 0;
		this.initialize();
	};

	initialize() {
		let space = $('#space');
		for (let num = 0; num < RACK_SIZE; num++) {
			space.append(`<div id="space${num}" class="tile-space droppable"></div>`);
			let spaceID = `space${num}`;
			let spaceInfo = {isOccupied: false};
			let newSpace = {spaceID: spaceInfo};

			this.tiles.push(newSpace);
		}
	}
}

class State {
	constructor(none) {

		// Tracks game score
		this.score = 0;

		// tileData object contains letter keys
		// with 3 element sets containing tile value, quantity, and url
		this.tileData = {
			'a': {'value': 1, 'quantity': 9, 'url': `images/Scrabble_Tiles/Scrabble_Tile_A.jpg`},
			'b': {'value': 3, 'quantity': 2, 'url': `images/Scrabble_Tiles/Scrabble_Tile_B.jpg`},
			'c': {'value': 3, 'quantity': 2, 'url': `images/Scrabble_Tiles/Scrabble_Tile_C.jpg`},
			'd': {'value': 2, 'quantity': 4, 'url': `images/Scrabble_Tiles/Scrabble_Tile_D.jpg`},
			'e': {'value': 1, 'quantity': 1, 'url': `images/Scrabble_Tiles/Scrabble_Tile_E.jpg`},
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
			'q': {'value': 10,'quantity':  1,'url':  `images/Scrabble_Tiles/Scrabble_Tile_Q.jpg`},
			'r': {'value': 1, 'quantity': 6, 'url': `images/Scrabble_Tiles/Scrabble_Tile_R.jpg`},
			's': {'value': 1, 'quantity': 4, 'url': `images/Scrabble_Tiles/Scrabble_Tile_S.jpg`},
			't': {'value': 1, 'quantity': 6, 'url': `images/Scrabble_Tiles/Scrabble_Tile_T.jpg`},
			'u': {'value': 1, 'quantity': 4, 'url': `images/Scrabble_Tiles/Scrabble_Tile_U.jpg`},
			'v': {'value': 4, 'quantity': 2, 'url': `images/Scrabble_Tiles/Scrabble_Tile_V.jpg`},
			'w': {'value': 4, 'quantity': 2, 'url': `images/Scrabble_Tiles/Scrabble_Tile_W.jpg`},
			'x': {'value': 8, 'quantity': 1, 'url': `images/Scrabble_Tiles/Scrabble_Tile_X.jpg`},
			'y': {'value': 4, 'quantity': 2, 'url': `images/Scrabble_Tiles/Scrabble_Tile_Y.jpg`},
			'z': {'value': 10,'quantity':  1,'url':  `images/Scrabble_Tiles/Scrabble_Tile_Z.jpg`},
			'_': {'value': 0, 'quantity': 2, 'url': `images/Scrabble_Tiles/Scrabble_Tile_Blank.jpg`}
		};
	};
}


function main() {
	// Create new Scrabble object
	let game = new Scrabble();
	// game.displayGameState('board');
}

main();

