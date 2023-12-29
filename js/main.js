"use strict";
const imageWrapper = document.querySelector(".images"), searchInput = document.querySelector(".search input"), searchBtn = document.querySelector(".search button"), loadMoreBtn = document.querySelector(".gallery .load-more"), lightbox = document.querySelector(".lightbox"), downloadImgBtn = lightbox.querySelector(".uil-import"), closeImgBtn = lightbox.querySelector(".close-icon");
const apiKey = "VpzPC2sMqGJ7nkwaVSOrTHMITGa3QBCK8E7ldbBX7DEKYP3rSi45m2Ir", perPage = 15;
let currentPage = 1, searchTerm = null;
const generateHTML = (images) => {
    imageWrapper.innerHTML += images.map((img) => `<li class="card">
                <img onclick="showLightbox('${img.photographer}', '${img.src.large2x}')" src="${img.src.large2x}" alt="img">
                <div class="details">
                    <div class="photographer">
                        <i class="uil uil-camera"></i>
                        <span>${img.photographer}</span>
                    </div>
                    <button onclick="downloadImg('${img.src.large2x}');">
                        <i class="uil uil-import"></i>
                    </button>
                </div>
            </li>`).join("");
};
const getImages = (apiURL) => {
    searchInput.blur();
    loadMoreBtn.innerText = "Loading...";
    loadMoreBtn.classList.add("disabled");
    fetch(apiURL, {
        headers: { Authorization: apiKey }
    })
        .then(res => res.json())
        .then(data => {
        console.log(data);
        if (data.photos.length > 0 && data.page >= 1) {
            generateHTML(data.photos);
            loadMoreBtn.innerText = "Load More";
            loadMoreBtn.classList.remove("disabled");
        }
        else if (data.photos.length == 0 && data.page > 1) {
            Swal.fire({
                title: "Failed To Load More Images!",
                text: "Currently, the displayed images are the only ones available.",
                icon: "error",
                confirmButtonText: 'Ok',
                allowOutsideClick: false,
            });
            loadMoreBtn.innerText = "Load More";
            loadMoreBtn.classList.add("disabled");
        }
        else {
            Swal.fire({
                title: "Failed To Load Images!",
                text: "There are no images matching your search. Please try another words!",
                icon: "error",
                confirmButtonText: 'Ok',
                allowOutsideClick: false,
            });
            loadMoreBtn.innerText = "Load More";
            loadMoreBtn.classList.add("disabled");
        }
    })
        .catch(() => {
        Swal.fire({
            title: "Failed To Load Images!",
            text: "It seems that there is an error, possibly due to a connection issue or something else. Please reload the page and try again.",
            icon: "error",
            confirmButtonText: 'Reload',
            allowOutsideClick: false,
        }).then((result) => {
            if (result.isConfirmed) {
                location.reload();
            }
        });
    });
};
getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
const loadMoreImages = () => {
    currentPage++;
    let apiUrl = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    apiUrl = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiUrl;
    getImages(apiUrl);
};
const loadSearchImages = (e) => {
    let val = searchInput.value.replace(/\s+/g, ' ');
    if (val === "" || val == null || val.trim() == '')
        return searchTerm = null;
    if (e.key === "Enter" || e.target.id === 'searchButton') {
        currentPage = 1;
        searchTerm = val;
        imageWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=1&per_page=${perPage}`);
    }
};
const showLightbox = (name, img) => {
    const imageElement = lightbox.querySelector("img");
    imageElement.src = img;
    const spanElement = lightbox.querySelector("span");
    spanElement.innerText = name;
    downloadImgBtn.setAttribute("data-img", img);
    lightbox.classList.add("show");
    document.body.style.overflow = "hidden";
};
const hideLightbox = () => {
    lightbox.classList.remove("show");
    document.body.style.overflow = "auto";
};
const downloadImg = (imgUrl) => {
    fetch(imgUrl)
        .then(res => res.blob())
        .then(blob => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${new Date().getTime()}`;
        a.click();
    }).catch(() => {
        Swal.fire({
            title: "Failed To Download Image!",
            text: "Please Try Again Later!",
            icon: "error",
            confirmButtonText: 'Ok',
            allowOutsideClick: false,
        });
    });
};
loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
searchBtn.addEventListener("click", loadSearchImages);
closeImgBtn.addEventListener("click", hideLightbox);
downloadImgBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img));
