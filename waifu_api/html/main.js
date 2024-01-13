"use strict"

var HeaderDropDownMenu = true //true opened false closed
var tags = ""
var included_tags = ""
var external_tags = ""
var images = []
var isMobileView

document.addEventListener("DOMContentLoaded", function () {
    if (!window.location.pathname.includes("login.html")) {
        load_logo()
    }
});

function change_theme_color() {
    if (localStorage.theme === 'dark') {
        document.documentElement.classList.remove('dark')
        localStorage.setItem("theme", "light");
        document.getElementById("theme_mode").src = "images/light.png"
    } else{
        localStorage.setItem("theme", "dark");
        document.documentElement.classList.add('dark')
        document.getElementById("theme_mode").src = "images/dark.png"
    }
}
function load_theme_color() {
    if (localStorage.theme === 'dark') {
        document.documentElement.classList.add('dark')
    }
    else {
        document.documentElement.classList.remove('dark')
    }
}load_theme_color()

function load_logo() {
    if (localStorage.theme === 'dark') {
        document.getElementById("theme_mode").src = "images/dark.png"
    }
    else {
        document.getElementById("theme_mode").src = "images/light.png"
    }
}
function DropDownMenu(dropdownMenuID, dropdownButtonID, from, to, IsMobileMenu = false, ArrowID) {
    const dropdownMenu = document.getElementById(dropdownMenuID)
    const dropdownButton = document.getElementById(dropdownButtonID)
    const arrow = document.getElementById(ArrowID)
    if(!IsMobileMenu) {
        document.addEventListener('click', function (event) {
            var target = event.target
            if(!dropdownMenu.contains(target) && !dropdownButton.contains(target)) {
                dropdownMenu.classList.remove('transition', 'ease-out','duration-200');
                dropdownMenu.classList.add('transition', 'ease-in','duration-150');
                dropdownMenu.classList.remove('opacity-100', 'translate-y-0');
                dropdownMenu.classList.add('opacity-0', 'translate-y-1');
                // make the transition finish (if fixed transition doesn't works, absolute does work)
                arrow.classList.remove("rotate-180")
                sleep(150).then(() => {
                    dropdownMenu.classList.remove(to);
                    dropdownMenu.classList.add(from)
                });
                arrow.classList.remove("rotate-180")
                HeaderDropDownMenu = true
            }
          });
    }
    if(HeaderDropDownMenu) {
        dropdownMenu.classList.add('transition', 'ease-out','duration-200');
        dropdownMenu.classList.remove('transition', 'ease-in','duration-150');
        dropdownMenu.classList.remove('opacity-0', 'translate-y-1', from);
        if(!IsMobileMenu) {
            dropdownMenu.classList.add('opacity-100', 'translate-y-0', to);
        }
        else dropdownMenu.classList.add('opacity-100', 'translate-y-0');
        arrow.classList.add("rotate-180")
        HeaderDropDownMenu = false
    }
    else {
        dropdownMenu.classList.remove('transition', 'ease-out','duration-200');
        dropdownMenu.classList.add('transition', 'ease-in','duration-150');
        dropdownMenu.classList.remove('opacity-100', 'translate-y-0');
        dropdownMenu.classList.add('opacity-0', 'translate-y-1');
        arrow.classList.remove("rotate-180")
        // make the transition finish (if fixed transition doesn't works, absolute does work)
        sleep(150).then(() => {
            if(!IsMobileMenu) {
                dropdownMenu.classList.remove(to);
            }
            dropdownMenu.classList.add(from)
        });
        HeaderDropDownMenu = true
    }
  }
  
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function CloseMobileMenu() {
    var mobilemenu = document.getElementById("MobileMenu")
    mobilemenu.classList.add("hidden")
  }

  function OpenMobileMenu() {
    var mobilemenu = document.getElementById("MobileMenu")
    mobilemenu.classList.remove("hidden")
  }

