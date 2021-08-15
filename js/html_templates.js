

var url = window.location.pathname,
    level1 = ["research","education","people","production"],
    level2 = ["areas","G370","G572","G575"],
    level = "";

function determineLevel(){
    level1.forEach(function(t){
        let search = url.search(t);
        if (search > 0){
            level = "../"
        }
    })
    level2.forEach(function(t){
        var search = url.search(t);
        if (search > 0){
            level = "../../"
        }
    })
}

determineLevel();

class Header extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
            this.innerHTML = `
                <nav class="navbar navbar-expand-md navbar-light">
                    <div class="container-fluid" id="nav-header">
                        <a class="navbar-brand" href="` + level +`index.html"><img src="` + level +`img/UWCL_logo_white.png" alt="UW Cartography Lab" style="width:80px;height:auto;"></a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#myNavbar" aria-controls="myNavbar" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse w-100 order-3 dual-collapse2" id="myNavbar">
                            <ul class="navbar-nav ms-auto">
                                <li class="nav-item">
                                    <i id="navText" class="spyglass fa fa-search"></i>
                                    <div id="search-container">
                                        <input id="search-form" class="form-control me-2 navbar-search" type="search" placeholder="Search" aria-label="Search">
                                    </div
                                </li>
                                <li class="nav-item">
                                    <a href="` + level +`production/index.html" id="navText">Production</a>
                                </li>
                                <li class="nav-item">
                                    <a href="` + level +`research/index.html" id="navText">Research</a>
                                </li>
                                <li class="nav-item">
                                    <a href="` + level +`education/index.html" id="navText">Education</a>
                                </li>
                                <li class="nav-item">
                                    <a href="` + level +`people/index.html" id="navText">People</a>
                                </li>
                                <li class="nav-item">
                                    <a href="` + level +`github.html" id="navText">Github</a>
                                </li>
                                <li class="nav-item">
                                    <a href="` + level +`sitemap.html" id="navText">Site Map</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            `
        }
  }
  
customElements.define('site-header', Header);

class Footer extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
        this.innerHTML = `
                <footer class="footer navbar-fixed-bottom">
                    <div class="container">
                        <div class="row">
                            <div class="align-center">
                                <br>
                                <img src="` + level +`img/UWCL_logo_gray.png">
                                <p>Copyright 2021&copy; All Rights Reserved.</p>
                            </div>
                        </div>
                    </div>
                </footer>
            `;
        }
  }
  
customElements.define('site-footer', Footer);
