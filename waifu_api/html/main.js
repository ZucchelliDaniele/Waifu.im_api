"use strict"

var HeaderDropDownMenu = true //true opened false closed
var tags = []
var included_tags = []

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
    const isMobileView = window.matchMedia('(max-width: 1023px)').matches;

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

function getImage(tags = "", included_tags="") {
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
  
  // Example usage
  getImage()
    .then(data => {
      // Process the data as needed
      console.log(data.images);
      createCards()
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error.message);
    });

function createCards() {
    for(var rows = 0; rows < 5; rows++) {
        var row = document.createElement("div")
        for(var cols = 0; cols < 6; cols++) {
            var card = document.createElement("div")
            var span = document.createElement("span")
            span.className = "text-center"
            span.innerHTML = "Card"
            card.appendChild(span)
            card.className = "m-3 rounded-lg shadow-xl text-center bg-white-sky dark:bg-black dark:text-white-gray"
            row.appendChild(card)
        }
        document.getElementById("body").appendChild(row)
    }
}