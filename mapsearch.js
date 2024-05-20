let mapsUrl = '';

function getSearchQuery() {
    /* return new URLSearchParams(window.location.search)
        .get('q'); */

    

    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    
    // Kontrolli, kas string sisaldab tühikuid
    if (query.includes(' ')) {
        // Asendab kõik tühikud plussmärkidega
        return query.replace(/ /g, '+');
    } else {
        return query;
    }
}

function updateMapsUrl() {
    const searchQuery = getSearchQuery();
    if (searchQuery) {
        /* mapsUrl = 'https://maps.google.com/maps?q=' + encodeURIComponent(searchQuery); */
        mapsUrl = 'https://maps.google.com/maps/place/' + encodeURIComponent(searchQuery);
    }
}

function insertMapsButton() {
    if (!mapsUrl) return;

    let existingMapsButton = Array.from(document.querySelectorAll('a'))
        .find(a => a.textContent.trim() === 'Maps');
    if (existingMapsButton && !existingMapsButton.closest('g-popup')) {
        existingMapsButton.href = mapsUrl;
        console.log("Maps button URL updated and no new button added.");
        return;
    }

    let referenceAnchor;
    const jsnameBvqjv = Array.from(document.querySelectorAll('div[jsname="bVqjv"]'))
        .find(div => div.closest('a'));
    if (jsnameBvqjv) {
        referenceAnchor = jsnameBvqjv.closest('a');
    }

    if (!referenceAnchor) {
        referenceAnchor = document.querySelector("div[role='navigation'] div[jsslot] a");
    }

    if (!referenceAnchor) {
        const imagesButton = Array.from(document.querySelectorAll('a'))
            .find(link => link.textContent.includes('Images'));
        if (imagesButton) {
            referenceAnchor = imagesButton;
        } else {
            console.log("Images text not found. Unable to insert Maps button. Probably language is not set to English.");
            return;
        }
    }

    const mapsAnchor = referenceAnchor.cloneNode(true);
    mapsAnchor.href = mapsUrl;
    mapsAnchor.style.marginLeft = '6px';

    const spanOrDiv = mapsAnchor.querySelector('span') || mapsAnchor.querySelector('div');
    if (spanOrDiv) {
        spanOrDiv.textContent = 'Maps';
    }

    referenceAnchor.parentNode.insertBefore(mapsAnchor, referenceAnchor.nextSibling);
}

function setMapImageLink() {
    if (!mapsUrl) return;

    const luMapElement = document.querySelector('#lu_map');
    if (luMapElement) {
        const parentAnchor = luMapElement.parentNode.tagName.toLowerCase() === 'a' ? luMapElement.parentNode : null;
        if (parentAnchor) {
            if (!parentAnchor.href || parentAnchor.href.trim() === "") {
                parentAnchor.href = mapsUrl;
            }
        } else {
            const newAnchor = document.createElement('a');
            newAnchor.href = mapsUrl;
            luMapElement.parentNode.insertBefore(newAnchor, luMapElement);
            newAnchor.appendChild(luMapElement);
        }
    } else {
        const fallbackDiv = document.querySelector('div.V1GY4c');
        if (fallbackDiv) {
            const imgElement = fallbackDiv.querySelector('img');
            if (imgElement && !imgElement.closest('a[href]:not([href=""]):not([href=" "])')) {
                const newAnchor = document.createElement('a');
                newAnchor.href = mapsUrl;
                fallbackDiv.insertBefore(newAnchor, imgElement);
                newAnchor.appendChild(imgElement);
            }
        }
    }
}

function addMapsShortcut() {
    if (!mapsUrl) return;

    const sodP3bElement = document.querySelector('.SodP3b');
    if (sodP3bElement) {
        let anchor = document.createElement('a');
        anchor.style.position = 'absolute';
        anchor.style.top = '5px';
        anchor.style.left = '5px';
        anchor.style.color = '#333';
        anchor.style.background = '#d5d5d5';
        anchor.style.padding = '10px';
        anchor.style.zIndex = '10';
        anchor.style.borderRadius = '20px';
        anchor.textContent = 'Open in Maps';
        anchor.href = mapsUrl;
        anchor.target = '_blank';
        sodP3bElement.append(anchor);
    }
}


function setupMapsButton() {
    updateMapsUrl();
    insertMapsButton();
    setMapImageLink();
    addMapsShortcut();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMapsButton);
} else {
    setupMapsButton();
}