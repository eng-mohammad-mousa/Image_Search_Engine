declare var Swal: any;

const
    imageWrapper = document.querySelector(".images") as HTMLElement,

    searchInput = document.querySelector(".search input") as HTMLInputElement,
    searchBtn = document.querySelector(".search button") as HTMLElement,
    loadMoreBtn = document.querySelector(".gallery .load-more") as HTMLElement,

    lightbox = document.querySelector(".lightbox") as HTMLElement,

    downloadImgBtn = lightbox.querySelector(".uil-import") as HTMLElement,
    closeImgBtn = lightbox.querySelector(".close-icon") as HTMLElement;

// API key, pagination, searchTerm variables
const
    apiKey: string = "VpzPC2sMqGJ7nkwaVSOrTHMITGa3QBCK8E7ldbBX7DEKYP3rSi45m2Ir",
    perPage: number = 15;

let
    currentPage: number = 1,
    searchTerm: any = null;


// Making li of all fetched images and adding them to the existing image wrapper
const generateHTML = (images: string[]) => {

    imageWrapper.innerHTML += images.map((img: any) =>
        `<li class="card">
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
            </li>`
    ).join("");
}

const getImages = (apiURL: string) => {
    // Fetching images by API call with authorization header

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

            } else if (data.photos.length == 0 && data.page > 1) {
                Swal.fire({
                    title: "Failed To Load More Images!",
                    text: "Currently, the displayed images are the only ones available.",
                    icon: "error",
                    confirmButtonText: 'Ok',
                    allowOutsideClick: false,
                });
                loadMoreBtn.innerText = "Load More";
                loadMoreBtn.classList.add("disabled");
            } else {
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
            }).then((result: any) => {
                if (result.isConfirmed) {
                    location.reload();
                }
            });
        });
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);

const loadMoreImages = () => {
    currentPage++; // Increment currentPage by 1
    // If searchTerm has some value then call API with search term else call default API
    let apiUrl = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    apiUrl = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiUrl;
    getImages(apiUrl);
}

const loadSearchImages = (e: any) => {
    // If the search input is empty, set the search term to null and return from here

     // Remove any excess spaces found and replace them with just one.
    let val: string = searchInput.value.replace(/\s+/g, ' ');

    if (val === "" || val == null || val.trim() == '') return searchTerm = null;
    // If pressed key is Enter or Search btn, update the current page, search term & call the getImages
    if (e.key === "Enter" || e.target.id === 'searchButton') {
        currentPage = 1;
        searchTerm = val;
        imageWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=1&per_page=${perPage}`);
    }
}



const showLightbox = (name: any, img: any) => {
    // Showing lightbox and setting img source, name and button attribute
    const imageElement = lightbox.querySelector("img") as HTMLImageElement;
    imageElement.src = img;

    const spanElement = lightbox.querySelector("span") as HTMLElement;
    spanElement.innerText = name;

    downloadImgBtn.setAttribute("data-img", img);

    lightbox.classList.add("show");
    document.body.style.overflow = "hidden";
}

const hideLightbox = () => {
    // Hiding lightbox on close icon click
    lightbox.classList.remove("show");
    document.body.style.overflow = "auto";
}



const downloadImg = (imgUrl: any): void => {
    // Converting received img to blob, creating its download link, & downloading it
    fetch(imgUrl)

        .then(res => res.blob())

        .then(blob => {
            const a = document.createElement("a") as HTMLAnchorElement;
            a.href = URL.createObjectURL(blob);
            a.download = `${new Date().getTime()}`; // name of photo
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
}

loadMoreBtn.addEventListener("click", loadMoreImages);

searchInput.addEventListener("keyup", loadSearchImages);
searchBtn.addEventListener("click", loadSearchImages);

closeImgBtn.addEventListener("click", hideLightbox);

downloadImgBtn.addEventListener("click", (e) => downloadImg((e.target as HTMLButtonElement).dataset.img));