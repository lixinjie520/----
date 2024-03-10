const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const movies = [];
const dataPanel = document.querySelector("#data-panel");
// 每頁顯示12筆資料
const MOVIES_PER_PAGE = 12;
const paginator = document.querySelector("#paginator");
// 8.產生分頁器
function renderPaginator(amount) {
  // 計算總頁數
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE);
  //   製作 template
  let rawHTML = "";
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
  }
  paginator.innerHTML = rawHTML;
}
// 7.分頁顯示,一頁顯示 12 筆資料，使用 slice 方法
function getMoviesByPage(page) {
  // 計算起始index
  const startIndex = (page - 1) * MOVIES_PER_PAGE;
  // 回傳切割後的新陣列
  return movies.slice(startIndex, startIndex + MOVIES_PER_PAGE);
}
// 9.分頁器點擊事件
paginator.addEventListener("click", function onPaginatorClicked(event) {
  //如果被點擊的不是 a 標籤，結束
  if (event.target.tagName !== "A") return;
  //透過 dataset 取得被點擊的頁數
  const page = Number(event.target.dataset.page);
  renderMovieList(getMoviesByPage(page));
});
// 6-1.收藏事件函式
function addToFavorite(id) {
  // 取得電影收藏清單
  const list = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  //  find 方法在找到第一個符合條件的 item 後就會停下來回傳該 item
  const movie = movies.find((movie) => movie.id === id);
  //  若電影已被收藏，則結束函式
  //  some 會回傳「陣列裡有沒有 item 通過檢查條件」
  //  如果電影收藏清單中已存在該電影，則跳出警示並結束函式
  if (list.some((movie) => movie.id === id)) {
    return alert("此電影已經在收藏清單中！");
  }
  // 符合條件的 item 存入 list 陣列
  list.push(movie);
  localStorage.setItem("favoriteMovies", JSON.stringify(list));
}
// 5.搜尋事件
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  // 移除瀏覽器對某些元素[type="submit"]的默認行為，會自動刷新或提交網頁
  event.preventDefault();
  //   取得搜尋關鍵字
  const keyword = searchInput.value.trim().toLowerCase();

  //儲存符合篩選條件的項目
  let filteredMovies = [];
  //   錯誤處理，輸入有效字串
  if (!keyword.length) {
    return alert("請輸入有效字串");
  }
  //   條件篩選 filter方法的參數是一個條件函式，為真的條件才會存到變數 filteredMovies 裡
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  );
  //錯誤處理：無符合條件的結果
  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`);
  }
  renderMovieList(filteredMovies);
});
// 鍵盤搜尋事件
searchForm.addEventListener("keyup", (event) => {
  if (event.key === "ENTER") {
    onSearchFormSubmitted;
  }
});
// 3.點擊模態框監聽事件 6.添加else if收藏事件
dataPanel.addEventListener("click", function onPanelClicked(event) {
  // matches方法判斷被點擊的元素有無特定【類】 ，若有則返回true，否則為false
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id));
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
                        <button class="btn btn-info btn-add-favorite" data-id="${
                          item.id
                        }">+</button>
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
// 1.發送請求資料
axios
  .get(INDEX_URL)
  .then((responses) => {
    // 不能直接將 movies = responses.data.results，因為 const 不能被重新賦值，但可以用 push 方法，但用push方法直接賦值，會讓movies變成長度為 1 的陣列物件，不是我們想要的結果。
    // 將每個電影物件加入movies陣列的方法，主要有 三 種：
    // 第一種：forEach方法
    // responses.data.results.forEach((response) => {
    //   movies.push(response);
    // });
    // console.log(movies);
    // 第二種：for...of 方法
    // for (let response of responses.data.results) {
    //   movies.push(response);
    // }
    // console.log(movies);
    // 第三種：展開運算子（spread operator)
    movies.push(...responses.data.results);
    renderPaginator(movies.length);
    renderMovieList(getMoviesByPage(1));
    // console.log(responses.data.results); //80個元素的陣列
    // console.log("---------------------------");
    // console.log(...responses.data.results); //80個單獨的物件
  })
  .catch((error) => console.log(error));
