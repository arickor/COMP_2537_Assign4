let Pokemon = [];
let diff = 0;
let levels = [
  { cards: 3, time: 120 },
  { cards: 6, time: 120 },
  { cards: 12, time: 45 },
];

const setup = async () => {
  let fetch = await axios.get(
    "https://pokeapi.co/api/v2/pokemon?offset=0&limit=493"
  );
  Pokemon = fetch.data.results;
};

async function start() {
  var cardNum = levels[diff].cards;
  var pairsMatched = 0;
  var timeLimit = levels[diff].time;
  var pokemon = [];
  for (var i = 0; i < cardNum; i++) {
    var index = Math.floor(Math.random() * Pokemon.length);
    pokemon.push(Pokemon[index]);
    pokemon.push(Pokemon[index]);
  }
  await loadCards(pokemon);
  gameText(timeLimit);

  pairs = setInterval(() => {
    var html = `<div>Possible Matches: ${cardNum}</div><div>Matches Achieved: ${pairsMatched}</div><div>Remaining Matches: ${
      cardNum - pairsMatched
    }</div>`;
    $("#pairStats").empty().append(html);
    if (pairsMatched >= cardNum) {
      alert("Congratulations!");
      resetGame();
    }
  }, 100);

  let firstCard = undefined;
  let secondCard = undefined;
  var inProgress = false;
  $(".card").on("click", function () {
    if (help) {
      return;
    }
    if (firstCard == undefined) {
      firstCard = $(this).find(".front")[0];
      $(this).toggleClass("flip");
    } else if (
      secondCard == undefined &&
      $(this).find(".front")[0] != firstCard
    ) {
      secondCard = $(this).find(".front")[0];
      $(this).toggleClass("flip");
    }
    if (firstCard && secondCard && !inProgress) {
      if (firstCard.src == secondCard.src) {
        $(`#${firstCard.id}`).parent().off("click");
        $(`#${secondCard.id}`).parent().off("click");
        firstCard = undefined;
        secondCard = undefined;
        pairsMatched++;
      } else {
        inProgress = true;
        setTimeout(() => {
          $(`#${firstCard.id}`).parent().toggleClass("flip");
          $(`#${secondCard.id}`).parent().toggleClass("flip");
          firstCard = undefined;
          secondCard = undefined;
          inProgress = false;
        }, 1000);
      }
    }
  });
}

function gameText(timeLimit) {
  clickCount = 0;
  $("#clickCounter").empty().append(`Attempts: ${clickCount}`);
  clearInterval(timer);
  var startTime = Date.now();
  var timeElapsed = 0;
  $("#timer").empty().append(`<h1> 0 / ${timeLimit} seconds Remaining</h1>`);
  timer = setInterval(() => {
    timeElapsed = (Date.now() - startTime) / 1000;
    $("#timer")
      .empty()
      .append(`<h1>${Math.floor(timeElapsed)} / ${timeLimit} seconds Remaining</h1>`);
    if (timeElapsed >= timeLimit) {
      alert("Game Over!");
      resetGame();
    }
    var timeRemaining = timeLimit - timeElapsed;
    if (timeRemaining > 29 && timeRemaining <= 30) {
      powerUp();
    }
  }, 1000);
}

var timer, pairs;
var clickCount = 0;
var help = false;

async function loadCards(pokemon) {
  $("#deck").empty();
  while (pokemon.length != 0) {
    var i = Math.floor(Math.random() * pokemon.length);
    var givenPokemon = await axios.get(pokemon[i].url);
    var card = `<div class="card"><img src="${
      givenPokemon.data.sprites.front_default
    }" class="front" id="${
      givenPokemon.data.name + pokemon.length
    }"><img src="backside.png" class="back"></div>`;
    $("#deck").append(card);
    pokemon.splice(i, 1);
  }
}

$("#easy").on("click", function () {
  diff = 0;
});

$("#medium").on("click", function () {
  diff = 1;
});

$("#hard").on("click", function () {
  diff = 2;
});

$("#start").on("click", () => {
  start();
});

$("#reset").on("click", resetGame);

function resetGame() {
  console.log("reset");
  clearInterval(timer);
  clearInterval(pairs);
  $("#headsup").children().empty();
  $("#deck").empty();
}

$("#deck").on("click", () => {
  clickCount++;
  $("#clickCounter").empty().append(`Attempts: ${clickCount}`);
});

$("#darkmode").on("click", () => {
  $("body").css({ "background-color": "#1A1A1A", color: "black" });
  $("button").toggleClass("btn-dark btn-light");
});

$("#lightmode").on("click", () => {
  $("body").css({ "background-color": "white", color: "black" });
  $("button").toggleClass("btn-dark btn-light");
});

function powerUp() {
  if (!help) {
    help = true;
    $("#deck").find(".card:not(.flip)").toggleClass("powered-up flip");
    setTimeout(() => {
      $("#deck").find(".powered-up").toggleClass("powered-up flip");
      help = false;
    }, 1000);
  }
}

$(document).ready(setup);