function checkScreenSize() {
    isMobileView = window.matchMedia('(max-width: 1023px)').matches;

    if (isMobileView && localStorage.getItem("screen_mode") != "mobile") {
        localStorage.setItem("screen_mode", "mobile");
        location.reload()
    }
    else if (!isMobileView && localStorage.getItem("screen_mode") != "desktop") {
        localStorage.setItem("screen_mode", "desktop");
        location.reload()
    }
}

// Attach the checkScreenSize function to the resize event
window.addEventListener('resize', checkScreenSize);

// Call the function on initial page load
checkScreenSize();

function getImage(tags = "", included_tags="", is_nsfw=false) {
    const apiUrl = 'https://api.waifu.im/search';
    const params = {
      height: '>=2000',
      many: 'true'
    };
  
    if (tags !== "") {
      params.tags = tags;
    }
    if(included_tags !== "") {
        params.included_tags = included_tags
    }
    if(is_nsfw) {
        params.included_tags = "hentai"
    }
  
    const queryParams = new URLSearchParams(params);
    const requestUrl = `${apiUrl}?${queryParams}`;
  
    return fetch(requestUrl)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Request failed with status code: ' + response.status);
        }
      })
      .catch(error => {
        console.error('An error occurred:', error.message);
      });
}
  
function load_images() {
  getImage(tags, included_tags, false)
    .then(data => {
      // Process the data as needed
      images = data.images
      console.log(data.images);
      createCards()
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error.message);
    });
}
load_images()

function createCards() {
  var index = 0
  var rows_number
  if(isMobileView) {
    rows_number = 15
  }
  else {
    rows_number = 6
  }
  document.getElementById("body").innerHTML = ""
    for(var rows = 0; rows < rows_number; rows++) {
        var row = document.createElement("div")
        var columns_number
        if(isMobileView) {
          row.className = "grid grid-cols-2"
          columns_number = 2
        }
        else {
          row.className = "grid grid-cols-5"
          columns_number = 5
        }
        for(var cols = 0; cols < columns_number; cols++) {
          if(index >= images.length) break 
          document.getElementById("body").className = "grid grid-rows-"+rows+1
            var card = document.createElement("div")
            var img = document.createElement("img")
            img.src = images[index].url
            img.style.objectFit = "cover";
            img.className = "rounded-lg h-full w-full"
            img.loading = "eager";
            card.appendChild(img)
            card.id = index
            card.className = "overflow-hidden m-3 rounded-lg text-center h-fit hover:cursor-pointer shadow-2xl dark:hover:ring-white hover:ring-sky hover:ring"
            card.onclick = function() {
              window.open(images[this.id].url, "_blank");
            }
            row.appendChild(card)
            index++
        }
        document.getElementById("body").appendChild(row)
    }
}

function mobile_set_tag(tag) {
  tags = ""
  included_tags = tag
  load_images()
}

function Set_tags(id) {
  if(document.getElementById(id).classList.value == "hidden") {
    document.getElementById("waifu").classList.value = "hidden"
    document.getElementById("maid").classList.value = "hidden"
    document.getElementById("marin-kitagawa").classList.value = "hidden"
    document.getElementById("raiden-shogun").classList.value = "hidden"
    document.getElementById("oppai").classList.value = "hidden"
    document.getElementById("selfies").classList.value = "hidden"
    document.getElementById("uniform").classList.value = "hidden"
    document.getElementById("hentai").classList.value = "hidden"
    document.getElementById(id).classList.value = ""
    included_tags = id
  }else {
    document.getElementById(id).classList.value = "hidden"
    included_tags=""
    tags=""
  }
  console.log(included_tags)
  load_images()
}

function set_tag(tag) {
  tags = tag
  if(tag == "waifu" || tag == "maid" || tag == "marin-kitagawa" || tag == "raiden-shogun" || tag == "oppai" || tag == "selfies" || tag == "uniform" || tag == "hentai" || tag == "ero" || tag == "ass" || tag == "milf" || tag == "oral" || tag == "paizuri" || tag == "ecchi") {
    included_tags = tag
  }
  load_images()
}