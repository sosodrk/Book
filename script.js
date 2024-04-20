const url = './Portfolio_2024.pdf'; // Chemin vers votre PDF

let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumIsPending = null;

// Il n'est plus nécessaire de définir une échelle globale ici
const canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d');

canvas.id = 'pdf-render';
document.getElementById('pdf-viewer').appendChild(canvas);

// Fonction pour calculer l'échelle basée sur la fenêtre d'affichage
// ... code précédent ...

// Fonction pour calculer l'échelle basée sur la fenêtre d'affichage
function calculateScale(page) {
    const headerHeight = document.querySelector('header').offsetHeight;
    const footerHeight = document.querySelector('footer').offsetHeight;
    // Ajustez le `20` pour correspondre à l'espace supplémentaire que vous voulez entre le PDF et le header/footer
    const availableHeight = window.innerHeight - headerHeight - footerHeight - 20;
    const availableWidth = window.innerWidth - 20; // Assurez-vous d'inclure un peu de marge sur les côtés

    const scaleHeight = availableHeight / page.getViewport({ scale: 1 }).height;
    const scaleWidth = availableWidth / page.getViewport({ scale: 1 }).width;

    return Math.min(scaleHeight, scaleWidth);
}

// ... restant du code ...


// Charge et dessine le PDF
function renderPage(num) {
    pageIsRendering = true;

    // Récupère la page
    pdfDoc.getPage(num).then(page => {
        // Calculez l'échelle pour que le PDF s'adapte au viewport
        const scale = calculateScale(page);
        const viewport = page.getViewport({ scale });

        // Mettez à jour la taille du canvas pour correspondre à la vue
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderCtx = {
            canvasContext: ctx,
            viewport: viewport
        };

        page.render(renderCtx).promise.then(() => {
            pageIsRendering = false;

            // Met à jour le texte de navigation
            document.getElementById('page-num').textContent = num;
            document.getElementById('page-count').textContent = pdfDoc.numPages;

            if (pageNumIsPending !== null) {
                renderPage(pageNumIsPending);
                pageNumIsPending = null;
            }
        });
    });
}

function setupEventListeners() {
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');

    // Ajouter des écouteurs d'événements pour la navigation
    prevPageBtn.addEventListener('click', () => {
        if (pageNum <= 1) return;
        pageNum--;
        renderPage(pageNum);
    });

    nextPageBtn.addEventListener('click', () => {
        if (pageNum >= pdfDoc.numPages) return;
        pageNum++;
        renderPage(pageNum);
    });

    // Redimensionner le PDF lors du redimensionnement de la fenêtre
    window.addEventListener('resize', () => {
        if (pdfDoc) {
            renderPage(pageNum);
        }
    });
}

// Charge le document PDF
pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;
    renderPage(pageNum);
    setupEventListeners(); // S'assurer que les écouteurs d'événements sont configurés après le chargement du document
}).catch(function(error) {
    console.error('Error loading PDF: ' + error.message);
});
