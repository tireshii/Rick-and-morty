"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    const BASE_URL = 'https://rickandmortyapi.com';
    let currentPage = 1;
    let totalPages = 1;
    const characterList = document.getElementById("content");
    const errorMessage = document.getElementById("error");
    const prevBtns = document.querySelectorAll(".previous");
    const nextBtns = document.querySelectorAll(".next");
    const searchInput = document.getElementById("searchInput");
    const genderFilter = document.getElementById("genderFilter");
    const speciesFilter = document.getElementById("speciesFilter");
    const statusFilter = document.getElementById("statusFilter");
    const applyFilters = document.getElementById("applyFilters");
    const characterModal = document.getElementById("character-modal");
    const modalContent = document.getElementById("modal-content");
    const modalClose = document.querySelector(".modal .close");
    const fetchCharacters = (page) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
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
            const response = yield fetch(url);
            const data = yield response.json();
            characterList.innerHTML = "";
            errorMessage.textContent = "";
            if ('error' in data) {
                totalPages = 1;
                errorMessage.textContent = "Не найдено";
            }
            else {
                totalPages = (_a = data.info.pages) !== null && _a !== void 0 ? _a : 1;
                data.results.forEach(character => {
                    ;
                    const card = createCard(character);
                    characterList.appendChild(card);
                });
            }
        }
        catch (error) {
            errorMessage.textContent = `Ошибка: ${error}`;
        }
    });
    const openModal = (characterId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${BASE_URL}/api/character/${characterId}`);
            const character = yield response.json();
            modalContent.innerHTML = "";
            const card = createModal(character);
            modalContent.appendChild(card);
            characterModal.style.display = "block";
        }
        catch (error) {
            console.error("Error fetching character details", error);
        }
    });
    const createModal = (character) => {
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
    const createCard = (character) => {
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
        });
        return card;
    };
    prevBtns.forEach(prevBtn => {
        prevBtn.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                fetchCharacters(currentPage);
            }
        });
    });
    nextBtns.forEach(nextBtn => {
        nextBtn.addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                fetchCharacters(currentPage);
            }
        });
    });
    let timer;
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
}));
