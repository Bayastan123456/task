const container = document.querySelector(".container__user");
const render = document.querySelector(".render");
const sort = document.querySelector(".sort");
const filterSelect = document.getElementById("filter-select");
const prevPageButton = document.getElementById("prev-page-btn");
const nextPageButton = document.getElementById("next-page-btn");

const usersPerPage = 4;
let currentPage = 1;

// Функция для загрузки и отображения   списка пользователей
function loadUsers() {
  showLoadingIndicator();
  fetch("https://api.escuelajs.co/api/v1/users")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Ошибка при загрузке данных о пользователях");
      }
      return response.json();
    })
    .then((users) => {
      container.innerHTML = "";
      const startIndex = (currentPage - 1) * usersPerPage;
      const endIndex = startIndex + usersPerPage;
      const currentPageUsers = users.slice(startIndex, endIndex);
      currentPageUsers.forEach((user) => {
        const card = document.createElement("div");
        card.classList.add("user-card");
        card.innerHTML = `
        <img src =${user.avatar} alt= ${user.name}>
                  <h2>${user.name}</h2>
                  <p>Email: ${user.email}</p>
                  <p>password: ${user.password}</p>
                  <p>Роль: ${user.role}</p>
              `;
        container.appendChild(card);
      });
      hideLoadingIndicator();
      showPagination();
      updatePaginationButtons();
    })
    .catch((error) => {
      console.error("Произошла ошибка:", error);
      showErrorMessage();
      hideLoadingIndicator();
      hidePagination();
    });
}
// Функция для показа индикатора загрузки
function showLoadingIndicator() {
  const loadingIndicator = document.getElementById("loading-indicator");
  loadingIndicator.style.display = "block";
}

// Функция для скрытия индикатора загрузки
function hideLoadingIndicator() {
  const loadingIndicator = document.getElementById("loading-indicator");
  loadingIndicator.style.display = "none";
}
// Функция для показа сообщения об ошибке
function showErrorMessage() {
  const errorMessage = document.getElementById("error-message");
  errorMessage.style.display = "block";
}

// Функция для скрытия сообщения об ошибке
function hideErrorMessage() {
  const errorMessage = document.getElementById("error-message");
  errorMessage.style.display = "none";
}

// Функция для показа пагинации
function showPagination() {
  const pagination = document.getElementById("pagination");
  pagination.style.display = "block";
}

// Функция для скрытия пагинации
function hidePagination() {
  const pagination = document.getElementById("pagination");
  pagination.style.display = "none";
}

// функция для  сортировки

function sortUsersByName() {
  const userCards = Array.from(container.getElementsByClassName("user-card"));
  const sortedCards = userCards.sort((a, b) => {
    const nameA = a.querySelector("h2").textContent.toLowerCase();
    const nameB = b.querySelector("h2").textContent.toLowerCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });
  container.innerHTML = "";
  sortedCards.forEach((card) => {
    container.appendChild(card);
  });
}

// Функция для фильтрации пользователей по ролям
function filterUsersByRole(role) {
  const userCards = Array.from(container.getElementsByClassName("user-card"));
  userCards.forEach((card) => {
    const userEmail = card
      .querySelector("p:nth-child(3)")
      .textContent.toLowerCase();
    console.log(userEmail);
    if (role === "admin" && userEmail.includes("admin")) {
      card.style.display = "block";
    } else if (role === "customer" && !userEmail.includes("admin")) {
      card.style.display = "block";
    } else if (role === "all") {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

function handleFilterSelectChange() {
  const filterValue = document.getElementById("filter-select").value;
  filterUsersByRole(filterValue);
}

// Пагинация

function updatePaginationButtons() {
  const prevPageButton = document.getElementById("prev-page-btn");
  const nextPageButton = document.getElementById("next-page-btn");

  // Проверка, доступна ли предыдущая страница
  prevPageButton.disabled = currentPage === 1;

  // Проверка, доступна ли следующая страница
  nextPageButton.disabled = currentPage * usersPerPage >= 10;
}

prevPageButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    loadUsers();
  }
});
nextPageButton.addEventListener("click", () => {
  if (currentPage * usersPerPage < 10) {
    currentPage++;
    loadUsers();
  }
});

render.addEventListener("click", () => {
  loadUsers();
});
sort.addEventListener("click", () => {
  sortUsersByName();
});
filterSelect.addEventListener("change", handleFilterSelectChange);

loadUsers();
