const generationButtons = document.querySelectorAll('button');
const content = document.querySelector(".pokedex");
let pokeData = [];

const fetchData = () => {
  fetch("https://pokeapi.co/api/v2/pokemon?limit=300&offset=0")
    .then((response) => response.json())
    .then((data) => { 
        const fetches = data.results.map((item) => {
            return fetch(item.url).then(res => res.json())
            .then(data => {
                return {
                    id: data.id,
                    name: data.name,
                    img: data.sprites.other['official-artwork'].front_default,
                    types: data.types,
                    height: data.height * 10,
                    weight: data.weight / 10
                };
            });
        });
        Promise.all(fetches).then((res) => {
            pokeData = res;
            pokeCards(pokeData);
            // pokeData = data.results;
            // console.log(pokeData)
        });
    });
};

const pokeCards = (filteredData) => {
const cards = filteredData.map((pokemon) => {
//   const cards = pokeData.map((pokemon) => {
    // console.log(pokemon.types);
      return `
      <div class="box">
            <img class="img_pokemon" src="${pokemon.img}" />
            <div class="number">${pokemon.id}</div>
            <h2>${pokemon.name}</h2>
            <div class="types">
                ${pokemon.types.map((type) => getTypeString(type)).join('')}
            </div>
            <div class="types">
            <div>${pokemon.height} cm</div><div> ${pokemon.weight} kg</div>
            </div>
        </div>`;
  }).join('');
  
  content.innerHTML = cards;
};

const getTypeString = (type) => {
    return `<p>${type.type.name}</p>`;
}

const searching = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredData = pokeData.filter(pokemon => {
        const choosingName = pokemon.name.toLowerCase().includes(searchTerm);
        const choosingType = pokemon.types.some(type => type.type.name.toLowerCase().includes(searchTerm));
        return choosingName || choosingType;
    });
    pokeCards(filteredData);
}

const searchInput = document.getElementById('search');
searchInput.addEventListener('input', searching);

generationButtons.forEach(button => {
    button.addEventListener('click', () => pushButtons(button));
});

const pushButtons = async (button) => {
    const selectedGeneration = button.textContent;
    const generationNumber = selectedGeneration.replace('Gen', '').trim(); 
    const generationAnswer = await fetch(`https://pokeapi.co/api/v2/generation/${generationNumber}/`);
    const generationData = await generationAnswer.json();
    const pokemonNumber = generationData.pokemon_species.length;
    const generationCount = document.getElementById('generation_count');
    generationCount.textContent = `Number of Pokemons in ${selectedGeneration}: ${pokemonNumber}`;
    const pokemonList = generationData.pokemon_species;
    const fetches = pokemonList.map((species) => {
        return fetch(species.url)
        .then(res => res.json())
        .then(data => {
            return {
                id: data.id,
                name: data.name,
                img: data.sprites.other['official-artwork'].front_default,
                types: data.types,
                height: data.height * 10,
                weight: data.weight / 10
            };
        });
    });
    // const pokeData = await Promise.all(fetches);
    // pokeCards(pokeData);
    // console.log(pokeData)
    Promise.all(fetches).then((res) => {
        pokeData = res;
        pokeCards(pokeData);
        console.log(res); 
    });
}

// const pushButtons = async (button) => {
//     const selectedGeneration = button.textContent;
//     const generationAnswer = await fetch(`https://pokeapi.co/api/v2/generation/`);
//     const generationData = await generationAnswer.json();
//     const pokemonNumber = generationData.pokemon_species.length;
//     const generationNumber = document.getElementById('generation_count');
//     generationNumber.textContent = `Number of Pokémon in ${selectedGeneration}: ${pokemonNumber}`;
//     const pokemonList = generationData.pokemon_species;
//     const fetches = pokemonList.map((species) => {
//         return fetch(species.url)
//         .then(res => res.json())
//         .then(data => {
//             return {
//                 id: data.id,
//                 name: data.name,
//                 img: data.sprites.other['official-artwork'].front_default,
//                 types: data.types,
//                 height: data.height * 10,
//                 weight: data.weight / 10
//             };
//         });
//     });
//     const pokeData = await Promise.all(fetches);
//     pokeCards(pokeData);
//     console.log(pokeData)
// }

fetchData();