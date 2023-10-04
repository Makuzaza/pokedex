const content = document.querySelector(".pokedex");
let pokeData = [];

const fetchData = async () => {
await
  fetch("https://pokeapi.co/api/v2/pokemon?limit=121&offset=0")
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
                };
            });
        });
        Promise.all(fetches).then((res) => {
            pokeData = res;
            pokeCards(pokeData);
            // pokeData = data.results;
            console.log(pokeData)
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
      </div>`;
  }).join('');
  
  content.innerHTML = cards;
};

const getTypeString = (type) => {
    return `<p>${type.type.name}</p>`;
}

fetchData();

const searchInput = document.getElementById('search');
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredData = pokeData.filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm));
    pokeCards(filteredData);
});
