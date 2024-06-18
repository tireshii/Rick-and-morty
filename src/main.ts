document.addEventListener("DOMContentLoaded", async () => {
    const BASE_URL = 'https://rickandmortyapi.com';
    let currentPage = 1;
    let totalPages = 1;
    const characterList = document.getElementById("content") as HTMLElement;
    const error = document.getElementById("error") as HTMLElement;
    const prevBtns = document.querySelectorAll(".previous") as NodeListOf<HTMLButtonElement>;
    const nextBtns = document.querySelectorAll(".next") as NodeListOf<HTMLButtonElement>;
    const searchInput = document.getElementById("searchInput") as HTMLInputElement;
    const genderFilter = document.getElementById("genderFilter") as HTMLOptionElement;
    const speciesFilter = document.getElementById("speciesFilter") as HTMLOptionElement;
    const statusFilter = document.getElementById("statusFilter") as HTMLOptionElement;
    const applyFilters = document.getElementById("applyFilters") as HTMLButtonElement;
    const characterModal = document.getElementById("character-modal") as HTMLDivElement;
    const modalContent = document.getElementById("modal-content") as HTMLDivElement;
    const modalClose = document.querySelector(".modal .close") as HTMLSpanElement;
    
    const fetchCharacters = async (page: number) => {
        try {
            const name = searchInput.value.trim();
            const gender = genderFilter.value;
            const species = speciesFilter.value;
            const status = statusFilter.value;

            let url = `${BASE_URL}/api/character/?page=${page}`;
            url += name ? `&name=${name}` : "";
            url += gender ? `&gender=${gender}` : "";
            url += species ? `&species=${species}` : "";
            url += status ? `&status=${status}` : "";
            
            const response = await fetch(url);
            const data = await response.json() as APIResponseOk | APIResponseError;

            characterList.innerHTML = "";
            error.textContent = "";
            if ('error' in data) {
                totalPages = 1;
                error.textContent = "Не найдено";
            } else {
                totalPages = data.info.pages ?? 1;
                data.results.forEach(character => {;
                    const card = createCard(character);
                    characterList.appendChild(card);
                });
            }

        } catch (error) {
            error.textContent = `Ошибка: ${error}`;
        }
    }
    const openModal = async (characterId: number) => {
        try {
            const response = await fetch(`${BASE_URL}/api/character/${characterId}`);
            const character: Character = await response.json();

            modalContent.innerHTML = "";
            const card = createModal(character);
            modalContent.appendChild(card);
            characterModal.style.display = "block";
            
        } catch (error) {
            console.error("Error fetching character details", error);
        }
    }

    const createModal = (character: Character) => {
        const modal = document.createElement("div");
        modal.classList.add("modal-card");

        const modalText = document.createElement("div");
        modalText.classList.add("modal-text");

        const image = document.createElement("img");
        image.src = character.image;
        image.alt = character.name;

        const name = document.createElement("h2");
        name.textContent = character.name;

        const status = document.createElement("h3");
        status.textContent = `Status: ${character.status}`;

        const species = document.createElement("h3");
        species.textContent = `Species: ${character.species}`;

        const gender = document.createElement("h3");
        gender.textContent = `Gender: ${character.gender}`;

        const location = document.createElement("h3");
        location.textContent = `Last known location: ${character.location.name}`;

        modal.appendChild(image);
        modalText.appendChild(name);
        modalText.appendChild(status);
        modalText.appendChild(species);
        modalText.appendChild(gender);
        modalText.appendChild(location);
        modal.appendChild(modalText);

        return modal;
    };

    const createCard = (character: Character) => {
        const card = document.createElement("div");
        card.classList.add("card");

        const image = document.createElement("img");
        image.src = character.image;
        image.alt = character.name;

        const name = document.createElement("h2");
        name.textContent = character.name;

        card.appendChild(image);
        card.appendChild(name);

        card.addEventListener("click", () => {
            openModal(character.id);
        })

        return card;
    };

    prevBtns.forEach(prevBtn => {
        prevBtn.addEventListener("click", () => {
            if(currentPage > 1){
                currentPage--;
                fetchCharacters(currentPage);
            }
        })
    })

    nextBtns.forEach(nextBtn => {
        nextBtn.addEventListener("click", () => {
            if(currentPage < totalPages){ 
                currentPage++;
                fetchCharacters(currentPage);
            }
        });
    });

    let timer: number;
    searchInput.addEventListener("input", () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            currentPage = 1;
            fetchCharacters(currentPage);
        }, 500);
    });

    applyFilters.addEventListener("click", () => {
        currentPage = 1;
        fetchCharacters(currentPage);
    });

    modalClose.addEventListener("click", () => {
        characterModal.style.display = "none";
    });

    fetchCharacters(currentPage); 
});
