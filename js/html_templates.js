class Header extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
        /*this.innerHTML = `
                <nav class="navbar">
                    <div class="container-fluid">
                        <div class="navbar-header">
                            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span> 
                            </button>
                            <a class="navbar-brand" href="../index.html"><img src="../img/UWCL_logo_white.png" alt="UW Cartography Lab" style="width:80px;height:auto;"></a>
                        </div>
            
                        <div class="collapse navbar-collapse navbar-right" id="myNavbar">
                            <ul class="nav navbar-nav navText">
                                <li><a href="../production/index.html" id="navText">Production</a></li>
                                <li><a href="../research/index.html" id="navText">Research</a></li>
                                <li><a href="../education/index.html" id="navText">Education</a></li>
                                <li><a href="../people/index.html" id="navText">People</a></li>
                                <li><a href="../sitemap.html" id="navText">Site Map</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
            `;*/
            this.innerHTML = `
                <nav class="navbar navbar-expand-md navbar-light">
                    <div class="container-fluid" id="nav-header">
                        <a class="navbar-brand" href="../index.html"><img src="../img/UWCL_logo_white.png" alt="UW Cartography Lab" style="width:80px;height:auto;"></a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#myNavbar" aria-controls="myNavbar" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse w-100 order-3 dual-collapse2" id="myNavbar">
                            <ul class="navbar-nav ms-auto">
                                <li class="nav-item">
                                    <a href="../production/index.html" id="navText">Production</a>
                                </li>
                                <li class="nav-item">
                                    <a href="../research/index.html" id="navText">Research</a>
                                </li>
                                <li class="nav-item">
                                    <a href="../education/index.html" id="navText">Education</a>
                                </li>
                                <li class="nav-item">
                                    <a href="../people/index.html" id="navText">People</a>
                                </li>
                                <li class="nav-item">
                                    <a href="../people/github.html" id="navText">Github</a>
                                </li>
                                <li class="nav-item">
                                    <a href="../sitemap.html" id="navText">Site Map</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            `
        }
  }
  
customElements.define('site-header', Header);

class Header2 extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
        this.innerHTML = `
            <nav class="navbar navbar-expand-md navbar-light">
                <div class="container-fluid" id="nav-header">
                    <a class="navbar-brand" href="../index.html"><img src="../../img/UWCL_logo_white.png" alt="UW Cartography Lab" style="width:80px;height:auto;"></a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#myNavbar" aria-controls="myNavbar" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse w-100 order-3 dual-collapse2" id="myNavbar">
                        <ul class="navbar-nav ms-auto">
                            <li class="nav-item">
                                <a href="../../production/index.html" id="navText">Production</a>
                            </li>
                            <li class="nav-item">
                                <a href="../../research/index.html" id="navText">Research</a>
                            </li>
                            <li class="nav-item">
                                <a href="../../education/index.html" id="navText">Education</a>
                            </li>
                            <li class="nav-item">
                                <a href="../../people/index.html" id="navText">People</a>
                            </li>
                            <li class="nav-item">
                                    <a href="../..//github.html" id="navText">Github</a>
                                </li>
                            <li class="nav-item">
                                <a href="../../sitemap.html" id="navText">Site Map</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        `;
    }
}
  
customElements.define('site-header-2', Header2);

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
                                <img src="../img/UWCL_logo_gray.png">
                                <p>Copyright 2019&copy; All Rights Reserved.</p>
                            </div>
                        </div>
                    </div>
                </footer>
            `;
        }
  }
  
customElements.define('site-footer', Footer);

class Footer2 extends HTMLElement {
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
                                <img src="../../img/UWCL_logo_gray.png">
                                <p>Copyright 2019&copy; All Rights Reserved.</p>
                            </div>
                        </div>
                    </div>
                </footer>
            `;
        }
  }
  
customElements.define('site-footer-2', Footer2);
  
  