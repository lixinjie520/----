const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/movies/";
const POSTER_URL = BASE_URL + "/posters/";
// 電影的資料是從 localStorage 取得
const movies = JSON.parse(localStorage.getItem("favoriteMovies"));
const dataPanel = document.querySelector("#data-panel");

// 刪除收藏電影
function removeFromFavorite(id) {
  // 收藏清單是空的，就結束函式
  if (!movies || !movies.length) return;
  // 要使用 splice 方法刪除，所以需要知道元素的 index
  const movieIndex = movies.findIndex((movie) => movie.id === id);
  // 若找不到，則結束函式
  if (movieIndex === -1) return;
  // 刪除該筆電影
  movies.splice(movieIndex, 1);

  //   存回localStorage
  localStorage.setItem("favoriteMovies", JSON.stringify(movies));

  //   更新頁面
  renderMovieList(movies);
}
// 3.點擊模態框監聽事件 6.添加else if收藏事件
dataPanel.addEventListener("click", function onPanelClicked(event) {
  // matches方法判斷被點擊的元素有無特定【類】 ，若有則返回true，否則為false
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-remove-favorite")) {
    removeFromFavorite(Number(event.target.dataset.id));
  }
});

// 2.渲染電影列表
// 在 More button 中增加 data-id 屬性
function renderMovieList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `
        <div class="col-sm-3">
                <div class="mb-4">
                    <div class="card">
                    <img src="${
                      POSTER_URL + item.image
                    }" class="card-img-top" alt="movie poster" />
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${
                          item.id
                        }">More</button>
                        <button class="btn btn-danger btn-remove-favorite" data-id="${
                          item.id
                        }">x</button>
                    </div>
                </div>
                </div>
            </div>
        `;
  });
  dataPanel.innerHTML = rawHTML;
}

// 4.渲染模態框
function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title");
  const modalImage = document.querySelector("#movie-modal-image");
  const modalDate = document.querySelector("#movie-modal-date");
  const modalDescription = document.querySelector("#movie-modal-description");
  axios.get(INDEX_URL + id).then((responses) => {
    const data = responses.data.results;
    console.log(data);
    modalTitle.innerText = data.title;
    modalDate.innerText = `Release date : ${data.release_date};`;
    modalDescription.innerText = data.description;
    modalImage.innerHTML = `<img
                  src="${POSTER_URL + data.image}"
                  alt="movie-poster"
                  class="img-fluid"
                />`;
  });
}
renderMovieList(movies);
