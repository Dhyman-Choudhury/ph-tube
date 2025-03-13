const showLoader = () =>{
    document.getElementById("loader").classList.remove("hidden")
    document.getElementById("category_container").classList.add("hidden")
}
const hideLoader = () =>{
    document.getElementById("loader").classList.add("hidden")
    document.getElementById("category_container").classList.remove("hidden")
}
function removeActiveClass(){
   const activeButtons = document.getElementsByClassName("active");
    for(let btn of activeButtons){
        btn.classList.remove("active");
    }
   
}
function loadCategories(){
    // 1- fetch the data
    fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    
    // 2- convert promise to json
    .then(res => res.json())

    // 3- send data to display category
    .then(data => displayCategory(data.categories))
}

function loadVideos(searchText = ""){
    showLoader();
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
    .then(res => res.json())
    .then(data =>{ 
    removeActiveClass();
    document.getElementById("btn_all").classList.add("active");
    showVideos(data.videos)})
}
/**
 * "category_id": "1001"
 * "category": "Music"
 * "category_id": "1003"
 * "category": "Comedy"
 * "category_id": "1005"
 * "category": "Drawing"
 */

const loadCategoriesVideos = (id) => {
    showLoader();
    const url = `
    https://openapi.programming-hero.com/api/phero-tube/category/${id}`;
    
    fetch(url)
    .then(res => res.json())
    .then(data => {
        removeActiveClass();
        const clickButton = document.getElementById(`btn_${id}`);
        clickButton.classList.add("active")
        showVideos(data.category)})
}

const loadVideoDetails = (videoID) => {
    //    console.log(videoID);
       const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoID}`;
       fetch(url)
       .then((res) => res.json())
       .then((data) => displayVideoDetails(data.video) )
}
const displayVideoDetails = (video) => {
       console.log(video)
       document.getElementById("video_details").showModal();
       const detailsContainer = document.getElementById("details_container");
       detailsContainer.innerHTML=`
      <div class="card bg-base-100 image-full  shadow-sm">
  <figure>
    <img
      src="${video.thumbnail}"
      alt="Shoes" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">Card Title</h2>
    <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
    <div class="card-actions justify-end">
     
    </div>
  </div>
</div>
`
}
function displayCategory(categories){
    // get the container 
    const categoryContainer = document.getElementById("category_container")
    
    // Loop operation on Array of object
    for(let cat of categories){
        // console.log(cat)
         // create Element 
         const categoryDiv = document.createElement("div");
         categoryDiv.innerHTML = `
          <button id="btn_${cat.category_id}" onclick="loadCategoriesVideos(${cat.category_id})" class="btn btn-sm hover:bg-[#FF1F3D] hover:text-white">${cat.category}</button>
         `
     //  Append the Element
     categoryContainer.append(categoryDiv);
    }
     
    // console.log(categories);
}

const showVideos = (videos) =>{
    
    const videoContainer = document.getElementById("video_container");
    videoContainer.innerHTML = "";
   
    if(videos.length == 0){
        videoContainer.innerHTML = `
        <div class="py-20 col-span-full mx-auto text-center flex flex-col justify-center items-center">
             <img class="w-[120px]" src="./assets/Icon.png" alt="">
             <h2 class="font-bold text-[32px] ">Oops!! Sorry, There is no <br> content here</h2>
        </div>
        `;
        hideLoader();
        return;

    }
    videos.forEach( (video)=>{
        
        const videoCart = document.createElement("div")
        videoCart.innerHTML=`
        <div class="card bg-base-100 ">
           <figure class="relative">
           <img class="w-full h-[150px] object-cover" src="${video.thumbnail}" alt="Shoes" />
           <span class="absolute bottom-2 right-2 text-white bg-black p-2 rounded-xl text-sm">3hrs 56 min ago</span>
           </figure>
           <div class="py-5 flex gap-3 px-0">
              <div class="profile">
                    <div class="avatar">
                        <div class="ring-primary ring-offset-base-100 w-8 rounded-full ring ring-offset-2">
                          <img src="${video.authors[0].profile_picture}" />
                        </div>
                    </div>
                </div>
                <div class="intro">
                    <h2 class="text-sm font-semibold"> ${video.title}</h2>
                    <p class="text-sm text-gray-400 flex gap-1">${video.authors[0].profile_name} ${video.authors[0].verified == true? `<img class="w-5 h-5" src="https://img.icons8.com/?size=96&id=98A4yZTt9abw&format=png" alt="">` : ``}</p>
                    <p class="text-sm text-gray-400">${video.others.views} views</p>
                </div>
            </div>
            <button onclick="loadVideoDetails('${video.video_id}')" class="btn btn-block">Show Details</button>
        </div>
        `
        // append
        videoContainer.append(videoCart)
    });
    hideLoader();
}

document.getElementById("search_input").addEventListener('keyup', (event)=>{
  const input = event.target.value;
  loadVideos(input)
});
loadCategories();
/**
 * {
    "category_id": "1001",
    "video_id": "aaad",
    "thumbnail": "https://i.ibb.co/f9FBQwz/smells.jpg",
    "title": "Smells Like Teen Spirit",
    "authors": [
        {
            "profile_picture": "https://i.ibb.co/k4tkc42/oliviar-harris.jpg",
            "profile_name": "Oliver Harris",
            "verified": true
        }
    ],
    "others": {
        "views": "5.4K",
        "posted_date": "1672656000"
    },
    "description": "'Smells Like Teen Spirit' by Oliver Harris captures the raw energy and rebellious spirit of youth. With over 5.4K views, this track brings a grunge rock vibe, featuring powerful guitar riffs and compelling vocals. Oliver's verified profile guarantees a quality musical journey that resonates with fans of dynamic, high-energy performances."
}
 */