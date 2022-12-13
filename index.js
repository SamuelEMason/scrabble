var BOARD_LENGTH = 15;
var RACK_SIZE = 7;
var NUM_MULTIPLIERS = 4;


class Scrabble {
	constructor() {
		this.board = new Board();
		this.rack = new Rack();
		this.state = new State();
		this.initialize();
	};

	// FIX WHERE THERE IS A TILE IN A SQUARE AND 
	// ANOTHER TILE IS PLACED IN THE OCCUPIED SQUARE
	initialize() {

		this.fillRack();

		let tiles = document.querySelectorAll('.draggable');
		
		tiles.forEach((target) => {
			// in the case of a drop over non-droppable elements
			let parent = target.parentElement;

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

						if (droppableTarget) {
							$(elemBelow)[0].appendChild(target);
						}
						else {
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
		});
	}

	///////////////////UNFINISHED WORK ON IT
	fillRack(none) {

		const alphabet = "abcdefghijklmnopqrstuvwxyz_";
		let randomCharacter;

		for (let num = 0; num < RACK_SIZE; num++) {

			if (!this.rack.tiles[num].isOccupied) {

				// Select random letter
				do {
					randomCharacter = alphabet[Math.floor(Math.random() * alphabet.length)];
				} while (this.state.tileData[randomCharacter].quantity <= 0);
				
				// Create new tile
				let targetSpace = $(`#space${num}`);
				let url = this.state.tileData[randomCharacter].url;
				targetSpace.append(`<img class="tile draggable" src="${url}"></img>`);
			}	
		}
	};

	///////////////////UNFINISHED UNTESTED WOORK ONNIT
	updateScore() {

		let squares = this.board.squares;
		let sum = 0, letterMultiplier, wordMultiplier = 1;
		console.log(this.board.squares);
		
		for(let num = 0; num < BOARD_LENGTH; num++) {

			if (squares.isOccupied) {
				switch (squares[num].multiplier) {

					case 'blank':
						letterMultiplier = 1;
						break;
	
					case 'dls':
						letterMultiplier = 2;
						break;
					
					case 'dws':
						letterMultiplier = 1;
						wordMultiplier *= 2;
						break;
					
					default:
						console.log('INVALID SQUARE MULTIPLIER VALUE');
						exit(-1);
				}
				sum += squares[num].value * letterMultiplier;
			}
		}
		this.score = sum * wordMultiplier;
		$('#score').text(this.score);
	};

	displayGameState(element) {

		console.log('DISPLAYING SCRABBLE STATE\n\n');
	
		switch(element) {
			case 'board':
				// Leaf node attributes of Scrabble.board
				console.log('*****Scrabble.board:*****\n\n');
				console.log('\t- Scrabble.board.squares:\n\n', this.board.squares);
				console.log('\n\n\t- Scrabble.board.multipliers:\n\n', this.board.multipliers);
				break;
			
			case 'rack':
				// Leaf node attributes of Scrabble.rack
				console.log('\n\n*****Scrabble.rack:*****\n\n');
				console.log('\t- Scrabble.rack.tiles:\n\n\n', this.rack.tiles);
				console.log('\n\n\t- Scrabble.rack.tilecount:', this.rack.tileCount);
				break;
			
			case 'state':
				// Leaf node attributes of Scrabble.bag
				console.log('\n\n*****Scrabble.state:*****\n\n');
				console.log('\t- Scrabble.bag.tileData:\n\n\n', this.bag.tileData);
				console.log('\t- Scrabble.bag.score:\n\n\n', this.bag.score);
				break;
			
			default:
				// Invalid input
				console.log('*****INVALID STATE TYPE INPUT*****');
				break;
		}
	}
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
}

class Square {
	constructor(id, mult) {
		this.id = id;
		this.isOccupied = false;
		this.multiplier = mult;
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

