const content = document.querySelector(".pokedex");
let pokeData = [1, 2, 3];

const fetchData = async () => {
await
  fetch("https://pokeapi.co/api/v2/pokemon?limit=121&offset=0")
    .then((response) => response.json())
    .then((data) => { 
        const fetches = data.results.map(item => {
            return fetch(item.url).then(res => res.json())
            .then(data => {
                return {
                    id: data.id,
                    name: data.name,
                    img: data.sprites.other['official-artwork'].front_default,
                    types: data.types,
                };
            });
        });
        Promise.all(fetches).then(res => {
            pokeData = res;
            pokeCards();
            // pokeData = data.results;
            console.log(pokeData)
        });
    });
};

const pokeCards = () => {

  const cards = pokeData.map(pokemon => {
      return `
      <div class="box">
      <img class="img_pokemon" src="${pokemon.img}" />
      <div class="number">${pokemon.id}</div>
      <h2>${pokemon.name}</h2><div class="types">
      <p>Water</p>
      <p>Poison</p>
      </div>
      </div>`;
  }).join('')
  
  content.innerHTML = cards;
};

fetchData();
