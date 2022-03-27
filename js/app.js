var input = document.getElementById("pokeName");
input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("searchPoke").click();
    }
    
})

const fetchPokemon = () => {
    const pokeName = document.getElementById("pokeName");
    let pokeInput = pokeName.value.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${pokeInput}`;
    fetch(url).then((res) => {
        //** prestamos atención al valor de status, el correcto es 200 console.log(res);
        /*** Manejo de errores ***/
        if (res.status != "200") {
            changeImg("./assets/other/sad-pikachu.gif", "No existe ese pokemon :(");
            hideElements();
        } else {
            hideElements();
            return res.json();
        }
        /** .then y  PROMESAS */
    }).then((data) => {
        let id = data.id;
        let type = data.types;
        let stats = data.stats;
        let moves = data.moves;
        clearStats();
        showStats(stats);
        showMoves(moves);
        setType(type);
        searchEvolutionChain(id);
        let namePo = data.name;
        let urlImg = `https://img.pokemondb.net/artwork/large/${namePo}.jpg`;
        changeImg(urlImg, namePo);
    });
}
// fetchPokemon();
const changeImg = (url,namePoke) => {
    const pokeImg = document.getElementById("pokeImg");
    const name = document.getElementById("namePokemon");
    name.value = namePoke.toUpperCase();
    pokeImg.src = url;
}

const searchEvolutionChain = (id) =>{
    let url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
    fetch(url).then((res) => {
        if (res.status != "200") {
            console.log("No se pudo acceder a" + url);
        } else {
            // console.log(res);
            return res.json();
        }
    }).then((data) => {
        let urlChain = data.evolution_chain.url;
        searchEvolution(urlChain)
    });
}

const searchEvolution = (url) =>{
    fetch(url).then((res) => {
        if (res.status != "200") {
            console.log("No se pudo acceder a" + url);
        } else {
            return res.json();
        }
    }).then((data) => {
        var specie = data.chain.species.name;
        let base = document.getElementById("pokeIni");
        base.value = specie;
        let cont1 = 0, cont2 = 0;
        if (data.chain.evolves_to.length > 0) {
            data.chain.evolves_to.forEach(evolution => {
                let pokeImg1 = document.getElementById("evo" + (cont1 += 1));
                pokeImg1.value = evolution.species.name;
            });
            if (data.chain.evolves_to[0].evolves_to.length > 0) {
                data.chain.evolves_to[0].evolves_to.forEach(element => {
                    let pokeImg2 = document.getElementById("evo" + (cont1 += 1));
                    pokeImg2.value = element.species.name;
                });
            }
        }
        showEvo(cont1);
    });
}

const showEvo = (cant) => {
    var title = document.getElementById("titleEvo");
    title.classList.remove("d-none");
    var pokeIni = document.getElementById("pokeIni");
    var pokeIniImg = document.getElementById("imgPokeIni");
    let urlImgIni = `https://img.pokemondb.net/artwork/large/${pokeIni.value}.jpg`;
    pokeIniImg.src = urlImgIni;
    pokeIni.classList.remove("d-none");
    var imgPokeIni = document.getElementById("imgPokeIni");
    imgPokeIni.classList.remove("d-none");
    for (var i = 1; i <= cant; i++) {
        var element = document.getElementById("evo"+i);
        element.classList.remove("d-none");
        let urlImg = `https://img.pokemondb.net/artwork/large/${element.value}.jpg`;
        var elementImg = document.getElementById("imgEvo" + i);
        elementImg.src = urlImg;
        elementImg.classList.remove("d-none");
    }
}

const hideElements = () => {
    let tipo = document.getElementById("titleTipo");
    tipo.classList.add("d-none");
    var title = document.getElementById("titleEvo");
    title.classList.add("d-none");
    var pokeIni = document.getElementById("pokeIni");
    pokeIni.classList.add("d-none");
    var imgPokeIni = document.getElementById("imgPokeIni");
    imgPokeIni.classList.add("d-none");
    var type1 = document.getElementById("type1");
    type1.classList.add("d-none");
    var type2 = document.getElementById("type2");
    type2.classList.add("d-none");
    var lblType1 = document.getElementById("lblType1");
    lblType1.classList.add("d-none");
    var lblType2 = document.getElementById("lblType2");
    lblType2.classList.add("d-none");
    var stadistics = document.getElementById("titleStadistics");
    stadistics.classList.add("d-none");
    var moves = document.getElementById("titleMoves");
    moves.classList.add("d-none");
    let stats = document.getElementById("statsPoke");
    stats.classList.add("d-none");
    let movesContainer = document.getElementById("movesPoke");
    movesContainer.classList.add("d-none");
    for (var i = 1; i <= 8; i++) {
        var element = document.getElementById("evo"+i);
        element.classList.add("d-none");
        var elementImg = document.getElementById("imgEvo"+i);
        elementImg.classList.add("d-none");
    }
}

const setType = (types) => {
    let cont = 0;
    let tipo = document.getElementById("titleTipo");
    tipo.classList.remove("d-none");
    types.forEach(element => {
        cont += 1;
        let tipo = element.type.name;
        let srcImgType = `./assets/types/${tipo}.svg`;
        let imgType = document.getElementById("type" + cont);
        let labelImg = document.getElementById("lblType" + cont);
        labelImg.textContent = tipo.toLowerCase();
        labelImg.classList.remove("d-none");
        imgType.classList.remove("d-none");
        imgType.src = srcImgType;
        imgType.tooltip = "" + tipo;
        var stadistics = document.getElementById("titleStadistics");
        stadistics.classList.remove("d-none");
        //console.log(tipo);
    });
}

const showStats = (stats) => {
    stats.forEach(element => {
        let data = document.getElementById("" + element.stat.name);
        data.textContent = data.textContent + element.base_stat;
    });
    let statsContainer = document.getElementById("statsPoke");
    statsContainer.classList.remove("d-none");
    statsContainer.classList.add("d-block");
}

const clearStats = () => {
    let hp = document.getElementById("hp");
    let attack = document.getElementById("attack");
    let defense = document.getElementById("defense");
    let special_attack = document.getElementById("special-attack");
    let special_defense = document.getElementById("special-defense");
    let speed = document.getElementById("speed");

    hp.textContent = "HP: ";
    attack.textContent = "Attack: ";
    defense.textContent = "Defense: ";
    special_attack.textContent = "Sp. Atk: ";
    special_defense.textContent = "Sp. Def: ";
    speed.textContent = "Speed: ";
    for (let index = 0; index < 6; index++) {
        let move = document.getElementById("move" + (index + 1));
        move.textContent = "";
    }
}
const showMoves = (moves) => {
    var movesTitle = document.getElementById("titleMoves");
    movesTitle.classList.remove("d-none");
    let movesContainer = document.getElementById("movesPoke");
    movesContainer.classList.remove("d-none");
    if (moves.length<6) {
        for (let index = 0; index < moves.length; index++) {
        var move = document.getElementById("move" + (index + 1));
        move.textContent = moves[index].move.name;
        move.classList.remove("d-none");
        }
    }else {
        for (let index = 0; index < 6; index++) {
            var move = document.getElementById("move" + (index + 1));
            move.textContent = moves[index].move.name;
            move.classList.remove("d-none");
        }
    }
}

