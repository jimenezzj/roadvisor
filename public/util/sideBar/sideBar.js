const sideBarWrapper = document.createElement('div');
const sectionsWrapper = document.createElement('div');
const logoWrapper = document.createElement('div');
const logoImage = document.createElement('img');
let sideBarStatus = 'short';

const createSidebar = (sections) => {
    // const hamburger = document.createElement('div');
    // hamburger.classList.add('hamburger');
    sideBarWrapper.classList.add('navbarWrapper', 'navbarWrapper--short');
    logoWrapper.classList.add('logoWrapper');
    sectionsWrapper.classList.add('sectionsWrapper');

    logoImage.classList.add('logoImage');
    logoImage.src = window.location.protocol + '//'
        + window.location.hostname + ':' + window.location.port
        + '/assets/images/logo/Roadvisor_white.png';


    generateSections(sections).forEach(linkEle => {
        sectionsWrapper.appendChild(linkEle);
    });

    logoWrapper.appendChild(logoImage);
    sideBarWrapper.appendChild(logoWrapper);
    sideBarWrapper.appendChild(sectionsWrapper);

    if (sideBarStatus === 'short') {
        [...sectionsWrapper.children].forEach(link => {
            link.getElementsByClassName('linkText')[0].classList.add('linkText--hide');
        });
        // logoWrapper.onclick = expandSidebar;
        sectionsWrapper.classList.add('sectionsWrapper--squeezed');
        logoWrapper.classList.add('logoWrapper--show');
    }
    if (sideBarStatus === 'long') {
        sectionsWrapper.classList.add('sectionsWrapper--expanded');
        // logoWrapper.onclick = squeezeSidebar;
        logoImage.classList.toggle('logoImage--show');
    }

    return sideBarWrapper;
};

/*{
    name: 'Usuarios',
    icon: 'person',
    href: '/modules/users/gregarUsuarioRuta/gregarUsuarioRuta.html'
}*/
const generateSections = (secs) => {
    const iconWrapper = document.createElement('div');
    iconWrapper.classList.add('iconWrapper');
    if (sideBarStatus === 'short') iconWrapper.classList.add('iconWrapper--squeezed');
    if (sideBarStatus === 'long') iconWrapper.classList.add('iconWrapper--expanded');
    const btnSection = document.createElement('a');
    btnSection.classList.add('link');
    return secs.map(sec => {
        const { name, icon, href, active } = sec;
        const newIconWrapper = iconWrapper.cloneNode(true);
        const newBtn = btnSection.cloneNode(true);
        const iconTag = document.createElement('i');
        iconTag.classList.add('material-icons', 'sideBarIcon');
        const titleSection = document.createElement('span');
        titleSection.classList.add('linkText');
        titleSection.innerHTML = name;
        iconTag.innerHTML = icon;
        newBtn.setAttribute('href', href);
        if (active) {
            newIconWrapper.classList.add('link--active');
            iconTag.classList.add('iconTag--active');
            titleSection.classList.add('linkText--active')
        }
        newBtn.appendChild(iconTag);
        newBtn.appendChild(titleSection);
        newIconWrapper.appendChild(newBtn);
        return newIconWrapper;
    });
}



const expandSidebar = () => {
    const sideBarW = document.querySelector('.navbarWrapper');
    const sideBarL = document.querySelector('.logoWrapper');
    sideBarW.classList.remove('navbarWrapper--short');
    sideBarW.classList.add('navbarWrapper--long');
    // if (!!sideBarL.onclick) sideBarL.onclick = squeezeSidebar;
    sectionsWrapper.classList.remove('sectionsWrapper--squeezed');
    sectionsWrapper.classList.add('sectionsWrapper--expanded');
    logoImage.classList.toggle('logoImage--show');
    logoWrapper.classList.toggle('logoWrapper--show');
    hamburgerTopNav.onclick = squeezeSidebar;

    [...sectionsWrapper.querySelectorAll('.linkText')].forEach(linkText => {
        linkText.classList.remove('linkText--hide');
        linkText.classList.add('linkText--show');
    });

    [...sectionsWrapper.querySelectorAll('.iconWrapper')].forEach(iconWrapper => {
        iconWrapper.classList.remove('iconWrapper--squeezed');
        iconWrapper.classList.add('iconWrapper--expanded');
    });

    sideBarStatus = 'long';
};

const squeezeSidebar = () => {
    const sideBarW = document.querySelector('.navbarWrapper');
    const sideBarL = document.querySelector('.logoWrapper');
    sideBarW.classList.remove('navbarWrapper--long');
    sideBarW.classList.add('navbarWrapper--short');
    // if (!!sideBarL.onclick) sideBarL.onclick = expandSidebar;
    sectionsWrapper.classList.remove('sectionsWrapper--expanded');
    sectionsWrapper.classList.add('sectionsWrapper--squeezed');
    logoImage.classList.toggle('logoImage--show');
    logoWrapper.classList.toggle('logoWrapper--show');
    hamburgerTopNav.onclick = expandSidebar;


    [...sectionsWrapper.querySelectorAll('.linkText')].forEach(linkText => {
        linkText.classList.remove('linkText--show');
        linkText.classList.add('linkText--hide');
    });

    [...sectionsWrapper.querySelectorAll('.iconWrapper')].forEach(iconWrapper => {
        iconWrapper.classList.remove('iconWrapper--expanded');
        iconWrapper.classList.add('iconWrapper--squeezed');
    });

    sideBarStatus = 'short';
};

// createSidebar([
//     {
//         name: 'Usuarios',
//         icon: 'account_circle',
//         href: '#',
//         active: true
//     }
// ]);

